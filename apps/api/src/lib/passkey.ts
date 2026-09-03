import { eq } from "drizzle-orm";

import type { createDb } from "../db";
import { passkeyChallenges } from "../db/schema";

const CHALLENGE_DURATION = 5 * 60 * 1000;

/**
 * Encodes a byte array as a Base64 string.
 *
 * @param buffer The bytes to encode.
 * @returns The Base64-encoded value.
 */
export function arrayBufferToBase64(buffer: Uint8Array) {
	let binary = "";

	for (const byte of buffer) {
		binary += String.fromCharCode(byte);
	}

	return btoa(binary);
}

/**
 * Decodes a Base64 string into a byte array.
 *
 * @param value The Base64-encoded value to decode.
 * @returns The decoded bytes.
 */
export function base64ToUint8Array(value: string) {
	return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

/**
 * Creates a passkey challenge for a user.
 *
 * Any existing challenge for the user is removed before the new challenge
 * is stored.
 *
 * @param db The database connection.
 * @param userId The ID of the user the challenge belongs to.
 * @param challenge The challenge value.
 * @returns The challenge and its expiration timestamp.
 */
export async function createChallenge(
	db: ReturnType<typeof createDb>,
	userId: string,
	challenge: string,
) {
	const now = Date.now();
	const expiresAt = now + CHALLENGE_DURATION;

	await db
		.delete(passkeyChallenges)
		.where(eq(passkeyChallenges.userId, userId));

	await db.insert(passkeyChallenges).values({
		id: crypto.randomUUID(),
		userId,
		challenge,
		expiresAt,
		createdAt: now,
	});

	return {
		challenge,
		expiresAt,
	};
}

/**
 * Retrieves the active passkey challenge for a user.
 *
 * Expired challenges are deleted before returning.
 *
 * @param db The database connection.
 * @param userId The ID of the user the challenge belongs to.
 * @returns The active challenge, or `null` if none exists or it has expired.
 */
export async function getChallenge(
	db: ReturnType<typeof createDb>,
	userId: string,
) {
	const result = await db
		.select()
		.from(passkeyChallenges)
		.where(eq(passkeyChallenges.userId, userId))
		.limit(1);

	const challenge = result[0];

	if (!challenge) {
		return null;
	}

	if (challenge.expiresAt <= Date.now()) {
		await db
			.delete(passkeyChallenges)
			.where(eq(passkeyChallenges.id, challenge.id));

		return null;
	}

	return challenge;
}

/**
 * Retrieves and consumes the active passkey challenge for a user.
 *
 * @param db The database connection.
 * @param userId The ID of the user the challenge belongs to.
 * @returns The consumed challenge, or `null` if none exists or it has expired.
 */
export async function consumeChallenge(
	db: ReturnType<typeof createDb>,
	userId: string,
) {
	const challenge = await getChallenge(db, userId);

	if (!challenge) {
		return null;
	}

	await db
		.delete(passkeyChallenges)
		.where(eq(passkeyChallenges.id, challenge.id));

	return challenge;
}
