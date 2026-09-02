import { getCookie } from "hono/cookie";
import type { Context, Next } from "hono";

import { createDb } from "../db";
import { getAdminUser, getSessionUser } from "../lib/session";

export type AuthUser = NonNullable<Awaited<ReturnType<typeof getSessionUser>>>;

export type AppEnv = {
	Bindings: Env;
	Variables: {
		user: AuthUser;
	};
};

export async function requireAuth(c: Context<AppEnv>, next: Next) {
	const sessionToken = getCookie(c, "session");

	if (!sessionToken) {
		return c.json(
			{
				error: "unauthorized",
			},
			401,
		);
	}

	const db = createDb(c.env.DB);

	const user = await getSessionUser(db, sessionToken);

	if (!user) {
		return c.json(
			{
				error: "unauthorized",
			},
			401,
		);
	}

	c.set("user", user);

	await next();
}

export async function requireAdmin(c: Context<AppEnv>, next: Next) {
	const sessionToken = getCookie(c, "session");

	if (!sessionToken) {
		return c.json(
			{
				error: "unauthorized",
			},
			401,
		);
	}

	const db = createDb(c.env.DB);

	const user = await getAdminUser(db, sessionToken);

	if (!user) {
		return c.json(
			{
				error: "forbidden",
			},
			403,
		);
	}

	c.set("user", user);

	await next();
}
