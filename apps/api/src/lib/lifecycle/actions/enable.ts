import { eq } from "drizzle-orm";

import type { Database } from "../../../db";
import { users } from "../../../db/schema";

export async function enableUser(db: Database, userId: string) {
	await db
		.update(users)
		.set({
			disabledAt: null,
			updatedAt: Date.now(),
		})
		.where(eq(users.id, userId));
}
