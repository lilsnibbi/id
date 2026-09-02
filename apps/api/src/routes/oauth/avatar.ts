import { eq } from "drizzle-orm";
import { Hono } from "hono";

import { createDb } from "../../db";
import { users } from "../../db/schema";

const avatar = new Hono<{
	Bindings: Env;
}>();

avatar.get("/:userId", async (c) => {
	const userId = c.req.param("userId");

	if (!userId) {
		return c.notFound();
	}

	const db = createDb(c.env.DB);

	const result = await db
		.select({
			profileImageKey: users.profileImageKey,
		})
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	const user = result[0];

	if (!user?.profileImageKey) {
		return c.notFound();
	}

	const object = await c.env.PROFILE_BUCKET.get(user.profileImageKey);

	if (!object) {
		return c.notFound();
	}

	const headers = new Headers();

	object.writeHttpMetadata(headers);

	headers.set("ETag", object.httpEtag);
	headers.set("Cache-Control", "public, max-age=3600");

	return new Response(object.body, {
		headers,
	});
});

export default avatar;
