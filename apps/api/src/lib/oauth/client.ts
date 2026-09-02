import { eq } from "drizzle-orm";

import type { Database } from "../../db";
import { oauthClients } from "../../db/schema";
import { hashToken } from "../token";

export const OAUTH_CLIENT_TYPES = ["public", "confidential"] as const;

export type OAuthClientType = (typeof OAUTH_CLIENT_TYPES)[number];

export const OIDC_SCOPES = ["openid", "profile", "email"] as const;

export type OIDCScope = (typeof OIDC_SCOPES)[number];

interface CreateOAuthClientInput {
	name: string;
	clientType: OAuthClientType;
	clientSecretHash?: string;
	redirectUris: string[];
	scopes: string[];
}

export async function createOAuthClient(
	db: Database,
	input: CreateOAuthClientInput,
) {
	const now = Date.now();
	const id = crypto.randomUUID();

	await db.insert(oauthClients).values({
		id,
		name: input.name,
		clientType: input.clientType,
		clientSecretHash: input.clientSecretHash,
		redirectUris: JSON.stringify(input.redirectUris),
		scopes: JSON.stringify(input.scopes),
		createdAt: now,
		updatedAt: now,
	});

	return getOAuthClient(db, id);
}

export async function getOAuthClient(db: Database, clientId: string) {
	const result = await db
		.select()
		.from(oauthClients)
		.where(eq(oauthClients.id, clientId))
		.limit(1);

	const client = result[0];

	if (!client) {
		return null;
	}

	return {
		...client,
		redirectUris: parseStringArray(client.redirectUris),
		scopes: parseStringArray(client.scopes),
	};
}

export function validateRedirectUri(
	client: Awaited<ReturnType<typeof getOAuthClient>>,
	redirectUri: string,
) {
	if (!client) {
		return false;
	}

	return client.redirectUris.includes(redirectUri);
}

export function validateClient(
	client: Awaited<ReturnType<typeof getOAuthClient>>,
) {
	return client !== null;
}

export function clientSupportsScope(
	client: Awaited<ReturnType<typeof getOAuthClient>>,
	scope: string,
) {
	if (!client) {
		return false;
	}

	return client.scopes.includes(scope);
}

export function clientSupportsScopes(
	client: Awaited<ReturnType<typeof getOAuthClient>>,
	scopes: string[],
) {
	if (!client) {
		return false;
	}

	return scopes.every((scope) => client.scopes.includes(scope));
}

export function isOAuthClientType(value: string): value is OAuthClientType {
	return OAUTH_CLIENT_TYPES.includes(value as OAuthClientType);
}

function parseStringArray(value: string): string[] {
	try {
		const parsed: unknown = JSON.parse(value);

		if (!Array.isArray(parsed)) {
			return [];
		}

		return parsed.filter((item): item is string => typeof item === "string");
	} catch {
		return [];
	}
}

export async function verifyClientSecret(
	client: Awaited<ReturnType<typeof getOAuthClient>>,
	clientSecret: string,
) {
	if (client?.clientType !== "confidential" || !client?.clientSecretHash) {
		return false;
	}

	const hash = await hashToken(clientSecret);

	return hash === client.clientSecretHash;
}

export async function getOAuthClients(db: Database) {
	const clients = await db
		.select()
		.from(oauthClients)
		.orderBy(oauthClients.createdAt);

	return clients.map((client) => ({
		...client,
		redirectUris: parseStringArray(client.redirectUris),
		scopes: parseStringArray(client.scopes),
	}));
}

export async function updateOAuthClient(
	db: Database,
	clientId: string,
	input: {
		name: string;
		redirectUris: string[];
		scopes: string[];
	},
) {
	await db
		.update(oauthClients)
		.set({
			name: input.name,
			redirectUris: JSON.stringify(input.redirectUris),
			scopes: JSON.stringify(input.scopes),
			updatedAt: Date.now(),
		})
		.where(eq(oauthClients.id, clientId));

	return getOAuthClient(db, clientId);
}
