---
title: Cloudflare Pages Deployment
order: 6
estMinutes: 10
difficulty: easy
checklist:
  - Explain what Cloudflare Pages hosts
  - Configure build command and output directory
  - Deploy a static frontend
  - Use environment variables
  - Understand preview deployments
---

**Cloudflare Pages** is a free, simple way to host static sites and frontend apps. Connect it to your Git repository, tell it how to build your project, and it handles the rest — building, hosting, and serving your site worldwide.

## The basic setup

For a typical static site (like an Astro project), the settings are just:

```
Build command: npm run build
Output directory: dist
```

Push to your Git repo, and Cloudflare automatically rebuilds and redeploys your site.

## Preview builds for every change

> [!TIP]
> Every pull request gets its own **preview deployment** — a live, shareable URL to see exactly what that change looks like, before merging it into your main branch. Great for reviewing changes visually before they go live.

## Environment variables

You can set different values for production vs. preview builds — but remember: since this is a *static* site, anything here ends up baked into the files anyone can view. Use it for public config, not secrets.

## In one sentence

Cloudflare Pages connects to your Git repo, runs your build command, and hosts the output globally — every pull request gets a preview URL, and environment variables here are for public config, not secrets.

## Want to go deeper?

Switch to **Expert** mode above for build configuration specifics and environment variable scoping.
