---
title: Environment Config & Secrets
order: 10
estMinutes: 20
difficulty: easy
checklist:
  - Store configuration in environment variables, not in source code
  - Create a .env.example file that documents required variables without real values
  - Load environment variables with dotenv in development
  - Validate all required env vars at startup using a schema
  - Parse the DATABASE_URL connection string anatomy
---

Configuration changes between environments. Source code should not. Environment variables let local development, staging, and production use different database URLs, ports, feature flags, and credentials without changing the application bundle.

## Env Files

Use `.env` locally for real values and `.env.example` for documented placeholders. Commit the example, never the real secrets. In development, load variables at the app entry point.

```ts
import "dotenv/config";

console.log(process.env.NODE_ENV);
```

Production platforms usually inject secrets through their own environment or secret manager. Avoid baking `.env` files into container images because images are copied, cached, and shared across systems.

Keep names boring and explicit. `DATABASE_URL`, `PORT`, and `NODE_ENV` are easier to operate than clever aliases that only one service understands.

## Startup Validation

Validate configuration before starting the server. A missing database URL should fail fast at boot, not halfway through the first request.

```ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const env = envSchema.parse(process.env);
```

This creates a typed `env` object and rejects invalid configuration early.

## Database URL Anatomy

A Postgres URL contains protocol, username, password, host, port, database name, and optional query parameters.

```ts
export function describeDatabaseUrl(databaseUrl: string) {
  const url = new URL(databaseUrl);
  return {
    protocol: url.protocol,
    username: url.username,
    host: url.hostname,
    port: url.port,
    database: url.pathname.slice(1),
    sslMode: url.searchParams.get("sslmode"),
  };
}
```

For example, `postgresql://user:password@host:5432/dbname?sslmode=require` tells the ORM how to reach and authenticate with the database.

> [!WARNING]
> Never commit a .env file with real secrets to git. Add .env to .gitignore immediately. Commit only .env.example with placeholder values.

## Further Learning

Search these terms to go deeper:
- **"twelve factor app config"** — storing config in the environment
- **"dotenv Node.js TypeScript"** — loading local development environment variables
- **"zod environment variable validation"** — failing fast with typed config
- **"Postgres DATABASE_URL format sslmode"** — connection string fields and options
