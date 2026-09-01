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
* Create the `use-argon-2-id` feature flag with a default value of `off`.
* Generate Wrangler types.

4. Deploy:

```bash
bun run deploy
```

## Experimental: Argon2id

Argon2id support is currently experimental.

Maze ID supports Argon2id password hashing behind a Cloudflare Flagship feature flag. The feature is disabled by default and should be considered experimental until it has been sufficiently tested in production-like conditions.

When the flag is disabled, new passwords use the existing PBKDF2-SHA-256 implementation. When enabled, new passwords use Argon2id.

Enable Argon2id:

```bash
bun run argon:on
```

Disable Argon2id:

```bash
bun run argon:off
```

The feature flag only controls how new passwords are hashed. Password verification automatically detects the algorithm used by the stored password hash, so disabling the flag does not invalidate passwords that were previously hashed with Argon2id.

Flag changes may take a short time to propagate through Cloudflare.

The current experimental Argon2id configuration uses 64 MiB of memory, 2 iterations, and a parallelism value of 1.
