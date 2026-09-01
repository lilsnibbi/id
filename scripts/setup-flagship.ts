import {
	API_CONFIG_PATH,
	loadGenerated,
	loadWranglerConfig,
	runWrangler,
	runWranglerAndCheck,
	saveGenerated,
} from "./shared";

const generated = await loadGenerated();

if (!generated.instanceName) {
	throw new Error(
		"Missing instanceName from generated.json. Run setup:config first.",
	);
}

const appName = `${generated.instanceName}-api-flags`;
const flagName = "use-argon-2-id";

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

const appExitCode = await createAppProcess.exited;

if (appExitCode !== 0) {
	throw new Error(
		`Failed to create Flagship app. Wrangler exited with code ${appExitCode}.`,
	);
}

const config = await loadWranglerConfig();

const flagship = config.flagship;

if (!Array.isArray(flagship)) {
	throw new Error(`No Flagship configuration found in ${API_CONFIG_PATH}.`);
}

const binding = flagship.find(
	(item) =>
		item &&
		typeof item === "object" &&
		"binding" in item &&
		item.binding === "FLAGS",
);

if (
	!binding ||
	typeof binding !== "object" ||
	!("app_id" in binding) ||
	typeof binding.app_id !== "string"
) {
	throw new Error(`No FLAGS app_id found in ${API_CONFIG_PATH}.`);
}

const appId = binding.app_id;

await saveGenerated({
	flagship: {
		appName,
		appId,
	},
});

console.log();
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

const flagExitCode = await createFlagProcess.exited;

if (flagExitCode !== 0) {
	throw new Error(
		`Failed to create Flagship flag. Wrangler exited with code ${flagExitCode}.`,
	);
}

console.log();
console.log("Flagship setup complete.");
console.log(`App: ${appName}`);
console.log(`App ID: ${appId}`);
console.log("Binding: FLAGS");
console.log(`Flag: ${flagName}`);
console.log("Default: off");

console.log();
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
