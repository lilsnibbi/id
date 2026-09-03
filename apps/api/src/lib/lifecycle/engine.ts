import { and, eq, gt } from "drizzle-orm";

import type { Database } from "../../db";
import { lifecycleActions } from "../../db/schema";
import { disableUser } from "./actions/disable";
import { enableUser } from "./actions/enable";

export async function executeLifecycleAction(
	db: Database,
	action: typeof lifecycleActions.$inferSelect,
) {
	const newerAction = await db
		.select({ id: lifecycleActions.id })
		.from(lifecycleActions)
		.where(
			and(
				eq(lifecycleActions.userId, action.userId),
				gt(lifecycleActions.executeAt, action.executeAt),
			),
		)
		.limit(1);

	if (newerAction[0]) {
		return false;
	}

	switch (action.action) {
		case "disable":
			await disableUser(db, action.userId);
			return true;

		case "enable":
			await enableUser(db, action.userId);
			return true;

		default:
			throw new Error(`Invalid lifecycle action: ${action.action}`);
	}
}
