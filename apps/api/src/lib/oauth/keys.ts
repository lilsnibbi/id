const ALGORITHM = {
	name: "ECDSA",
	namedCurve: "P-256",
} as const;

const SIGN_ALGORITHM = {
	name: "ECDSA",
	hash: "SHA-256",
} as const;

const KEY_ID = "maze-id-1";

export async function importPrivateKey(privateKey: string) {
	return crypto.subtle.importKey(
		"jwk",
		JSON.parse(privateKey),
		ALGORITHM,
		false,
		["sign"],
	);
}

export async function importPublicKey(publicKey: JsonWebKey) {
	return crypto.subtle.importKey("jwk", publicKey, ALGORITHM, true, ["verify"]);
}

export async function generateKeyPair() {
	return crypto.subtle.generateKey(ALGORITHM, true, ["sign", "verify"]);
}

export async function exportPrivateKey(key: CryptoKey) {
	return crypto.subtle.exportKey("jwk", key);
}

export async function exportPublicKey(key: CryptoKey) {
	const jwk = await crypto.subtle.exportKey("jwk", key);

	return {
		...jwk,
		kid: KEY_ID,
		use: "sig",
		alg: "ES256",
	};
}

export function getPublicJwk(privateKey: string) {
	const jwk = JSON.parse(privateKey) as JsonWebKey;

	return {
		kty: jwk.kty,
		crv: jwk.crv,
		x: jwk.x,
		y: jwk.y,
		kid: KEY_ID,
		use: "sig",
		alg: "ES256",
	};
}

export async function sign(key: CryptoKey, data: Uint8Array) {
	return crypto.subtle.sign(SIGN_ALGORITHM, key, data);
}

export function getKeyId() {
	return KEY_ID;
}
