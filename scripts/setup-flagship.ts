/**
 * Provisions the Flagship app and feature flag used by the API.
 */
import {
	API_CONFIG_PATH,
	listFlagshipApps,
	listFlagshipFlags,
	loadGenerated,
	loadWranglerConfig,
	runWrangler,
	runWranglerAndCheck,
	saveGenerated,
	type FlagshipApp,
} from "./shared";

const generated = await loadGenerated();

if (!generated.instanceName) {
	throw new Error(
		"Missing instanceName from generated.json. Run setup:config first.",
	);
}

const appName = `${generated.instanceName}-api-flags`;
const flagName = "use-argon-2-id";

/**
 * Finds the configured Flagship app or creates it if necessary.
 *
 * @returns The existing or newly created Flagship app.
 * @throws If multiple matching apps exist or the app cannot be uniquely identified after creation.
 */
async function getOrCreateFlagshipApp(): Promise<FlagshipApp> {
	const apps = await listFlagshipApps();
	const matches = apps.filter((app) => app.name === appName);

	if (matches.length > 1) {
		throw new Error(
			[
				`Multiple Flagship apps named "${appName}" were found:`,
				...matches.map((app) => `  ${app.id}`),
				"",
				"Please remove the duplicate Flagship app and run setup again.",
			].join("\n"),
		);
	}

	if (matches.length === 1) {
		const app = matches[0];

		console.log(`Using existing Flagship app: ${app.name}`);
		console.log(`App ID: ${app.id}`);
		console.log();

		return app;
	}

	console.log(`Creating Flagship app: ${appName}`);
	console.log();

	const createAppProcess = runWrangler([
		"flagship",
		"apps",
		"create",
		appName,
		"--binding",
		"FLAGS",
		"--update-config",
	]);

	const exitCode = await createAppProcess.exited;

	if (exitCode !== 0) {
		throw new Error(
			`Failed to create Flagship app. Wrangler exited with code ${exitCode}.`,
		);
	}

	const createdApps = await listFlagshipApps();
	const createdMatches = createdApps.filter((app) => app.name === appName);

	if (createdMatches.length !== 1) {
		throw new Error(
			`Created Flagship app "${appName}", but could not uniquely identify it afterward.`,
		);
	}

	return createdMatches[0];
}

/**
 * Updates the API Wrangler configuration with the Flagship binding.
 *
 * @param appId The ID of the Flagship application.
 */
async function updateFlagshipBinding(appId: string) {
	const config = await loadWranglerConfig(API_CONFIG_PATH);

	const flagship = Array.isArray(config.flagship) ? config.flagship : [];

	const binding = {
		binding: "FLAGS",
		app_id: appId,
	};

	const index = flagship.findIndex(
		(item) =>
			item &&
			typeof item === "object" &&
			"binding" in item &&
			item.binding === "FLAGS",
	);

	if (index >= 0) {
		flagship[index] = binding;
	} else {
		flagship.push(binding);
	}

	config.flagship = flagship;

	await Bun.write(API_CONFIG_PATH, `${JSON.stringify(config, null, "\t")}\n`);
}

/**
 * Creates the Argon2id feature flag if it does not already exist.
 *
 * @param appId The ID of the Flagship application.
 * @throws If the Flagship flag cannot be created.
 */
async function setupFlag(appId: string) {
	const flags = await listFlagshipFlags(appId);
	const existingFlag = flags.find((flag) => flag.key === flagName);

	if (existingFlag) {
		console.log(`Using existing Flagship flag: ${flagName}`);
		console.log();

		return;
	}

	console.log(`Creating Flagship flag: ${flagName}`);
	console.log();

	const createFlagProcess = runWrangler([
		"flagship",
		"flags",
		"create",
		appId,
		flagName,
		"--variation",
		"on=true",
		"--variation",
		"off=false",
		"--default",
		"off",
	]);

	const exitCode = await createFlagProcess.exited;

	if (exitCode !== 0) {
		throw new Error(
			`Failed to create Flagship flag. Wrangler exited with code ${exitCode}.`,
		);
	}
}

const app = await getOrCreateFlagshipApp();
const appId = app.id;

await updateFlagshipBinding(appId);

await saveGenerated({
	flagship: {
		appName,
		appId,
	},
});

console.log(`Flagship app: ${appName}`);
console.log(`App ID: ${appId}`);
console.log("Binding: FLAGS");
console.log();

await setupFlag(appId);

console.log("Generating Wrangler types...");

await runWranglerAndCheck(["types"], "Failed to generate Wrangler types.");

console.log("Wrangler types generated.");
console.log();

console.log("Flagship setup complete.");
console.log(`App: ${appName}`);
console.log(`App ID: ${appId}`);
console.log("Binding: FLAGS");
console.log(`Flag: ${flagName}`);
console.log("Default: off");
