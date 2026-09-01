# Setup

1. Copy `.env.example` to `.env`.

2. Fill out all values in `.env`.

3. Generate the Wrangler configuration files:

```bash
bun run generate:config
```

4. From `apps/api`, create the D1 database:

```bash
bunx wrangler d1 create maze-id-api
```

Replace `maze-id-api` with whatever you want to name your database.

5. Set up the Flagship app:

```bash
bun run setup:flagship
```

This creates the Flagship app using your `INSTANCE_NAME` and adds the `FLAGS` binding to the API Wrangler configuration.

6. From the repository root, build the dashboard:

```bash
bun run build:dashboard
```

7. Deploy! You can do this with:

```bash
bun run deploy
```
