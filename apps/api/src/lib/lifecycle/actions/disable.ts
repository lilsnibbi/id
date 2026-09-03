import { eq } from "drizzle-orm";

import type { Database } from "../../../db";
import { users } from "../../../db/schema";

export async function disableUser(db: Database, userId: string) {
	await db
		.update(users)
		.set({
			disabledAt: Date.now(),
			updatedAt: Date.now(),
		})
		.where(eq(users.id, userId));
}
