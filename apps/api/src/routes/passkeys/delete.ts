import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";

import { createDb } from "../../db";
import { passkeys } from "../../db/schema";
import { getSessionUser } from "../../lib/session";

const deletePasskey = new Hono<{
	Bindings: Env;
}>();

deletePasskey.delete("/:id", async (c) => {
	const token = getCookie(c, "session");

	if (!token) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const db = createDb(c.env.DB);
	const user = await getSessionUser(db, token);

	if (!user) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const passkeyId = c.req.param("id");

	const result = await db
		.select({
			id: passkeys.id,
			userId: passkeys.userId,
		})
		.from(passkeys)
		.where(eq(passkeys.id, passkeyId))
		.limit(1);

	const passkey = result[0];

	if (!passkey || passkey.userId !== user.id) {
		return c.json({ error: "Passkey not found." }, 404);
	}

	await db.delete(passkeys).where(eq(passkeys.id, passkeyId));

	return c.json({
		success: true,
	});
});

export default deletePasskey;
