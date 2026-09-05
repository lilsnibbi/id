import type { DashboardEnv } from "../../alchemy/dashboard";

export default {
	async fetch(request: Request, env: DashboardEnv): Promise<Response> {
		return env.ASSETS.fetch(request);
	},
};
