import {
	API_CONFIG_PATH,
	DASHBOARD_CONFIG_PATH,
	loadEnv,
	loadWranglerConfig,
	required,
	saveGenerated,
} from "./shared";

const env = await loadEnv();

const instanceName = required(env, "INSTANCE_NAME");
const dashboardDomain = required(env, "DASHBOARD_DOMAIN");
const oidcIssuer = required(env, "OIDC_ISSUER");
const localhost = required(env, "LOCALHOST") === "true";

const apiName = `${instanceName}-api`;
const dashboardName = `${instanceName}-dashboard`;

const rpName = "Maze ID";
const rpId = dashboardDomain;
const origin = `https://${dashboardDomain}`;

let existingApiConfig: Record<string, unknown> = {};

const apiConfigFile = Bun.file(API_CONFIG_PATH);

if (await apiConfigFile.exists()) {
	existingApiConfig = await loadWranglerConfig(API_CONFIG_PATH);
}

const apiConfig = {
	$schema: "./node_modules/wrangler/config-schema.json",
	name: apiName,
	main: "src/index.ts",
	compatibility_date: "2026-08-31",
	vars: {
		INSTANCE_NAME: instanceName,
		DASHBOARD_DOMAIN: dashboardDomain,
		RP_NAME: rpName,
		RP_ID: rpId,
		ORIGIN: origin,
		OIDC_ISSUER: oidcIssuer,
		LOCALHOST: localhost,
	},
	secrets: {
		required: ["ADMIN_BOOTSTRAP_SECRET", "OIDC_PRIVATE_KEY"],
	},
	...(existingApiConfig.d1_databases
		? {
				d1_databases: existingApiConfig.d1_databases,
			}
		: {}),
	...(existingApiConfig.flagship
		? {
				flagship: existingApiConfig.flagship,
			}
		: {}),
};

await writeConfig(apiConfigFile, API_CONFIG_PATH, apiConfig);

let existingDashboardConfig: Record<string, unknown> = {};

const dashboardConfigFile = Bun.file(DASHBOARD_CONFIG_PATH);

if (await dashboardConfigFile.exists()) {
	existingDashboardConfig = await loadWranglerConfig(DASHBOARD_CONFIG_PATH);
}

const dashboardConfig = {
	$schema: "./node_modules/wrangler/config-schema.json",
	name: dashboardName,
	main: "worker.ts",
	compatibility_date: "2026-08-31",
	assets: {
		directory: "./dist",
		binding: "ASSETS",
		not_found_handling: "single-page-application",
	},
	...(existingDashboardConfig.flagship
		? {
				flagship: existingDashboardConfig.flagship,
			}
		: {}),
};

await writeConfig(dashboardConfigFile, DASHBOARD_CONFIG_PATH, dashboardConfig);

await saveGenerated({
	instanceName,
	apiName,
	dashboardName,
	dashboardDomain,
});

async function writeConfig(
	file: ReturnType<typeof Bun.file>,
	path: string,
	config: Record<string, unknown>,
) {
	const contents = `${JSON.stringify(config, null, "\t")}\n`;

	if ((await file.exists()) && (await file.text()) === contents) {
		console.log(`Skipping ${path} - no changes.`);
		return;
	}

	await Bun.write(file, contents);

	console.log(`Generated ${path}`);
}
