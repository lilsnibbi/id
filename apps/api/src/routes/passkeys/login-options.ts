import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

import { createDb } from "../../db";
import { passkeys, users } from "../../db/schema";
import { createChallenge } from "../../lib/passkey";

const loginOptions = new Hono<{
	Bindings: Env;
}>();

loginOptions.post("/options", async (c) => {
	const body = await c.req.json<{
		email?: string;
	}>();

	const email = body.email?.trim().toLowerCase();

	if (!email) {
		return c.json({ error: "Email is required." }, 400);
	}

	const db = createDb(c.env.DB);

	const userResult = await db
		.select({
			id: users.id,
		})
		.from(users)
		.where(eq(users.email, email))
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

	const userPasskeys = await db
		.select({
			credentialId: passkeys.credentialId,
		})
		.from(passkeys)
		.where(eq(passkeys.userId, user.id));

	if (userPasskeys.length === 0) {
		return c.json(
			{
				error: "No passkeys are registered for this account.",
			},
			400,
		);
	}

	const options = await generateAuthenticationOptions({
		rpID: c.env.RP_ID,
		allowCredentials: userPasskeys.map(({ credentialId }) => ({
			id: credentialId,
		})),
		userVerification: "preferred",
	});

	await createChallenge(db, user.id, options.challenge);

	return c.json(options);
});

export default loginOptions;
