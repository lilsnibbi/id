import { and, eq, isNull } from "drizzle-orm";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";

import { createDb } from "./../../db";
import { oauthClients, oauthGrants } from "./../../db/schema";
import { revokeOAuthAccess } from "./../../lib/oauth/grant";
import { getSessionUser } from "./../../lib/session";
import { requireAuth } from "../../middleware/auth";

const oauthAccountRoute = new Hono<{
	Bindings: Env;
}>();

oauthAccountRoute.get("/grants", requireAuth, async (c) => {
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

	const grants = await db
		.select({
			clientId: oauthClients.id,
			clientName: oauthClients.name,
			scopes: oauthGrants.scopes,
			grantedAt: oauthGrants.grantedAt,
		})
		.from(oauthGrants)
		.innerJoin(oauthClients, eq(oauthClients.id, oauthGrants.clientId))
		.where(and(eq(oauthGrants.userId, user.id), isNull(oauthGrants.revokedAt)));

	return c.json({
		grants: grants.map((grant) => ({
			clientId: grant.clientId,
			clientName: grant.clientName,
			scopes: JSON.parse(grant.scopes) as string[],
			grantedAt: grant.grantedAt,
		})),
	});
});

oauthAccountRoute.delete("/grants/:clientId", async (c) => {
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

	const clientId = c.req.param("clientId");

	if (!clientId) {
		return c.json(
			{
				error: "client_not_found",
			},
			404,
		);
	}

	await revokeOAuthAccess(db, user.id, clientId);

	return c.json({
		success: true,
	});
});

export default oauthAccountRoute;
