import {
	listR2Buckets,
	loadGenerated,
	randomSuffix,
	runWrangler,
	runWranglerAndCheck,
	saveGenerated,
	updateR2Binding,
} from "./shared";

const generated = await loadGenerated();

if (!generated.instanceName) {
	throw new Error(
		"Missing instanceName from generated.json. Run setup:config first.",
	);
}

const defaultBucketName = `${generated.instanceName}-profile`;
const bindingName = "PROFILE_BUCKET";

console.log(`Checking R2 bucket: ${defaultBucketName}`);
console.log();

const buckets = await listR2Buckets();

let bucket = buckets.find((item) => item.name === defaultBucketName);

if (bucket) {
	console.log(`An R2 bucket named "${defaultBucketName}" already exists.`);
	console.log();

	const answer = prompt("Is this the bucket you want to use? [Y/n] ");

	const useExisting =
		!answer || ["y", "yes"].includes(answer.trim().toLowerCase());

	if (useExisting) {
		await updateR2Binding(bucket.name, bindingName);

		await saveGenerated({
			r2: {
				bucketName: bucket.name,
				binding: bindingName,
			},
		});

		console.log();
		console.log(`Using existing bucket: ${bucket.name}`);
		console.log("R2 setup complete.");
		console.log();
		console.log("Generating Wrangler types...");

		await runWranglerAndCheck(
			["types"],
			"Failed to generate Wrangler types.",
		);

		console.log("Wrangler types generated.");

		process.exit(0);
	}

	let bucketName = `${defaultBucketName}-${randomSuffix()}`;

	while (buckets.some((item) => item.name === bucketName)) {
		bucketName = `${defaultBucketName}-${randomSuffix()}`;
	}

	console.log();
	console.log(`Creating bucket: ${bucketName}`);
	console.log();

	const createBucketProcess = runWrangler([
		"r2",
		"bucket",
		"create",
		bucketName,
		"--binding",
		bindingName,
		"--update-config",
	]);

	const bucketExitCode = await createBucketProcess.exited;

	if (bucketExitCode !== 0) {
		throw new Error(
			`Failed to create R2 bucket. Wrangler exited with code ${bucketExitCode}.`,
		);
	}

	bucket = (await listR2Buckets()).find((item) => item.name === bucketName);

	if (!bucket) {
		throw new Error(
			`Created R2 bucket "${bucketName}" but could not find it afterward.`,
		);
	}
} else {
	console.log(`Creating R2 bucket: ${defaultBucketName}`);
	console.log();

	const createBucketProcess = runWrangler([
		"r2",
		"bucket",
		"create",
		defaultBucketName,
		"--binding",
		bindingName,
		"--update-config",
	]);

	const bucketExitCode = await createBucketProcess.exited;

	if (bucketExitCode !== 0) {
		throw new Error(
			`Failed to create R2 bucket. Wrangler exited with code ${bucketExitCode}.`,
		);
	}

	bucket = (await listR2Buckets()).find(
		(item) => item.name === defaultBucketName,
	);

	if (!bucket) {
		throw new Error(
			`Created R2 bucket "${defaultBucketName}" but could not find it afterward.`,
		);
	}
}

await updateR2Binding(bucket.name, bindingName);

await saveGenerated({
	r2: {
		bucketName: bucket.name,
		binding: bindingName,
	},
});

console.log();
console.log(`Bucket: ${bucket.name}`);
console.log(`Binding: ${bindingName}`);
console.log("R2 setup complete.");
console.log();
console.log("Generating Wrangler types...");

await runWranglerAndCheck(["types"], "Failed to generate Wrangler types.");

console.log("Wrangler types generated.");
