import type { Database } from "../../db";
import { disableUser } from "./actions/disable";
import { enableUser } from "./actions/enable";
import type { LifecycleAction } from "./types";

export async function executeLifecycleAction(
	db: Database,
	action: LifecycleAction,
	userId: string,
) {
	switch (action) {
		case "disable":
			await disableUser(db, userId);
			return;

		case "enable":
			await enableUser(db, userId);
			return;
	}
}
