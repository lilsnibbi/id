# Setup

1. Copy `.env.example` to `.env`.

2. Fill out all values in `.env`.

3. Run the setup script:

```bash
bun run setup
```

This will:

* Generate the Wrangler configuration files.
* Create or configure the D1 database.
* Create the Flagship app and add the `FLAGS` binding to the API Wrangler configuration.

4. Deploy:

```bash
bun run deploy
```
