const envPath = "./.env";

function parseEnv(contents: string) {
	const values: Record<string, string> = {};

	for (const line of contents.split(/\r?\n/)) {
		const trimmed = line.trim();

		if (!trimmed || trimmed.startsWith("#")) {
			continue;
		}

		const match = trimmed.match(/^([\w.-]+)\s*=\s*(.*)$/);

		if (!match) {
			continue;
		}

		let [, key, value] = match;

		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}

		values[key] = value;
	}

	return values;
}

function required(env: Record<string, string>, name: string) {
	const value = env[name];

	if (!value) {
		throw new Error(`Missing ${name} from ${envPath}`);
	}

	return value;
}

const env = parseEnv(await Bun.file(envPath).text());

const instanceName = required(env, "INSTANCE_NAME");

const appName = `${instanceName}-api-flags`;

console.log(`Creating Flagship app: ${appName}`);

console.log();

const process = Bun.spawn(
	[
		"bunx",
		"wrangler",
		"flagship",
		"apps",
		"create",
		appName,
		"--binding",
		"FLAGS",
		"--update-config",
	],
	{
		cwd: "./apps/api",
		stdin: "inherit",
		stdout: "inherit",
		stderr: "inherit",
	},
);

const exitCode = await process.exited;

if (exitCode !== 0) {
	throw new Error(
		`Failed to create Flagship app. Wrangler exited with code ${exitCode}.`,
	);
}

console.log();

console.log("Flagship setup complete.");

console.log(`App: ${appName}`);

console.log("Binding: FLAGS");

export {};
