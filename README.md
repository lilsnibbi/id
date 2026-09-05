# Maze ID

Maze ID is a self-hosted identity service built as a Cloudflare Workers monorepo.

## Repository Structure

```text
apps/
├── api/          # API Worker
└── dashboard/    # Dashboard application
```

## Requirements

- [Bun](https://bun.sh/)
- A Cloudflare account
- A configured `.env` file

## Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Fill in the required values in `.env`.

## Infrastructure

Maze ID uses [Alchemy](https://alchemy.run/) to manage its Cloudflare infrastructure.

To preview the infrastructure changes:

```bash
bun run plan
```

To deploy:

```bash
bun run deploy
```

No additional provisioning or setup commands are required.

## Development

### API

The API application is located at:

```text
apps/api
```

### Dashboard

The dashboard application is located at:

```text
apps/dashboard
```

## Deployment

The complete deployment is managed through Alchemy:

```bash
bun run plan
bun run deploy
```

Alchemy manages the required Cloudflare resources and application bindings for the deployment.

## Environment

Configuration is provided through the root `.env` file.

See `.env.example` for the required environment variables.

## License

See the repository license for details.
