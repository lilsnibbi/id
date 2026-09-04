import type { AuthenticationResponseJSON } from "@simplewebauthn/server";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

import { createDb } from "../../db";
import { passkeys, users } from "../../db/schema";
import { setSessionCookie } from "../../lib/cookie";
import {
	base64ToUint8Array,
	consumeChallenge,
	getChallenge,
} from "../../lib/passkey";
import { createSession } from "../../lib/session";

const loginVerify = new Hono<{
	Bindings: Env;
}>();

interface CloudflareRequestProperties {
	country?: string;
	city?: string;
	region?: string;
}

loginVerify.post("/verify", async (c) => {
	const body = await c.req.json<{
		challengeId?: string;
		response: AuthenticationResponseJSON;
	}>();

	if (!body.challengeId) {
		return c.json(
			{
				error: "Authentication challenge is required.",
			},
			400,
		);
	}

	const db = createDb(c.env.DB);

	const challenge = await getChallenge(db, body.challengeId);

	if (!challenge) {
		return c.json(
			{
				error: "Authentication challenge not found or expired.",
			},
			400,
		);
	}

	const credentialResult = await db
		.select()
		.from(passkeys)
		.where(eq(passkeys.credentialId, body.response.id))
		.limit(1);

	const passkey = credentialResult[0];

	if (!passkey) {
		return c.json(
			{
				error: "Invalid passkey.",
			},
			401,
		);
	}

	const userResult = await db
		.select()
		.from(users)
		.where(eq(users.id, passkey.userId))
		.limit(1);

	const user = userResult[0];

	if (!user) {
		return c.json(
			{
				error: "Unable to sign in with passkey.",
			},
			401,
		);
	}

	try {
		const verification = await verifyAuthenticationResponse({
			response: body.response,
			expectedChallenge: challenge.challenge,
			expectedOrigin: c.env.ORIGIN,
			expectedRPID: c.env.RP_ID,
			credential: {
				id: passkey.credentialId,
				publicKey: base64ToUint8Array(passkey.publicKey),
				counter: passkey.counter,
				transports: passkey.transports
					? JSON.parse(passkey.transports)
					: undefined,
			},
		});

		if (!verification.verified) {
			return c.json(
				{
					error: "Passkey authentication failed.",
				},
				401,
			);
		}

		await db
			.update(passkeys)
			.set({
				counter: verification.authenticationInfo.newCounter,
				lastUsedAt: Date.now(),
			})
			.where(eq(passkeys.id, passkey.id));

		await consumeChallenge(db, body.challengeId);

		const cf = c.req.raw.cf as CloudflareRequestProperties | undefined;

		const session = await createSession(db, user.id, {
			ipAddress: c.req.header("CF-Connecting-IP"),
			country: cf?.country,
			city: cf?.city,
			region: cf?.region,
			userAgent: c.req.header("User-Agent"),
		});

		setSessionCookie(c, session.token);

		return c.json({
			user: {
				id: user.id,
				email: user.email,
			},
		});
	} catch {
		return c.json(
			{
				error: "Unable to verify passkey authentication.",
			},
			400,
		);
	}
});

export default loginVerify;
