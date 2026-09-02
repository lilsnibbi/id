import { cors } from "hono/cors";

export function dashboardCors() {
	return cors({
		origin: (origin, c) => {
			return origin === `https://${c.env.DASHBOARD_DOMAIN}` ? origin : null;
		},
		credentials: true,
	});
}
