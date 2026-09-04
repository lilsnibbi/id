import * as Cloudflare from "alchemy/Cloudflare";
import * as Config from "effect/Config";

import { Database } from "./database.ts";
import { ProfileBucket } from "./storage.ts";

export const Api = Cloudflare.Worker("Api", {
	name: Config.string("INSTANCE_NAME").pipe(
		Config.map((name) => `${name}-api`),
	),

	main: "./apps/api/src/index.ts",

	compatibility: {
		date: "2026-08-31",
	},

	env: {
		DB: Database,
		PROFILE_BUCKET: ProfileBucket,

		AUTH_RATE_LIMITER: Cloudflare.RateLimit("AUTH_RATE_LIMITER", {
			namespaceId: 80085,
			simple: {
				limit: 10,
				period: 60,
			},
		}),

		LIFECYCLE_WORKFLOW: Cloudflare.Workflow("LifecycleWorkflow", {
			className: "LifecycleWorkflow",
		}),

		INSTANCE_NAME: Config.string("INSTANCE_NAME"),
		DASHBOARD_DOMAIN: Config.string("DASHBOARD_DOMAIN"),
		RP_NAME: "Maze ID",
		RP_ID: Config.string("DASHBOARD_DOMAIN"),
		ORIGIN: Config.string("DASHBOARD_DOMAIN").pipe(
			Config.map((domain) => `https://${domain}`),
		),
		OIDC_ISSUER: Config.string("OIDC_ISSUER"),
		LOCALHOST: Config.boolean("LOCALHOST"),

		ADMIN_BOOTSTRAP_SECRET: Config.redacted("ADMIN_BOOTSTRAP_SECRET"),
		OIDC_PRIVATE_KEY: Config.redacted("OIDC_PRIVATE_KEY"),
	},
});

export type ApiEnv = Cloudflare.InferEnv<typeof Api>;
