import { eq } from "drizzle-orm";

import type { Database } from "../../db";
import { oauthAccessTokens, oauthRefreshTokens } from "../../db/schema";

import { generateToken, hashToken } from "../token";

export const ACCESS_TOKEN_DURATION = 1000 * 60 * 60;

export const REFRESH_TOKEN_DURATION = 1000 * 60 * 60 * 24 * 30;

export async function createAccessToken(
	db: Database,
	clientId: string,
	userId: string,
	scope: string,
) {
	const token = generateToken();
	const now = Date.now();
	const expiresAt = now + ACCESS_TOKEN_DURATION;

	await db.insert(oauthAccessTokens).values({
		id: crypto.randomUUID(),
		clientId,
		userId,
		tokenHash: await hashToken(token),
		scope,
		expiresAt,
		createdAt: now,
	});

	return {
		token,
		expiresAt,
	};
}

export async function createRefreshToken(
	db: Database,
	clientId: string,
	userId: string,
	scope: string,
) {
	const token = generateToken();
	const now = Date.now();
	const expiresAt = now + REFRESH_TOKEN_DURATION;

	await db.insert(oauthRefreshTokens).values({
		id: crypto.randomUUID(),
		clientId,
		userId,
		tokenHash: await hashToken(token),
		scope,
		expiresAt,
		createdAt: now,
	});

	return {
		token,
		expiresAt,
	};
}

export async function getAccessToken(db: Database, token: string) {
	const tokenHash = await hashToken(token);

	const result = await db
		.select()
		.from(oauthAccessTokens)
		.where(eq(oauthAccessTokens.tokenHash, tokenHash))
		.limit(1);

	const accessToken = result[0];

	if (!accessToken) {
		return null;
	}

	if (accessToken.expiresAt <= Date.now() || accessToken.revokedAt !== null) {
		return null;
	}

	return accessToken;
}

export async function getRefreshToken(db: Database, token: string) {
	const tokenHash = await hashToken(token);

	const result = await db
		.select()
		.from(oauthRefreshTokens)
		.where(eq(oauthRefreshTokens.tokenHash, tokenHash))
		.limit(1);

	const refreshToken = result[0];

	if (!refreshToken) {
		return null;
	}

	if (refreshToken.expiresAt <= Date.now() || refreshToken.revokedAt !== null) {
		return null;
	}

	return refreshToken;
}

export async function revokeAccessToken(db: Database, token: string) {
	const tokenHash = await hashToken(token);

	await db
		.update(oauthAccessTokens)
		.set({
			revokedAt: Date.now(),
		})
		.where(eq(oauthAccessTokens.tokenHash, tokenHash));
}

export async function revokeRefreshToken(db: Database, token: string) {
	const tokenHash = await hashToken(token);

	await db
		.update(oauthRefreshTokens)
		.set({
			revokedAt: Date.now(),
		})
		.where(eq(oauthRefreshTokens.tokenHash, tokenHash));
}
