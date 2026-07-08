---
title: Environment Variables
order: 1
estMinutes: 10
difficulty: easy
checklist:
  - Separate config from code
  - Distinguish build-time and runtime variables
  - Avoid committing secrets
  - Validate required variables on startup
  - Document variables per environment
---

**Environment variables** let the same code behave differently in different places — your laptop, staging, production — without changing a single line of code. Think of them as settings you plug in from outside, not baked into the code itself.

```bash
DATABASE_URL=postgres://...
PUBLIC_API_BASE=https://api.example.com
```

## Two flavors: build-time vs. runtime

- **Build-time** — baked into the app when it's *built* (common for static frontends).
- **Runtime** — read fresh each time the server *starts* (common for backend servers).

Knowing which kind you're dealing with matters: changing a build-time variable means you have to rebuild, not just restart.

## The rule that matters most

> [!WARNING]
> Anything exposed to the browser is **public** — anyone can view it in DevTools. Never put real secrets (passwords, private keys) in frontend environment variables, even ones with fancy names.

## Fail fast if something's missing

Check required variables the moment your app starts, so a missing setting causes an obvious crash immediately — not a confusing failure later:

```ts
if (!process.env.DATABASE_URL) throw new Error('Missing DATABASE_URL')
```

## In one sentence

Environment variables let the same code run differently across environments — keep secrets out of anything shipped to the browser, and validate required variables the moment the app starts.

## Want to go deeper?

Switch to **Expert** mode above for build-time vs runtime behavior in more detail and validation with schema libraries.
