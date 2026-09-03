import { Hono } from "hono";
import bootstrap from "./bootstrap";
import lifecycle from "./lifecycle";

const admin = new Hono<{ Bindings: Env }>();

admin.route("/bootstrap", bootstrap);
admin.route("/lifecycle", lifecycle);

export default admin;
