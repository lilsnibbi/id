import { Hono } from "hono";

import deletePasskey from "./delete";
import loginOptions from "./login-options";
import loginVerify from "./login-verify";
import listPasskeys from "./list";
import registerOptions from "./register-options";
import registerVerify from "./register-verify";
import renamePasskey from "./rename";

const passkeysRoute = new Hono<{
	Bindings: Env;
}>();

passkeysRoute.route("/", listPasskeys);
passkeysRoute.route("/", renamePasskey);
passkeysRoute.route("/", deletePasskey);
passkeysRoute.route("/register", registerOptions);
passkeysRoute.route("/register", registerVerify);
passkeysRoute.route("/login", loginOptions);
passkeysRoute.route("/login", loginVerify);

export default passkeysRoute;
