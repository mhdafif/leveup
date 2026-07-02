---
title: Environment Variables
order: 1
estMinutes: 25
difficulty: easy
checklist:
  - Separate config from code
  - Distinguish build-time and runtime variables
  - Avoid committing secrets
  - Validate required variables on startup
  - Document variables per environment
---

Environment variables let the same code run in different environments. Common examples are API URLs, feature flags, database URLs, and secrets.

```bash
DATABASE_URL=postgres://...
PUBLIC_API_BASE=https://api.example.com
```

Static frontend apps often bake variables at build time. Server apps can read runtime variables when the process starts.

> [!WARNING]
> Anything exposed to browser JavaScript is public. Do not put private secrets in frontend env variables.

## Further Learning

- **"12 factor app config"** — config principle
- **"build time vs runtime env variables"** — deployment behavior
- **"environment variable validation zod"** — startup checks
