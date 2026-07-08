---
title: Environment Config and Secrets
order: 7
estMinutes: 10
difficulty: easy
checklist:
  - Separate public config from private secrets
  - Validate required environment variables at startup
  - Keep secrets out of client bundles
  - Rotate credentials without code changes
  - Document environment setup for developers
---

Your app has two kinds of configuration: things that are **fine for anyone to see** (like an API URL) and things that are **secret** (like a database password). Mixing these up is a real security risk in a full-stack app.

## Public vs. private

- **Public config** — safe to ship in your frontend bundle (an API base URL, an analytics ID). Anyone can see it in DevTools anyway.
- **Private secrets** — must stay on the **server only**: database URLs, signing keys, third-party tokens.

```ts
type PublicConfig = { apiBaseUrl: string }
type ServerConfig = { databaseUrl: string, sessionSecret: string }
```

> [!WARNING]
> Anything that ends up in your frontend's JavaScript bundle is visible to *everyone*, no matter how it's named. Never put real secrets there — only truly public values.

## Fail loudly if something's missing

Don't let your app start with broken configuration — check for required values immediately and refuse to boot if any are missing:

```ts
function requireEnv(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing environment variable ${name}`)
  return value
}

const databaseUrl = requireEnv('DATABASE_URL')
```

A clear "missing config" crash at startup is far better than a confusing failure deep inside a request later.

## In one sentence

Split configuration into public (safe for the frontend bundle) and private secrets (server-only, never shipped to browsers), and validate all required values at startup so missing config fails fast and clearly.

## Want to go deeper?

Switch to **Expert** mode above for credential rotation and documenting environment setup for a team.
