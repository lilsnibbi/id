import { startAuthentication } from "@simplewebauthn/browser";

import { getPasskeyLoginOptions, verifyPasskeyLogin } from "@/lib/api";

/**
 * Signs in the current user with a discoverable passkey.
 *
 * The authenticator discovers the passkey without requiring
 * an email address or username.
 */
export async function loginWithPasskey() {
	const { challengeId, ...options } = await getPasskeyLoginOptions();

	const response = await startAuthentication({
		optionsJSON: options,
	});

	await verifyPasskeyLogin(response, challengeId);
}
