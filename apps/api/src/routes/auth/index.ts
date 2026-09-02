import { Hono } from "hono";
import login from "./login";
import logout from "./logout";
import me from "./me";
import register from "./register";
import sessions from "./sessions";

const auth = new Hono<{ Bindings: Env }>();

auth.route("/register", register);
auth.route("/login", login);
auth.route("/logout", logout);
auth.route("/me", me);
auth.route("/sessions", sessions);

export default auth;
