import { join } from "node:path";

/**
 * Resolves to the root of the repository.
 *
 * @returns The absolute path of the root of the repository.
 */
export const ROOT_DIR = join(import.meta.dir, "..");

/**
 * Resolves to the API directory.
 *
 * @returns The absolute path of the apps/api directory.
 */
export const API_DIR = join(ROOT_DIR, "apps/api");

/**
 * Resolves to the dashboard directory.
 *
 * @returns The absolute path of the apps/dashboard directory.
 */
export const DASHBOARD_DIR = join(ROOT_DIR, "apps/dashboard");

/**
 * Resolves to the root environment file.
 *
 * @returns The absolute path of the .env file.
 */
export const ENV_PATH = join(ROOT_DIR, ".env");

/**
 * Resolves to the API Wrangler configuration.
 *
 * @returns The absolute path of the apps/api/wrangler.jsonc file.
 */
export const API_CONFIG_PATH = join(API_DIR, "wrangler.jsonc");

/**
 * Resolves to the dashboard Wrangler configuration.
 *
 * @returns The absolute path of the apps/dashboard/wrangler.jsonc file.
 */
export const DASHBOARD_CONFIG_PATH = join(DASHBOARD_DIR, "wrangler.jsonc");

/**
 * Resolves to the generated configuration file.
 *
 * @returns The absolute path of the generated.json file.
 */
export const GENERATED_PATH = join(import.meta.dir, "generated.json");

/**
 * Configuration generated for the current deployment.
 */
export type GeneratedConfig = {
	/** Unique name of the Maze ID instance. */
	instanceName: string;

	/** Name of the API Worker. */
	apiName: string;

	/** Name of the dashboard Worker, when configured. */
	dashboardName?: string;

	/** Public domain of the dashboard. */
	dashboardDomain: string;

	/** D1 database configuration, when provisioned. */
	database?: {
		name: string;
		id: string;
	};

	/** Cloudflare Flagship application configuration, when configured. */
	flagship?: {
		appName: string;
		appId: string;
	};

	/** R2 profile bucket configuration, when provisioned. */
	r2?: {
		bucketName: string;
		binding: string;
	};
};

/**
 * Parses environment variables from dotenv-style file contents.
 *
 * @param contents The contents of the environment file.
 * @returns A record containing the parsed environment variables.
 */
