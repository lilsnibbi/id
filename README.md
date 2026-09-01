Current setup is as follows:

Copy .env.example to .env

Fill out all values

Do `bun run generate:config` to generate the wrangler configs

From `apps/api`, run `bunx wrangler d1 create maze-id-api`

From repo root, run `bun run build:dashboard`
