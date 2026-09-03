import { eq } from "drizzle-orm";
import {
	WorkflowEntrypoint,
	type WorkflowEvent,
	type WorkflowStep,
} from "cloudflare:workers";

import { createDb } from "../db";
import { lifecycleActions } from "../db/schema";

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

		console.log("Loaded lifecycle action:", action);

		if (!action) {
			return;
		}

		await step.sleepUntil(
			"wait until execution time",
			new Date(action.executeAt),
		);

		await step.do("execute lifecycle action", async () => {
			console.log(`Executing lifecycle action ${action.id}`);
		});
	}
}
