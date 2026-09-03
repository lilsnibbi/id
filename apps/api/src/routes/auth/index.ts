import { Hono } from "hono";
import login from "./login";
import logout from "./logout";
import me from "./me";
import register from "./register";
import sessions from "./sessions";
import { rateLimit } from "../../middleware/rateLimiter";

const auth = new Hono<{ Bindings: Env }>();
auth.use(
	"*",
	rateLimit((c) => `auth:${c.req.header("CF-Connecting-IP") ?? "unknown"}`),
);
auth.route("/register", register);
auth.route("/login", login);
auth.route("/logout", logout);
auth.route("/me", me);
auth.route("/sessions", sessions);

export default auth;
