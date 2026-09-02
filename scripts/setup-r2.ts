import {
	loadGenerated,
	loadWranglerConfig,
	runWrangler,
	runWranglerAndCheck,
	saveGenerated,
} from "./shared";

const generated = await loadGenerated();

if (!generated.instanceName) {
	throw new Error(
		"Missing instanceName from generated.json. Run setup:config first.",
	);
}

const bucketName = `${generated.instanceName}-profile`;
const bindingName = "PROFILE_BUCKET";

console.log(`Creating R2 bucket: ${bucketName}`);
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

const config = await loadWranglerConfig();

const r2Buckets = Array.isArray(config.r2_buckets) ? config.r2_buckets : [];

const binding = r2Buckets.find(
	(item) =>
		item &&
		typeof item === "object" &&
		"binding" in item &&
		item.binding === bindingName,
);

if (
	!binding ||
	typeof binding !== "object" ||
	!("bucket_name" in binding) ||
	typeof binding.bucket_name !== "string"
) {
	throw new Error(
		`No ${bindingName} bucket_name found in apps/api/wrangler.jsonc.`,
	);
}

await saveGenerated({
	r2: {
		bucketName: binding.bucket_name,
		binding: bindingName,
	},
});

console.log();
console.log("R2 setup complete.");
console.log(`Bucket: ${binding.bucket_name}`);
console.log(`Binding: ${bindingName}`);
console.log();

console.log("Generating Wrangler types...");

await runWranglerAndCheck(["types"], "Failed to generate Wrangler types.");

console.log("Wrangler types generated.");
