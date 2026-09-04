import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { Hono } from "hono";

import { createDb } from "../../db";
import { createChallenge } from "../../lib/passkey";

const loginOptions = new Hono<{
	Bindings: Env;
}>();

loginOptions.post("/options", async (c) => {
	const db = createDb(c.env.DB);

	const options = await generateAuthenticationOptions({
		rpID: c.env.RP_ID,
		userVerification: "preferred",
	});

	const challenge = await createChallenge(db, null, options.challenge);

	return c.json({
		...options,
		challengeId: challenge.id,
	});
});

export default loginOptions;
