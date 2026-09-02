import { Hono } from "hono";
import bootstrap from "./bootstrap";

const admin = new Hono<{ Bindings: Env }>();

admin.route("/bootstrap", bootstrap);

export default admin;
