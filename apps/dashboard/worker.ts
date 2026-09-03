export default {
	// @ts-expect-error Env will be defined
	async fetch(request: Request, env: Env): Promise<Response> {
		return env.ASSETS.fetch(request);
	},
};
