import { and, eq, gt, ne } from "drizzle-orm";
import type { Database } from "../db";
import { sessions, users } from "../db/schema";
import { generateToken, hashToken } from "./token";
import { parseUserAgent } from "./userAgent";

const SESSION_DURATION = 1000 * 60 * 60 * 24 * 30;

const NON_PERSISTENT_SESSION_DURATION = 1000 * 60 * 60;

export interface SessionMetadata {
	ipAddress?: string;
	country?: string;
	city?: string;
	region?: string;
	userAgent?: string;
}

export async function createSession(
	db: Database,
	userId: string,
	metadata: SessionMetadata = {},
	rememberMe = true,
) {
	const token = generateToken();
	const tokenHash = await hashToken(token);
	const now = Date.now();

	const parsedUserAgent = metadata.userAgent
		? parseUserAgent(metadata.userAgent)
		: null;

	const expiresAt = rememberMe
		? now + SESSION_DURATION
		: now + NON_PERSISTENT_SESSION_DURATION;

	await db.insert(sessions).values({
		id: crypto.randomUUID(),
		userId,
		tokenHash,
		ipAddress: metadata.ipAddress,
		country: metadata.country,
		city: metadata.city,
		region: metadata.region,
		userAgent: metadata.userAgent,
		browser: parsedUserAgent?.browser,
		os: parsedUserAgent?.os,
		expiresAt,
		createdAt: now,
		lastUsedAt: now,
	});

	return {
		token,
		expiresAt,
		rememberMe,
	};
}

export async function getSession(db: Database, token: string) {
	const tokenHash = await hashToken(token);

	const result = await db
		.select()
		.from(sessions)
		.where(eq(sessions.tokenHash, tokenHash))
		.limit(1);

	const session = result[0];

	if (!session) {
		return null;
	}

	if (session.expiresAt <= Date.now()) {
		await db.delete(sessions).where(eq(sessions.id, session.id));

		return null;
	}

	return session;
}

export async function getSessionUser(db: Database, token: string) {
	const tokenHash = await hashToken(token);

	const result = await db
		.select({
			session: sessions,
			user: users,
		})
		.from(sessions)
		.innerJoin(users, eq(sessions.userId, users.id))
		.where(eq(sessions.tokenHash, tokenHash))
		.limit(1);

	const record = result[0];

	if (!record) {
		return null;
	}

	if (record.session.expiresAt <= Date.now()) {
		await db.delete(sessions).where(eq(sessions.id, record.session.id));

		return null;
	}

	return record.user;
}

export async function getAdminUser(db: Database, token: string) {
	const user = await getSessionUser(db, token);

	if (!user?.isAdmin) {
		return null;
	}

	return user;
}

export async function getUserSessions(db: Database, userId: string) {
	return await db
		.select({
			id: sessions.id,
			createdAt: sessions.createdAt,
			expiresAt: sessions.expiresAt,
			ipAddress: sessions.ipAddress,
			country: sessions.country,
			city: sessions.city,
			region: sessions.region,
			browser: sessions.browser,
			os: sessions.os,
		})
		.from(sessions)
		.where(
			and(eq(sessions.userId, userId), gt(sessions.expiresAt, Date.now())),
		);
}

export async function getUserSession(
	db: Database,
	userId: string,
	sessionId: string,
) {
	const result = await db
		.select({
			id: sessions.id,
			userId: sessions.userId,
		})
		.from(sessions)
		.where(and(eq(sessions.id, sessionId), eq(sessions.userId, userId)))
		.limit(1);

	return result[0] ?? null;
}

export async function touchSession(db: Database, sessionId: string) {
	await db
		.update(sessions)
		.set({
			lastUsedAt: Date.now(),
		})
		.where(eq(sessions.id, sessionId));
}

export async function deleteSession(db: Database, token: string) {
	const tokenHash = await hashToken(token);

	await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
}

export async function deleteOtherSessions(
	db: Database,
	userId: string,
	currentSessionId: string,
) {
	await db
		.delete(sessions)
		.where(and(eq(sessions.userId, userId), ne(sessions.id, currentSessionId)));
}

export async function deleteAllSessions(db: Database, userId: string) {
	await db.delete(sessions).where(eq(sessions.userId, userId));
}
