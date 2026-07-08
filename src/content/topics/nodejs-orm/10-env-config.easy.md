---
title: Environment Config & Secrets
order: 10
estMinutes: 10
difficulty: easy
checklist:
  - Store configuration in environment variables, not in source code
  - Create a .env.example file that documents required variables without real values
  - Load environment variables with dotenv in development
  - Validate all required env vars at startup using a schema
  - Parse the DATABASE_URL connection string anatomy
---

Your app needs settings that differ between your laptop, staging, and production — like which database to connect to. **Environment variables** let you keep those settings *out* of your code, so the same code runs everywhere with different configuration.

## Keeping secrets out of your code

Put real values in a local `.env` file (never committed to Git), and commit a `.env.example` that just lists the *names* with placeholder values, so teammates know what to fill in:

```
# .env.example (safe to commit)
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
PORT=3000
```

```ts
import 'dotenv/config'   // loads .env into process.env
console.log(process.env.DATABASE_URL)
```

> [!WARNING]
> Never commit a `.env` file with *real* secrets. Add `.env` to your `.gitignore` immediately — a leaked database password is a serious problem.

## Check your config as soon as the app starts

Don't discover a missing setting halfway through handling a request — validate everything the moment your app boots, so it fails immediately (and obviously) if something's missing:

```ts
import { z } from 'zod'

const env = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
}).parse(process.env)
```

If `DATABASE_URL` is missing, your app refuses to even start — much better than a confusing crash later.

## In one sentence

Store settings that vary per environment in environment variables (never hardcoded, never committed as real secrets), document them in a `.env.example`, and validate them all at startup so missing config fails immediately and obviously.

## Want to go deeper?

Switch to **Expert** mode above for the full `DATABASE_URL` anatomy and production secret management.
