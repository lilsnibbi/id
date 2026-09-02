const encoder = new TextEncoder();

function toHex(bytes: Uint8Array): string {
	return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
		"",
	);
}

export function generateToken(): string {
	const bytes = new Uint8Array(32);

	crypto.getRandomValues(bytes);

	return toHex(bytes);
}

export async function hashToken(token: string): Promise<string> {
	const data = encoder.encode(token);

	const hash = await crypto.subtle.digest("SHA-256", data);

	return toHex(new Uint8Array(hash));
}
