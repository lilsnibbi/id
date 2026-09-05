import { cors } from "hono/cors";

export function dashboardCors() {
	return cors({
		origin: (origin, c) => {
			const dashboardOrigin = `https://${c.env.DASHBOARD_DOMAIN}`;

			return origin === dashboardOrigin ? origin : null;
		},
		credentials: true,
	});
}
