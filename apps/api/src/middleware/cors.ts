import { cors } from "hono/cors";

export function dashboardCors() {
	return cors({
		origin: (origin, c) => {
			const dashboardOrigin = `https://${c.env.DASHBOARD_DOMAIN}`;

			console.log(
				`CORS origin=${origin} expected=${dashboardOrigin} match=${origin === dashboardOrigin}`,
			);

			return origin === dashboardOrigin ? origin : null;
		},
		credentials: true,
	});
}
