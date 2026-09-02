import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { createDb } from "../../db";
import { clearSessionCookie } from "../../lib/cookie";
import { deleteSession } from "../../lib/session";

const logout = new Hono<{ Bindings: Env }>();

logout.post("/", async (c) => {
	const token = getCookie(c, "session");

	if (token) {
		const db = createDb(c.env.DB);

		await deleteSession(db, token);
	}

	clearSessionCookie(c);

	return c.json({
		success: true,
	});
});

export default logout;
