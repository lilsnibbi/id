import { and, eq, gt, ne } from "drizzle-orm";

import type { Database } from "../db";
import { sessions, users } from "../db/schema";
import { generateToken, hashToken } from "./token";
import { parseUserAgent } from "./userAgent";

const SESSION_DURATION = 1000 * 60 * 60 * 24 * 30;
const NON_PERSISTENT_SESSION_DURATION = 1000 * 60 * 60;

/**
 * Metadata associated with a user session.
 */
export interface SessionMetadata {
	ipAddress?: string;
	country?: string;
	city?: string;
	region?: string;
	userAgent?: string;
}

/**
 * Creates a new authenticated session for a user.
 *
 * @param db The database connection.
 * @param userId The ID of the user creating the session.
 * @param metadata Optional metadata to associate with the session.
 * @param rememberMe Whether the session should use the persistent duration.
 * @returns The session token, expiration timestamp, and persistence setting.
 */
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

/**
 * Retrieves a session by its plaintext token.
 *
 * Expired sessions are deleted before returning.
 *
 * @param db The database connection.
 * @param token The plaintext session token.
 * @returns The session, or `null` if it does not exist or has expired.
 */
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

/**
 * Retrieves the user associated with a session token.
 *
 * Expired sessions are deleted before returning.
 *
 * @param db The database connection.
 * @param token The plaintext session token.
 * @returns The authenticated user, or `null` if the session is invalid or expired.
 */
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

/**
 * Retrieves the authenticated administrator associated with a session token.
 *
 * @param db The database connection.
 * @param token The plaintext session token.
 * @returns The administrator user, or `null` if the session is invalid or the user is not an administrator.
 */
export async function getAdminUser(db: Database, token: string) {
	const user = await getSessionUser(db, token);

	if (!user?.isAdmin) {
		return null;
	}

	return user;
}

/**
 * Retrieves all active sessions belonging to a user.
 *
 * @param db The database connection.
 * @param userId The ID of the user.
 * @returns The user's non-expired sessions.
 */
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
			and(
				eq(sessions.userId, userId),
				gt(sessions.expiresAt, Date.now()),
			),
		);
}

/**
 * Retrieves a specific session belonging to a user.
 *
 * @param db The database connection.
 * @param userId The ID of the user.
 * @param sessionId The ID of the session to retrieve.
 * @returns The session, or `null` if it does not belong to the user or does not exist.
 */
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

/**
 * Updates the last-used timestamp for a session.
 *
 * @param db The database connection.
 * @param sessionId The ID of the session to update.
 */
export async function touchSession(db: Database, sessionId: string) {
	await db
		.update(sessions)
		.set({
			lastUsedAt: Date.now(),
		})
		.where(eq(sessions.id, sessionId));
}

/**
 * Deletes a session identified by its plaintext token.
 *
 * @param db The database connection.
 * @param token The plaintext session token.
 */
export async function deleteSession(db: Database, token: string) {
	const tokenHash = await hashToken(token);

	await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
}

/**
 * Deletes all sessions for a user except the current session.
 *
 * @param db The database connection.
 * @param userId The ID of the user whose sessions should be deleted.
 * @param currentSessionId The ID of the session to preserve.
 */
export async function deleteOtherSessions(
	db: Database,
	userId: string,
	currentSessionId: string,
) {
	await db
		.delete(sessions)
		.where(
			and(eq(sessions.userId, userId), ne(sessions.id, currentSessionId)),
		);
}

/**
 * Deletes all sessions belonging to a user.
 *
 * @param db The database connection.
 * @param userId The ID of the user whose sessions should be deleted.
 */
export async function deleteAllSessions(db: Database, userId: string) {
	await db.delete(sessions).where(eq(sessions.userId, userId));
}
