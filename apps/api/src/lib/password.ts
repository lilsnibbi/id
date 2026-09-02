import { argon2id, argon2Verify, setWASMModules } from "argon2-wasm-edge";

// @ts-expect-error Cloudflare Workers WASM module import
import argon2WASM from "argon2-wasm-edge/wasm/argon2.wasm";

// @ts-expect-error Cloudflare Workers WASM module import
import blake2bWASM from "argon2-wasm-edge/wasm/blake2b.wasm";

setWASMModules({
	argon2WASM,
	blake2bWASM,
});

const ITERATIONS = 100_000;

const KEY_LENGTH = 256;

const SALT_LENGTH = 16;

const ARGON2_MEMORY_SIZE = 64 * 1024;

const ARGON2_ITERATIONS = 2;

const ARGON2_PARALLELISM = 1;

const ARGON2_HASH_LENGTH = 32;

const encoder = new TextEncoder();

function toBase64(bytes: Uint8Array): string {
	let binary = "";

	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}

	return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
	const binary = atob(value);
	const bytes = new Uint8Array(binary.length);

	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}

	return bytes;
}

async function derivePasswordHash(
	password: string,
	salt: Uint8Array,
	iterations: number,
): Promise<Uint8Array> {
	const key = await crypto.subtle.importKey(
		"raw",
		encoder.encode(password),
		"PBKDF2",
		false,
		["deriveBits"],
	);

	const bits = await crypto.subtle.deriveBits(
		{
			name: "PBKDF2",
			salt,
			iterations,
			hash: "SHA-256",
		},
		key,
		KEY_LENGTH,
	);

	return new Uint8Array(bits);
}

async function hashPasswordArgon2id(password: string): Promise<string> {
	const salt = new Uint8Array(SALT_LENGTH);

	crypto.getRandomValues(salt);

	return await argon2id({
		password,
		salt,
		memorySize: ARGON2_MEMORY_SIZE,
		iterations: ARGON2_ITERATIONS,
		parallelism: ARGON2_PARALLELISM,
		hashLength: ARGON2_HASH_LENGTH,
		outputType: "encoded",
	});
}

async function verifyPasswordArgon2id(
	password: string,
	storedHash: string,
): Promise<boolean> {
	try {
		return await argon2Verify({
			password,
			hash: storedHash,
		});
	} catch {
		return false;
	}
}

async function hashPasswordPbkdf2(password: string): Promise<string> {
	const salt = new Uint8Array(SALT_LENGTH);

	crypto.getRandomValues(salt);

	const hash = await derivePasswordHash(password, salt, ITERATIONS);

	return ["pbkdf2", "sha256", ITERATIONS, toBase64(salt), toBase64(hash)].join(
		"$",
	);
}

async function verifyPasswordPbkdf2(
	password: string,
	storedHash: string,
): Promise<boolean> {
	const [algorithm, hashAlgorithm, iterationsString, saltString, hashString] =
		storedHash.split("$");

	if (
		algorithm !== "pbkdf2" ||
		hashAlgorithm !== "sha256" ||
		!iterationsString ||
		!saltString ||
		!hashString
	) {
		return false;
	}

	const iterations = Number(iterationsString);

	if (!Number.isSafeInteger(iterations) || iterations <= 0) {
		return false;
	}

	try {
		const salt = fromBase64(saltString);
		const expectedHash = fromBase64(hashString);

		const actualHash = await derivePasswordHash(password, salt, iterations);

		if (actualHash.length !== expectedHash.length) {
			return false;
		}

		return crypto.subtle.timingSafeEqual(actualHash, expectedHash);
	} catch {
		return false;
	}
}

export async function hashPassword(
	password: string,
	useArgon2id: boolean,
): Promise<string> {
	if (useArgon2id) {
		return await hashPasswordArgon2id(password);
	}

	return await hashPasswordPbkdf2(password);
}

export async function verifyPassword(
	password: string,
	storedHash: string,
): Promise<boolean> {
	if (storedHash.startsWith("$argon2id$")) {
		return await verifyPasswordArgon2id(password, storedHash);
	}

	if (storedHash.startsWith("pbkdf2$")) {
		return await verifyPasswordPbkdf2(password, storedHash);
	}

	return false;
}
