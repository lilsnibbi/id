/**
 * Sets the Argon2id feature flag to the requested variation.
 */
import { loadGenerated, runWranglerAndCheck } from "./shared";

const variation = Bun.argv[2];

if (variation !== "on" && variation !== "off") {
	throw new Error("Usage: bun scripts/set-argon.ts <on|off>");
}

const generated = await loadGenerated();

if (!generated.flagship?.appId) {
	throw new Error(
		"Missing Flagship app ID from generated.json. Run bun run setup first.",
	);
}

const flagName = "use-argon-2-id";

console.log(`Setting ${flagName} to ${variation}...`);

await runWranglerAndCheck(
	[
		"flagship",
		"flags",
		"set",
		generated.flagship.appId,
		flagName,
		"--variation",
		variation,
		"--clear-rules",
	],
	`Failed to set ${flagName} to ${variation}.`,
);

console.log(`Argon2id is now ${variation.toUpperCase()}.`);
