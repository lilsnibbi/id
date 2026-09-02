import { and, eq, isNull } from "drizzle-orm";

import type { Database } from "../../db";
import {
	oauthAccessTokens,
	oauthGrants,
	oauthRefreshTokens,
} from "../../db/schema";

export async function grantOAuthAccess(
	db: Database,
	input: {
		userId: string;
		clientId: string;
		scopes: string[];
	},
) {
	const now = Date.now();

	const existing = await db
		.select()
		.from(oauthGrants)
		.where(
			and(
				eq(oauthGrants.userId, input.userId),
				eq(oauthGrants.clientId, input.clientId),
			),
		)
		.limit(1);

	if (existing[0]) {
		await db
			.update(oauthGrants)
			.set({
				scopes: JSON.stringify(input.scopes),
				grantedAt: now,
				revokedAt: null,
			})
			.where(eq(oauthGrants.id, existing[0].id));

		return;
	}

	await db.insert(oauthGrants).values({
		id: crypto.randomUUID(),
		userId: input.userId,
		clientId: input.clientId,
		scopes: JSON.stringify(input.scopes),
		grantedAt: now,
	});
}

export async function revokeOAuthAccess(
	db: Database,
	userId: string,
	clientId: string,
) {
	const now = Date.now();

	await db
		.update(oauthGrants)
		.set({
			revokedAt: now,
		})
		.where(
			and(
				eq(oauthGrants.userId, userId),
				eq(oauthGrants.clientId, clientId),
				isNull(oauthGrants.revokedAt),
			),
		);

	await db
		.update(oauthAccessTokens)
		.set({
			revokedAt: now,
		})
		.where(
			and(
				eq(oauthAccessTokens.userId, userId),
				eq(oauthAccessTokens.clientId, clientId),
				isNull(oauthAccessTokens.revokedAt),
			),
		);

	await db
		.update(oauthRefreshTokens)
		.set({
			revokedAt: now,
		})
		.where(
			and(
				eq(oauthRefreshTokens.userId, userId),
				eq(oauthRefreshTokens.clientId, clientId),
				isNull(oauthRefreshTokens.revokedAt),
			),
		);
}
