import { Hono } from "hono";
import password from "./password";

const security = new Hono<{ Bindings: Env }>();

security.route("/password", password);

export default security;
