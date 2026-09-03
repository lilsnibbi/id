import { and, eq, gt } from "drizzle-orm";

import type { Database } from "../../db";
import { lifecycleActions } from "../../db/schema";
import { disableUser } from "./actions/disable";
import { enableUser } from "./actions/enable";
import { LIFECYCLE_ACTIONS } from "./types";

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

	if (
		!LIFECYCLE_ACTIONS.includes(
			action.action as (typeof LIFECYCLE_ACTIONS)[number],
		)
	) {
		throw new Error(`Invalid lifecycle action: ${action.action}`);
	}

	switch (action.action) {
		case "disable":
			await disableUser(db, action.userId);
			break;

		case "enable":
			await enableUser(db, action.userId);
			break;
	}

	return true;
}