export function parseEnv(contents: string) {
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

/**
 * Returns a required environment variable.
 *
 * @param env The parsed environment variables.
 * @param name The name of the required variable.
 * @returns The value of the environment variable.
 * @throws If the environment variable is missing or empty.
 */
export function required(env: Record<string, string>, name: string) {
	const value = env[name];

	if (!value) {
		throw new Error(`Missing ${name} from ${ENV_PATH}`);
	}

	return value;
}

/**
 * Loads and parses the root environment file.
 *
 * @returns The parsed environment variables.
 */
export async function loadEnv() {
	return parseEnv(await Bun.file(ENV_PATH).text());
}

/**
 * Loads the generated deployment configuration.
 *
 * @returns The generated configuration, or an empty object if the file does not exist.
 */
export async function loadGenerated() {
	const file = Bun.file(GENERATED_PATH);

	if (!(await file.exists())) {
		return {};
	}

	return JSON.parse(await file.text()) as Partial<GeneratedConfig>;
}

/**
 * Saves generated deployment configuration to disk.
 *
 * @param config The generated configuration values to save.
 */
export async function saveGenerated(config: Partial<GeneratedConfig>) {
	const existing = await loadGenerated();

	await Bun.write(
		GENERATED_PATH,
		`${JSON.stringify(
			{
				...existing,
				...config,
			},
			null,
			"\t",
		)}\n`,
	);
}

/**
 * Loads and parses a Wrangler configuration file.
 *
 * @param path The absolute path to the Wrangler configuration file.
 * @returns The parsed Wrangler configuration, or an empty object if the file does not exist.
 */
export async function loadWranglerConfig(path: string = API_CONFIG_PATH) {
	const file = Bun.file(path);

	if (!(await file.exists())) {
		return {};
	}

	const contents = await file.text();

	const withoutBlockComments = contents.replace(/\/\*[\s\S]*?\*\//g, "");
	const withoutComments = withoutBlockComments.replace(/^\s*\/\/.*$/gm, "");

	return JSON.parse(withoutComments) as Record<string, unknown>;
}

/**
 * Runs a Wrangler command from the API directory.
 *
 * @param args The arguments to pass to Wrangler.
 * @returns The spawned Wrangler process.
 */
export function runWrangler(args: string[]) {
	return Bun.spawn(["bunx", "wrangler", ...args], {
		cwd: API_DIR,
		stdin: "inherit",
		stdout: "inherit",
		stderr: "inherit",
	});
}

/**
 * Runs a Wrangler command and throws if it exits with a non-zero status.
 *
 * @param args The arguments to pass to Wrangler.
 * @param errorMessage The error message to use when Wrangler fails.
 * @throws If Wrangler exits with a non-zero status.
 */
export async function runWranglerAndCheck(
	args: string[],
	errorMessage: string,
) {
	const process = runWrangler(args);
	const exitCode = await process.exited;

	if (exitCode !== 0) {
		throw new Error(
			`${errorMessage} Wrangler exited with code ${exitCode}.`,
		);
	}
}

export function randomSuffix() {
	return Math.random().toString(36).slice(2, 6);
}

export type D1Database = {
	name: string;
	uuid: string;
};

/**
 * Lists the D1 databases available to the current Cloudflare account.
 *
 * @returns The list of D1 databases.
 * @throws If Wrangler exits with a non-zero status or its output cannot be parsed.
 */
export async function listD1Databases(): Promise<D1Database[]> {
	const process = Bun.spawn(["bunx", "wrangler", "d1", "list", "--json"], {
		cwd: API_DIR,
		stdout: "pipe",
		stderr: "inherit",
	});

	const output = await new Response(process.stdout).text();

	const exitCode = await process.exited;

	if (exitCode !== 0) {
		throw new Error(
			`Failed to list D1 databases. Wrangler exited with code ${exitCode}.`,
		);
	}

	try {
		return JSON.parse(output) as D1Database[];
	} catch {
		throw new Error("Failed to parse Wrangler D1 database list.");
	}
}

/**
 * Updates the API Wrangler configuration with the D1 database binding.
 *
 * @param databaseName The name of the D1 database.
 * @param databaseId The ID of the D1 database.
 */
export async function updateD1Binding(
	databaseName: string,
	databaseId: string,
) {
	const config = await loadWranglerConfig(API_CONFIG_PATH);

	const databases = Array.isArray(config.d1_databases)
		? config.d1_databases
		: [];

	const binding = {
		binding: "DB",
		database_name: databaseName,
		database_id: databaseId,
		migrations_dir: "drizzle/migrations",
	};

	const index = databases.findIndex(
		(database) =>
			database &&
			typeof database === "object" &&
			"binding" in database &&
			database.binding === "DB",
	);

	if (index >= 0) {
		databases[index] = binding;
	} else {
		databases.push(binding);
	}

	config.d1_databases = databases;

	await Bun.write(API_CONFIG_PATH, `${JSON.stringify(config, null, "\t")}\n`);
}

export type R2Bucket = {
	name: string;
};

/**
 * Lists the R2 buckets available to the current Cloudflare account.
 *
 * @returns The list of R2 buckets.
 * @throws If Wrangler exits with a non-zero status.
 */
export async function listR2Buckets(): Promise<R2Bucket[]> {
	const process = Bun.spawn(["bunx", "wrangler", "r2", "bucket", "list"], {
		cwd: API_DIR,
		stdout: "pipe",
		stderr: "inherit",
	});

	const output = await new Response(process.stdout).text();
	const exitCode = await process.exited;

	if (exitCode !== 0) {
		throw new Error(
			`Failed to list R2 buckets. Wrangler exited with code ${exitCode}.`,
		);
	}

	return output.split(/\r?\n/).flatMap((line) => {
		const match = line.match(/^name:\s+(.+)$/);

		return match ? [{ name: match[1].trim() }] : [];
	});
}

/**
 * Updates the API Wrangler configuration with an R2 bucket binding.
 *
 * @param bucketName The name of the R2 bucket.
 * @param bindingName The name of the Worker binding.
 */
export async function updateR2Binding(bucketName: string, bindingName: string) {
	const config = await loadWranglerConfig(API_CONFIG_PATH);

	const buckets = Array.isArray(config.r2_buckets) ? config.r2_buckets : [];

	const binding = {
		binding: bindingName,
		bucket_name: bucketName,
	};

	const index = buckets.findIndex(
		(bucket) =>
			bucket &&
			typeof bucket === "object" &&
			"binding" in bucket &&
			bucket.binding === bindingName,
	);

	if (index >= 0) {
		buckets[index] = binding;
	} else {
		buckets.push(binding);
	}

	config.r2_buckets = buckets;

	await Bun.write(API_CONFIG_PATH, `${JSON.stringify(config, null, "\t")}\n`);
}

export type FlagshipApp = {
	id: string;
	name: string;
	created_at: string;
	updated_at: string;
	updated_by: string;
};

/**
 * Lists the Flagship applications available to the current Cloudflare account.
 *
 * @returns The list of Flagship applications.
 * @throws If Wrangler exits with a non-zero status or its output cannot be parsed.
 */
export async function listFlagshipApps(): Promise<FlagshipApp[]> {
	const process = Bun.spawn(
		["bunx", "wrangler", "flagship", "apps", "list", "--json"],
		{
			cwd: API_DIR,
			stdout: "pipe",
			stderr: "inherit",
		},
	);

	const output = await new Response(process.stdout).text();
	const exitCode = await process.exited;

	if (exitCode !== 0) {
		throw new Error(
			`Failed to list Flagship apps. Wrangler exited with code ${exitCode}.`,
		);
	}

	try {
		return JSON.parse(output) as FlagshipApp[];
	} catch {
		throw new Error("Failed to parse Flagship app list.");
	}
}

/**
 * Represents a Flagship feature flag.
 */
export type FlagshipFlag = {
	key: string;
	type: string;
	default_variation: string;
	variations: Record<string, boolean>;
	rules: unknown[];
	description: string | null;
	enabled: boolean;
	updated_at: string;
	updated_by: string;
};

/**
 * Lists all feature flags for a Flagship application.
 *
 * @param appId The ID of the Flagship application.
 * @returns The list of Flagship feature flags.
 * @throws If Wrangler exits with a non-zero status or its output cannot be parsed.
 */
export async function listFlagshipFlags(
	appId: string,
): Promise<FlagshipFlag[]> {
	const process = Bun.spawn(
		[
			"bunx",
			"wrangler",
			"flagship",
			"flags",
			"list",
			appId,
			"--all",
			"--json",
		],
		{
			cwd: API_DIR,
			stdout: "pipe",
			stderr: "inherit",
		},
	);

	const output = await new Response(process.stdout).text();
	const exitCode = await process.exited;

	if (exitCode !== 0) {
		throw new Error(
			`Failed to list Flagship flags. Wrangler exited with code ${exitCode}.`,
		);
	}

	try {
		const result = JSON.parse(output) as {
			items: FlagshipFlag[];
			cursor: string | null;
		};

		return result.items;
	} catch {
		throw new Error("Failed to parse Flagship flag list.");
	}
}
