import {
	listD1Databases,
	loadGenerated,
	randomSuffix,
	runWranglerAndCheck,
	saveGenerated,
	updateD1Binding,
} from "./shared";

const generated = await loadGenerated();

if (!generated.instanceName) {
	throw new Error(
		"Missing instanceName from generated.json. Run setup:config first.",
	);
}

const defaultDatabaseName = `${generated.instanceName}-api`;

console.log(`Checking D1 database: ${defaultDatabaseName}`);
console.log();

const databases = await listD1Databases();

let database = databases.find((item) => item.name === defaultDatabaseName);

if (database) {
	console.log(`A D1 database named "${defaultDatabaseName}" already exists.`);
	console.log(`Database ID: ${database.uuid}`);
	console.log();

	const answer = prompt("Is this the database you want to use? [Y/n] ");

	const useExisting =
		!answer || ["y", "yes"].includes(answer.trim().toLowerCase());

	if (useExisting) {
		await updateD1Binding(database.name, database.uuid);

		await saveGenerated({
			database: {
				name: database.name,
				id: database.uuid,
			},
		});

		console.log();
		console.log(`Using existing database: ${database.name}`);
		console.log("D1 setup complete.");

		process.exit(0);
	}

	let databaseName = `${defaultDatabaseName}-${randomSuffix()}`;

	while (databases.some((item) => item.name === databaseName)) {
		databaseName = `${defaultDatabaseName}-${randomSuffix()}`;
	}

	console.log();
	console.log(`Creating database: ${databaseName}`);
	console.log();

	await runWranglerAndCheck(
		["d1", "create", databaseName, "--update-config"],
		"Failed to create D1 database.",
	);

	database = (await listD1Databases()).find(
		(item) => item.name === databaseName,
	);

	if (!database) {
		throw new Error(
			`Created D1 database "${databaseName}" but could not find it afterward.`,
		);
	}
} else {
	console.log(`Creating D1 database: ${defaultDatabaseName}`);
	console.log();

	await runWranglerAndCheck(
		["d1", "create", defaultDatabaseName, "--update-config"],
		"Failed to create D1 database.",
	);

	database = (await listD1Databases()).find(
		(item) => item.name === defaultDatabaseName,
	);

	if (!database) {
		throw new Error(
			`Created D1 database "${defaultDatabaseName}" but could not find it afterward.`,
		);
	}
}

await updateD1Binding(database.name, database.uuid);

await saveGenerated({
	database: {
		name: database.name,
		id: database.uuid,
	},
});

console.log();
console.log(`Database: ${database.name}`);
console.log("D1 setup complete.");
