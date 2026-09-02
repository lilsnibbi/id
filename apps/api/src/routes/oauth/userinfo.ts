import { eq } from "drizzle-orm";

import { Hono } from "hono";

import { createDb } from "../../db";
import { users } from "../../db/schema";
import { getAccessToken } from "../../lib/oauth/tokens";

const userinfoRoute = new Hono<{
	Bindings: Env;
}>();

userinfoRoute.get("/", async (c) => {
	const authorization = c.req.header("Authorization");

	if (!authorization?.startsWith("Bearer ")) {
		return c.json(
			{
				error: "invalid_token",
			},
			401,
		);
	}

	const token = authorization.slice(7);

	if (!token) {
		return c.json(
			{
				error: "invalid_token",
			},
			401,
		);
	}

	const db = createDb(c.env.DB);
	const accessToken = await getAccessToken(db, token);

	if (!accessToken) {
		return c.json(
			{
				error: "invalid_token",
			},
			401,
		);
	}

	const result = await db
		.select()
		.from(users)
		.where(eq(users.id, accessToken.userId))
		.limit(1);

	const user = result[0];

	if (!user) {
		return c.json(
			{
				error: "invalid_token",
			},
			401,
		);
	}

	const scopes = JSON.parse(accessToken.scope) as string[];

	const claims: Record<string, unknown> = {
		sub: user.id,
	};

	if (scopes.includes("profile")) {
		if (user.displayName) {
			claims.name = user.displayName;
		}

		if (user.profileImageKey) {
			const origin = new URL(c.req.url).origin;

			claims.picture = `${origin}/oauth/avatar/${encodeURIComponent(user.id)}`;
		}
	}

	if (scopes.includes("email")) {
		claims.email = user.email;
		claims.email_verified = user.emailVerifiedAt !== null;
	}

	return c.json(claims);
});

export default userinfoRoute;
