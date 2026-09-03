import { and, eq } from "drizzle-orm";

import type { Database } from "../../db";
import { lifecycleActions } from "../../db/schema";

export async function claimLifecycleAction(
	db: Database,
	lifecycleActionId: string,
) {
	const now = Date.now();

	const result = await db
		.update(lifecycleActions)
		.set({
			status: "processing",
			updatedAt: now,
		})
		.where(
			and(
				eq(lifecycleActions.id, lifecycleActionId),
				eq(lifecycleActions.status, "pending"),
			),
		)
		.returning();

	return result[0] ?? null;
}
