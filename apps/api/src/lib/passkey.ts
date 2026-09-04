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
 * Creates a passkey challenge.
 *
 * The challenge is not associated with a user because passkey
 * authentication can be usernameless. The user is identified
 * after the authenticator returns a credential.
 *
 * @param db The database connection.
 * @param challenge The challenge value.
 * @returns The challenge ID, challenge value, and expiration timestamp.
 */
export async function createChallenge(
	db: ReturnType<typeof createDb>,
	challenge: string,
) {
	const now = Date.now();
	const expiresAt = now + CHALLENGE_DURATION;
	const id = crypto.randomUUID();

	await db.insert(passkeyChallenges).values({
		id,
		challenge,
		expiresAt,
		createdAt: now,
	});

	return {
		id,
		challenge,
		expiresAt,
	};
}

/**
 * Retrieves an active passkey challenge by its ID.
 *
 * Expired challenges are deleted before returning.
 *
 * @param db The database connection.
 * @param id The challenge ID.
 * @returns The active challenge, or `null` if none exists or it has expired.
 */
export async function getChallenge(
	db: ReturnType<typeof createDb>,
	id: string,
) {
	const result = await db
		.select()
		.from(passkeyChallenges)
		.where(eq(passkeyChallenges.id, id))
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
 * Retrieves and consumes an active passkey challenge.
 *
 * The challenge is deleted after retrieval so it cannot be reused.
 *
 * @param db The database connection.
 * @param id The challenge ID.
 * @returns The consumed challenge, or `null` if none exists or it has expired.
 */
export async function consumeChallenge(
	db: ReturnType<typeof createDb>,
	id: string,
) {
	const challenge = await getChallenge(db, id);

	if (!challenge) {
		return null;
	}

	await db
		.delete(passkeyChallenges)
		.where(eq(passkeyChallenges.id, challenge.id));

	return challenge;
}
