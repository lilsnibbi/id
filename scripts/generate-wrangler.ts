const envPath = "./.env";

const apiWranglerPath = "./apps/api/wrangler.jsonc";
const dashboardWranglerPath = "./apps/dashboard/wrangler.jsonc";

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

async function writeIfMissing(path: string, config: object) {
	const file = Bun.file(path);

	if (await file.exists()) {
		console.log(`Skipping ${path} — config already exists.`);
		return;
	}

	await Bun.write(path, `${JSON.stringify(config, null, 4)}\n`);

	console.log(`Generated ${path}`);
}

const env = parseEnv(await Bun.file(envPath).text());

const instanceName = required(env, "INSTANCE_NAME");
const dashboardDomain = required(env, "DASHBOARD_DOMAIN");
const localhost = required(env, "LOCALHOST");

const apiConfig = {
	$schema: "./node_modules/wrangler/config-schema.json",
	name: `${instanceName}-api`,
	main: "src/index.ts",
	compatibility_date: "2026-08-31",
	vars: {
		INSTANCE_NAME: instanceName,
		DASHBOARD_DOMAIN: dashboardDomain,
		LOCALHOST: localhost === "true",
	},
};

const dashboardConfig = {
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

await writeIfMissing(apiWranglerPath, apiConfig);
await writeIfMissing(dashboardWranglerPath, dashboardConfig);

export {};
