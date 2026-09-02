import { Hono } from "hono";
import { getCookie } from "hono/cookie";

import { createDb } from "../../db";
import { getSessionUser } from "../../lib/session";

const me = new Hono<{ Bindings: Env }>();

me.get("/", async (c) => {
	const token = getCookie(c, "session");

	if (!token) {
		return c.json(
			{
				error: "Unauthorized",
			},
			401,
		);
	}

	const db = createDb(c.env.DB);
	const user = await getSessionUser(db, token);

	if (!user) {
		return c.json(
			{
				error: "Unauthorized",
			},
			401,
		);
	}

	return c.json({
		user: {
			id: user.id,
			email: user.email,
			displayName: user.displayName,
			emailVerifiedAt: user.emailVerifiedAt,
			createdAt: user.createdAt,
			isAdmin: user.isAdmin,
			profileImageKey: user.profileImageKey,
		},
	});
});

export default me;
