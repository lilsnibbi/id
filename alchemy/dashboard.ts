import * as Cloudflare from "alchemy/Cloudflare";
import * as Config from "effect/Config";

export const Dashboard = Cloudflare.Worker("Dashboard", {
	name: Config.string("INSTANCE_NAME").pipe(
		Config.map((name) => `${name}-dashboard`),
	),

	main: "./apps/dashboard/worker.ts",

	domain: Config.string("DASHBOARD_DOMAIN"),

	workersDev: false,

	assets: {
		directory: "./apps/dashboard/dist",
		binding: "ASSETS",
		notFoundHandling: "single-page-application",
	},

	env: {},
});

export type DashboardEnv = Cloudflare.InferEnv<typeof Dashboard>;
