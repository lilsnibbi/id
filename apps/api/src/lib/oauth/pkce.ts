import { base64UrlEncode } from "../base64";

const encoder = new TextEncoder();

export async function createCodeChallenge(codeVerifier: string) {
	const data = encoder.encode(codeVerifier);

	const hash = await crypto.subtle.digest("SHA-256", data);

	return base64UrlEncode(new Uint8Array(hash));
}

export async function verifyCodeChallenge(
	codeVerifier: string,
	codeChallenge: string,
) {
	const expected = await createCodeChallenge(codeVerifier);

	return expected === codeChallenge;
}
