import { Hono } from "hono";
import { getCookie } from "hono/cookie";

import { createDb } from "../../db";
import { oauthAuthorizationCodes } from "../../db/schema";
import {
	clientSupportsScopes,
	getOAuthClient,
	validateRedirectUri,
} from "../../lib/oauth/client";
import { grantOAuthAccess } from "../../lib/oauth/grant";
import { getSessionUser } from "../../lib/session";
import { hashToken } from "../../lib/token";

const AUTHORIZATION_CODE_DURATION = 60 * 1000;

const approveRoute = new Hono<{
	Bindings: Env;
}>();

approveRoute.post("/", async (c) => {
	const body = await c.req.json<{
		client_id: string;
		redirect_uri: string;
		response_type: string;
		scope: string;
		state?: string;
		nonce?: string;
		code_challenge: string;
		code_challenge_method: string;
	}>();

	if (
		!body.client_id ||
		!body.redirect_uri ||
		!body.response_type ||
		!body.scope ||
		!body.code_challenge ||
		!body.code_challenge_method
	) {
		return c.json(
			{
				error: "invalid_request",
				error_description: "Missing required parameters.",
			},
			400,
		);
	}

	if (body.response_type !== "code") {
		return c.json(
			{
				error: "unsupported_response_type",
				error_description:
					"Only the authorization code flow is supported.",
			},
			400,
		);
	}

	if (body.code_challenge_method !== "S256") {
		return c.json(
			{
				error: "invalid_request",
				error_description: "Only S256 PKCE is supported.",
			},
			400,
		);
	}

	// RFC 7636 S256 code challenges are base64url-encoded SHA-256 hashes.
	if (!/^[A-Za-z0-9_-]{43}$/.test(body.code_challenge)) {
		return c.json(
			{
				error: "invalid_request",
				error_description: "Invalid PKCE code challenge.",
			},
			400,
		);
	}

	const db = createDb(c.env.DB);

	const client = await getOAuthClient(db, body.client_id);

	if (!client) {
		return c.json(
			{
				error: "invalid_request",
				error_description: "Unknown client.",
			},
			400,
		);
	}

	if (!validateRedirectUri(client, body.redirect_uri)) {
		return c.json(
			{
				error: "invalid_request",
				error_description: "Invalid redirect URI.",
			},
			400,
		);
	}

	const scopes = [...new Set(body.scope.split(" ").filter(Boolean))];

	if (!scopes.includes("openid")) {
		return c.json(
			{
				error: "invalid_scope",
				error_description: "The openid scope is required.",
			},
			400,
		);
	}

	if (!clientSupportsScopes(client, scopes)) {
		return c.json(
			{
				error: "invalid_scope",
				error_description:
					"One or more requested scopes are not allowed.",
			},
			400,
		);
	}

	const sessionToken = getCookie(c, "session");

	if (!sessionToken) {
		return c.json(
			{
				error: "login_required",
			},
			401,
		);
	}

	const user = await getSessionUser(db, sessionToken);

	if (!user) {
		return c.json(
			{
				error: "login_required",
			},
			401,
		);
	}

	await grantOAuthAccess(db, {
		userId: user.id,
		clientId: client.id,
		scopes,
	});

	const code = crypto.randomUUID();
	const codeHash = await hashToken(code);
	const now = Date.now();

	await db.insert(oauthAuthorizationCodes).values({
		id: crypto.randomUUID(),
		clientId: client.id,
		userId: user.id,
		codeHash,
		redirectUri: body.redirect_uri,
		scope: JSON.stringify(scopes),
		nonce: body.nonce,
		codeChallenge: body.code_challenge,
		codeChallengeMethod: body.code_challenge_method,
		expiresAt: now + AUTHORIZATION_CODE_DURATION,
		createdAt: now,
	});

	const location = new URL(body.redirect_uri);

	location.searchParams.set("code", code);

	if (body.state) {
		location.searchParams.set("state", body.state);
	}

	return c.json({
		redirect_uri: location.toString(),
	});
});

export default approveRoute;
