const envPath = "./.env";
const configPath = "./apps/api/wrangler.jsonc";

type WranglerConfig = Record<string, unknown>;

type D1Database = {
	name: string;
	uuid: string;
};

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

async function readConfig(): Promise<WranglerConfig> {
	const file = Bun.file(configPath);

	if (!(await file.exists())) {
		throw new Error(`Wrangler config not found: ${configPath}`);
	}

	const contents = await file.text();

	const withoutBlockComments = contents.replace(/\/\*[\s\S]*?\*\//g, "");

	const withoutComments = withoutBlockComments.replace(/^\s*\/\/.*$/gm, "");

	try {
		return JSON.parse(withoutComments);
	} catch {
		throw new Error(`Unable to parse Wrangler config: ${configPath}`);
	}
}

async function updateD1Config(databaseName: string, databaseId: string) {
	const config = await readConfig();

	const databases = Array.isArray(config.d1_databases)
		? config.d1_databases
		: [];

	const existingIndex = databases.findIndex(
		(database) =>
			database &&
			typeof database === "object" &&
			"binding" in database &&
			database.binding === "DB",
	);

	const d1Binding = {
		binding: "DB",
		database_name: databaseName,
		database_id: databaseId,
		migrations_dir: "drizzle/migrations",
	};

	if (existingIndex >= 0) {
		databases[existingIndex] = d1Binding;
	} else {
		databases.push(d1Binding);
	}

	config.d1_databases = databases;

	await Bun.write(configPath, `${JSON.stringify(config, null, 4)}\n`);

	console.log(`Updated ${configPath} with D1 database.`);
}

function randomSuffix() {
	return Math.random().toString(36).slice(2, 6);
}

async function listDatabases() {
	const process = Bun.spawn(["bunx", "wrangler", "d1", "list", "--json"], {
		cwd: "./apps/api",
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

const env = parseEnv(await Bun.file(envPath).text());

const instanceName = required(env, "INSTANCE_NAME");

let databaseName = `${instanceName}-api`;

console.log(`Checking D1 database: ${databaseName}`);
console.log();

const databases = await listDatabases();

const database = databases.find((item) => item.name === databaseName);

if (database) {
	console.log(`A D1 database named "${databaseName}" already exists.`);
	console.log(`Database ID: ${database.uuid}`);
	console.log();

	const answer = prompt("Is this the database you want to use? [Y/n] ");

	const useExisting =
		!answer ||
		answer.trim().toLowerCase() === "y" ||
		answer.trim().toLowerCase() === "yes";

	if (useExisting) {
		console.log();
		console.log(`Using existing database: ${databaseName}`);

		await updateD1Config(databaseName, database.uuid);

		console.log();
		console.log("D1 database setup complete.");

		process.exit(0);
	}

	databaseName = `${databaseName}-${randomSuffix()}`;

	console.log();
	console.log(`Using new database name: ${databaseName}`);
	console.log();
}

console.log(`Creating D1 database: ${databaseName}`);
console.log();

const createProcess = Bun.spawn(
	["bunx", "wrangler", "d1", "create", databaseName, "--update-config"],
	{
		cwd: "./apps/api",
		stdin: "inherit",
		stdout: "inherit",
		stderr: "inherit",
	},
);

const exitCode = await createProcess.exited;

if (exitCode !== 0) {
	throw new Error(
		`Failed to create D1 database. Wrangler exited with code ${exitCode}.`,
	);
}

console.log();
console.log("D1 database setup complete.");
console.log(`Database: ${databaseName}`);

export {};
