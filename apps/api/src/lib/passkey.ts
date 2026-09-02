import { eq } from "drizzle-orm";

import type { createDb } from "../db";

import { passkeyChallenges } from "../db/schema";

const CHALLENGE_DURATION = 5 * 60 * 1000;

export function arrayBufferToBase64(buffer: Uint8Array) {
	let binary = "";

	for (const byte of buffer) {
		binary += String.fromCharCode(byte);
	}

	return btoa(binary);
}

export function base64ToUint8Array(value: string) {
	return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

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
