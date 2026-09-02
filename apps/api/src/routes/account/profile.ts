import { Hono } from "hono";
import { eq } from "drizzle-orm";

import { createDb } from "../../db";
import { users } from "../../db/schema";
import { requireAuth } from "../../middleware/auth";

const profile = new Hono<{ Bindings: Env }>();

profile.patch("/", requireAuth, async (c) => {
	const body = await c.req.json();

	if (
		typeof body !== "object" ||
		body === null ||
		!("displayName" in body) ||
		typeof body.displayName !== "string"
	) {
		return c.json(
			{
				error: "Display name must be a string.",
			},
			400,
		);
	}

	const displayName = body.displayName.trim();

	if (displayName.length > 100) {
		return c.json(
			{
				error: "Display name must be 100 characters or fewer.",
			},
			400,
		);
	}

	const user = c.get("user");
	const db = createDb(c.env.DB);

	await db
		.update(users)
		.set({
			displayName: displayName || null,
			updatedAt: Date.now(),
		})
		.where(eq(users.id, user.id));

	return c.json({
		success: true,
	});
});

export default profile;
