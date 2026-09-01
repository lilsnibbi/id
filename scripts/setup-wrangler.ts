import {
	CONFIG_PATH,
	loadEnv,
	loadWranglerConfig,
	required,
	saveGenerated,
} from "./shared";

const env = await loadEnv();

const instanceName = required(env, "INSTANCE_NAME");

const dashboardDomain = required(env, "DASHBOARD_DOMAIN");

const localhost = required(env, "LOCALHOST") === "true";

const apiName = `${instanceName}-api`;

let existingConfig: Record<string, unknown> = {};

const configFile = Bun.file(CONFIG_PATH);

if (await configFile.exists()) {
	existingConfig = await loadWranglerConfig();
}

const config = {
	$schema: "./node_modules/wrangler/config-schema.json",
	name: apiName,
	main: "src/index.ts",
	compatibility_date: "2026-08-31",

	vars: {
		INSTANCE_NAME: instanceName,
		DASHBOARD_DOMAIN: dashboardDomain,
		LOCALHOST: localhost,
	},

	...(existingConfig.d1_databases
		? {
				d1_databases: existingConfig.d1_databases,
			}
		: {}),

	...(existingConfig.flagship
		? {
				flagship: existingConfig.flagship,
			}
		: {}),
};

const contents = `${JSON.stringify(config, null, "\t")}\n`;

if ((await configFile.exists()) && (await configFile.text()) === contents) {
	console.log(`Skipping ${CONFIG_PATH} - no changes.`);
} else {
	await Bun.write(CONFIG_PATH, contents);

	console.log(`Generated ${CONFIG_PATH}`);
}

await saveGenerated({
	instanceName,
	apiName,
	dashboardDomain,
});
