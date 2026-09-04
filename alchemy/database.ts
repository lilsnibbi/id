import * as Cloudflare from "alchemy/Cloudflare";

export const Database = Cloudflare.D1.Database("ApiDatabase", {
	migrations: "./apps/api/drizzle/migrations",
});
