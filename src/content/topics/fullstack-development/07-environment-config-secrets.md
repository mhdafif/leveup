---
title: Environment Config and Secrets
order: 7
estMinutes: 30
difficulty: medium
checklist:
  - Separate public config from private secrets
  - Validate required environment variables at startup
  - Keep secrets out of client bundles
  - Rotate credentials without code changes
  - Document environment setup for developers
---

Configuration decides how the same code behaves in development, staging, and production. Secrets are sensitive configuration values that must never ship to browsers or source control.

## Public vs Private

Frontend public config can include values like API base paths and analytics ids. Backend private config includes database URLs, signing keys, and provider tokens.

```ts
type PublicConfig = {
  apiBaseUrl: string;
};

type ServerConfig = {
  databaseUrl: string;
  sessionSecret: string;
  storageToken: string;
};
```

Anything embedded into a client bundle is visible to users. Prefix conventions are helpful, but teams still need code review discipline.

## Startup Validation

```ts
function requireEnv(env: NodeJS.ProcessEnv, name: string): string {
  const value = env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

const config = {
  databaseUrl: requireEnv(process.env, "DATABASE_URL"),
  sessionSecret: requireEnv(process.env, "SESSION_SECRET"),
};
```

> [!TIP]
> Fail fast during startup when required config is missing. A half-running app with broken secrets creates confusing production failures.

## Further Learning

Search these terms to go deeper:
- **"public runtime config vs secrets frontend"** — what can be exposed
- **"environment variable validation TypeScript"** — typed startup config
- **"secret rotation best practices"** — changing credentials safely
- **"twelve factor app config principle"** — environment-based configuration
