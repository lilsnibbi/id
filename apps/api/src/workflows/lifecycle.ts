import { eq } from "drizzle-orm";
import {
	WorkflowEntrypoint,
	type WorkflowEvent,
	type WorkflowStep,
} from "cloudflare:workers";

import { createDb } from "../db";
import { lifecycleActions } from "../db/schema";
import { executeLifecycleAction } from "../lib/lifecycle/execute";
import type { LifecycleAction } from "../lib/lifecycle/types";

export interface LifecycleWorkflowParams {
	lifecycleActionId: string;
}

export class LifecycleWorkflow extends WorkflowEntrypoint<
	Env,
	LifecycleWorkflowParams
> {
	override async run(
		event: WorkflowEvent<LifecycleWorkflowParams>,
		step: WorkflowStep,
	) {
		const { lifecycleActionId } = event.payload;

		const db = createDb(this.env.DB);

		const result = await db
			.select()
			.from(lifecycleActions)
			.where(eq(lifecycleActions.id, lifecycleActionId))
			.limit(1);

		const action = result[0] ?? null;

		if (action.status !== "pending") {
			return;
		}

		await step.sleepUntil(
			"wait until execution time",
			new Date(action.executeAt),
		);

		const currentResult = await db
			.select()
			.from(lifecycleActions)
			.where(eq(lifecycleActions.id, lifecycleActionId))
			.limit(1);

		const currentAction = currentResult[0] ?? null;

		if (
			currentAction.status !== "pending" ||
			currentAction.cancelledAt !== null
		) {
			return;
		}

		await db
			.update(lifecycleActions)
			.set({
				status: "processing",
				updatedAt: Date.now(),
			})
			.where(eq(lifecycleActions.id, lifecycleActionId));

		try {
			await step.do("execute lifecycle action", async () => {
				const db = createDb(this.env.DB);

				await executeLifecycleAction(
					db,
					currentAction.action as LifecycleAction,
					currentAction.userId,
				);
			});

			const now = Date.now();

			await db
				.update(lifecycleActions)
				.set({
					status: "completed",
					executedAt: now,
					updatedAt: now,
				})
				.where(eq(lifecycleActions.id, lifecycleActionId));
		} catch (error) {
			const now = Date.now();
			const message =
				error instanceof Error ? error.message : String(error);

			await db
				.update(lifecycleActions)
				.set({
					status: "failed",
					error: message,
					updatedAt: now,
				})
				.where(eq(lifecycleActions.id, lifecycleActionId));

			throw error;
		}
	}
}
