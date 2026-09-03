/**
 * Encodes bytes as a URL-safe Base64 string without padding.
 *
 * @param bytes The bytes to encode.
 * @returns The Base64URL-encoded value.
 */
export function base64UrlEncode(bytes: Uint8Array) {
	let binary = "";

	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}

	return btoa(binary)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}
