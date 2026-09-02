import { Hono } from "hono";

import { getPublicJwk } from "../../lib/oauth/keys";

const jwksRoute = new Hono<{
	Bindings: Env;
}>();

jwksRoute.get("/", (c) => {
	const jwk = getPublicJwk(c.env.OIDC_PRIVATE_KEY);

	return c.json({
		keys: [jwk],
	});
});

export default jwksRoute;
