---
title: Cloudflare Pages Deployment
order: 6
estMinutes: 30
difficulty: easy
checklist:
  - Explain what Cloudflare Pages hosts
  - Configure build command and output directory
  - Deploy a static frontend
  - Use environment variables
  - Understand preview deployments
---

Cloudflare Pages hosts static sites and frontend apps. It connects to a Git repo, runs a build command, and serves the output globally.

For an Astro static app, typical settings are:

```txt
Build command: pnpm build
Output directory: dist
```

Environment variables can differ between production and preview. Use them for public build-time config, not secrets that must stay server-only in a fully static app.

> [!TIP]
> Preview deployments are useful for checking pull requests before merging.

## Further Learning

- **"Cloudflare Pages Astro"** — Astro deployment guide
- **"Cloudflare Pages build configuration"** — commands and output directory
- **"Cloudflare Pages environment variables"** — production vs preview config
