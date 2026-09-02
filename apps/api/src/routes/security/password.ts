import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { createDb } from "../../db";
import { users } from "../../db/schema";
import { hashPassword, verifyPassword } from "../../lib/password.ts";
import {
	deleteOtherSessions,
	getSession,
	getSessionUser,
} from "../../lib/session";

const password = new Hono<{ Bindings: Env }>();

password.post("/", async (c) => {
	const token = getCookie(c, "session");

	if (!token) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const body = await c.req.json<{
		currentPassword?: string;
		newPassword?: string;
	}>();

	const currentPassword = body.currentPassword;
	const newPassword = body.newPassword;

	if (!currentPassword || !newPassword) {
		return c.json(
			{
				error: "Current password and new password are required",
			},
			400,
		);
	}

	if (newPassword.length < 8) {
		return c.json(
			{
				error: "New password must be at least 8 characters",
			},
			400,
		);
	}

	const db = createDb(c.env.DB);

	const session = await getSession(db, token);

	if (!session) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const user = await getSessionUser(db, token);

	if (!user) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const result = await db
		.select({
			id: users.id,
			passwordHash: users.passwordHash,
		})
		.from(users)
		.where(eq(users.id, user.id))
		.limit(1);

	const account = result[0];

	if (!account) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const validPassword = await verifyPassword(
		currentPassword,
		account.passwordHash,
	);

	if (!validPassword) {
		return c.json(
			{
				error: "Current password is incorrect",
			},
			400,
		);
	}

	const useArgon2id = await c.env.FLAGS.getBooleanValue(
		"use-argon-2-id",
		false,
	);

	const passwordHash = await hashPassword(newPassword, useArgon2id);

	await db
		.update(users)
		.set({
			passwordHash,
			updatedAt: Date.now(),
		})
		.where(eq(users.id, user.id));

	await deleteOtherSessions(db, user.id, session.id);

	return c.json({
		success: true,
	});
});

export default password;
