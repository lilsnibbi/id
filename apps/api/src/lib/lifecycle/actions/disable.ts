import { eq } from "drizzle-orm";

import type { Database } from "../../../db";
import { users } from "../../../db/schema";

/**
 * Disables a user by setting their disabled timestamp.
 *
 * @param db The database connection.
 * @param userId The ID of the user to disable.
 */
export async function disableUser(db: Database, userId: string) {
	await db
		.update(users)
		.set({
			disabledAt: Date.now(),
			updatedAt: Date.now(),
		})
		.where(eq(users.id, userId));
}
