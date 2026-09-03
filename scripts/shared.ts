import { join } from "node:path";

export const ROOT_DIR = join(import.meta.dir, "..");

export const API_DIR = join(ROOT_DIR, "apps/api");

export const DASHBOARD_DIR = join(ROOT_DIR, "apps/dashboard");

export const ENV_PATH = join(ROOT_DIR, ".env");

export const API_CONFIG_PATH = join(API_DIR, "wrangler.jsonc");

export const DASHBOARD_CONFIG_PATH = join(DASHBOARD_DIR, "wrangler.jsonc");

export const GENERATED_PATH = join(import.meta.dir, "generated.json");

export type GeneratedConfig = {
	instanceName: string;
	apiName: string;
	dashboardName?: string;
	dashboardDomain: string;
	database?: {
		name: string;
		id: string;
	};
	flagship?: {
		appName: string;
		appId: string;
	};
	r2?: {
		bucketName: string;
		binding: string;
	};
};

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

export function required(env: Record<string, string>, name: string) {
	const value = env[name];

	if (!value) {
		throw new Error(`Missing ${name} from ${ENV_PATH}`);
	}

	return value;
}

export async function loadEnv() {
	return parseEnv(await Bun.file(ENV_PATH).text());
}

export async function loadGenerated() {
	const file = Bun.file(GENERATED_PATH);

	if (!(await file.exists())) {
		return {};
	}

	return JSON.parse(await file.text()) as Partial<GeneratedConfig>;
}

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

export function runWrangler(args: string[]) {
	return Bun.spawn(["bunx", "wrangler", ...args], {
		cwd: API_DIR,
		stdin: "inherit",
		stdout: "inherit",
		stderr: "inherit",
	});
}

export async function runWranglerAndCheck(
	args: string[],
	errorMessage: string,
) {
	const process = runWrangler(args);
	const exitCode = await process.exited;

	if (exitCode !== 0) {
		throw new Error(`${errorMessage} Wrangler exited with code ${exitCode}.`);
	}
}

export function randomSuffix() {
	return Math.random().toString(36).slice(2, 6);
}

export type D1Database = {
	name: string;
	uuid: string;
};

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

export async function listFlagshipFlags(
	appId: string,
): Promise<FlagshipFlag[]> {
	const process = Bun.spawn(
		["bunx", "wrangler", "flagship", "flags", "list", appId, "--all", "--json"],
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
