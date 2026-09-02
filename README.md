## Repository Structure

Maze ID uses Git submodules for the API and dashboard applications:

* **API:** `https://github.com/thehazell/id-api`
* **Dashboard:** `https://github.com/thehazell/id-dashboard`

If you clone this repository, make sure to initialize the submodules:

```bash
git clone --recurse-submodules https://github.com/thehazell/id.git
```

If you have already cloned the repository without `--recurse-submodules`, initialize them with:

```bash
git submodule update --init --recursive
```

## Setup

1. Copy `.env.example` to `.env`.

2. Fill in all required values in `.env`.

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

Argon2id password hashing is currently experimental.

Maze ID supports Argon2id behind a Cloudflare Flagship feature flag. The feature is disabled by default and should be considered experimental until it has been sufficiently tested in production-like environments.

When the flag is **disabled**, new passwords are hashed using the existing PBKDF2-SHA-256 implementation. When the flag is **enabled**, new passwords are hashed using Argon2id.

### Enable Argon2id

```bash
bun run argon:on
```

### Disable Argon2id

```bash
bun run argon:off
```

The feature flag only controls the algorithm used to hash **new passwords**. Password verification automatically detects the algorithm used by the stored password hash, so disabling the flag does not invalidate passwords that were previously hashed with Argon2id.

Flag changes may take a short time to propagate through Cloudflare.

The current experimental Argon2id configuration uses:

* **Memory:** 64 MiB
* **Iterations:** 2
* **Parallelism:** 1
