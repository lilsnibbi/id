import { Hono } from "hono";

import jwksRoute from "./jwks";
import openidConfigurationRoute from "./openid-configuration";

const wellKnown = new Hono<{
	Bindings: Env;
}>();

wellKnown.route("/jwks.json", jwksRoute);
wellKnown.route("/openid-configuration", openidConfigurationRoute);

export default wellKnown;
