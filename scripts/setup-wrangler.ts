const envPath = "./.env";

const apiWranglerPath = "./apps/api/wrangler.jsonc";
const dashboardWranglerPath = "./apps/dashboard/wrangler.jsonc";

type WranglerConfig = Record<string, unknown>;

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

async function readJsonc(path: string): Promise<WranglerConfig | null> {
	const file = Bun.file(path);

	if (!(await file.exists())) {
		return null;
	}

	const contents = await file.text();

	const withoutBlockComments = contents.replace(/\/\*[\s\S]*?\*\//g, "");

	const withoutComments = withoutBlockComments.replace(/^\s*\/\/.*$/gm, "");

	try {
		return JSON.parse(withoutComments);
	} catch {
		throw new Error(`Unable to parse existing Wrangler config: ${path}`);
	}
}

function formatJson(config: WranglerConfig) {
	return `${JSON.stringify(config, null, 4)}\n`;
}

function configsEqual(current: WranglerConfig | null, next: WranglerConfig) {
	return JSON.stringify(current) === JSON.stringify(next);
}

function showDiff(
	path: string,
	current: WranglerConfig | null,
	next: WranglerConfig,
) {
	console.log(`\nChanges for ${path}:\n`);

	if (!current) {
		console.log("+ New file");
		console.log(formatJson(next));
		return;
	}

	const currentLines = formatJson(current).trimEnd().split("\n");

	const nextLines = formatJson(next).trimEnd().split("\n");

	const maxLines = Math.max(currentLines.length, nextLines.length);

	for (let index = 0; index < maxLines; index++) {
		const oldLine = currentLines[index];
		const newLine = nextLines[index];

		if (oldLine === newLine) {
			console.log(`  ${oldLine ?? ""}`);
			continue;
		}

		if (oldLine !== undefined) {
			console.log(`- ${oldLine}`);
		}

		if (newLine !== undefined) {
			console.log(`+ ${newLine}`);
		}
	}
}

async function confirmOverwrite(path: string) {
	const answer = prompt(`\nOverwrite ${path}? [y/N] `);

	return answer?.trim().toLowerCase() === "y";
}

async function writeConfig(path: string, config: WranglerConfig) {
	const existing = await readJsonc(path);

	if (configsEqual(existing, config)) {
		console.log(`Skipping ${path} - no changes.`);
		return;
	}

	showDiff(path, existing, config);

	if (existing && !(await confirmOverwrite(path))) {
		console.log(`Skipping ${path} - overwrite declined.`);
		return;
	}

	await Bun.write(path, formatJson(config));

	console.log(`Wrote ${path}`);
}

const env = parseEnv(await Bun.file(envPath).text());

const instanceName = required(env, "INSTANCE_NAME");

const dashboardDomain = required(env, "DASHBOARD_DOMAIN");

const localhost = required(env, "LOCALHOST");

const existingApiConfig = await readJsonc(apiWranglerPath);

const d1Databases = existingApiConfig?.d1_databases;

const apiConfig: WranglerConfig = {
	$schema: "./node_modules/wrangler/config-schema.json",

	name: `${instanceName}-api`,

	main: "src/index.ts",

	compatibility_date: "2026-08-31",

	vars: {
		INSTANCE_NAME: instanceName,
		DASHBOARD_DOMAIN: dashboardDomain,
		LOCALHOST: localhost === "true",
	},

	...(d1Databases
		? {
				d1_databases: d1Databases,
			}
		: {}),
};

const dashboardConfig: WranglerConfig = {
	$schema: "./node_modules/wrangler/config-schema.json",

	name: `${instanceName}-dashboard`,

	main: "worker.ts",

	compatibility_date: "2026-08-31",

	assets: {
		directory: "./dist",
		binding: "ASSETS",
		not_found_handling: "single-page-application",
	},
};

await writeConfig(apiWranglerPath, apiConfig);

await writeConfig(dashboardWranglerPath, dashboardConfig);

console.log("\nConfig generation complete.");

export {};
