import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { createDb } from "../../db";
import { sessions } from "../../db/schema";
import {
	deleteOtherSessions,
	getSession,
	getUserSession,
	getUserSessions,
} from "../../lib/session";

const sessionsRoute = new Hono<{
	Bindings: Env;
}>();

sessionsRoute.get("/", async (c) => {
	const token = getCookie(c, "session");

	if (!token) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const db = createDb(c.env.DB);
	const currentSession = await getSession(db, token);

	if (!currentSession) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const userSessions = await getUserSessions(db, currentSession.userId);

	return c.json({
		sessions: userSessions.map((session) => ({
			...session,
			current: session.id === currentSession.id,
		})),
	});
});

sessionsRoute.post("/:id/revoke", async (c) => {
	const token = getCookie(c, "session");

	if (!token) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const db = createDb(c.env.DB);
	const currentSession = await getSession(db, token);

	if (!currentSession) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const session = await getUserSession(
		db,
		currentSession.userId,
		c.req.param("id"),
	);

	if (!session) {
		return c.json({ error: "Session not found" }, 404);
	}

	await db.delete(sessions).where(eq(sessions.id, session.id));

	return c.json({
		success: true,
	});
});

sessionsRoute.post("/revoke-all", async (c) => {
	const token = getCookie(c, "session");

	if (!token) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const db = createDb(c.env.DB);
	const currentSession = await getSession(db, token);

	if (!currentSession) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	await deleteOtherSessions(db, currentSession.userId, currentSession.id);

	return c.json({
		success: true,
	});
});

export default sessionsRoute;
