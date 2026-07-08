---
title: Deploy Static Apps
order: 10
estMinutes: 10
difficulty: easy
checklist:
  - Build static output locally or in CI
  - Copy files to the web root
  - Serve files with Nginx
  - Configure SPA fallback when needed
  - Roll back by keeping previous builds
---

A **static app** is just a folder of plain HTML/CSS/JS files — no server-side code needed to run it. This makes deployment refreshingly simple: build the files, and copy them onto the server.

## Building and copying

```bash
npm run build   # creates a folder like dist/ with all the final files
rsync -avz --delete dist/ deploy@example.com:/var/www/site/
```

`rsync` copies the new files over, updating only what changed (and removing anything no longer needed with `--delete`).

## Serving it

Nginx can serve a folder of static files directly — no app process needed at all:

```nginx
root /var/www/site;
index index.html;
```

That's genuinely the whole setup for a basic static site.

## Make rollback trivial

> [!TIP]
> Keep the previous build around (in a separate folder, or with versioned names) so rolling back is just switching which folder Nginx points to — not a stressful rebuild under pressure if something goes wrong.

## In one sentence

Static apps deploy simply: build the files, copy them to the server with `rsync`, and let Nginx serve the folder directly — and keep the previous build around so rollback is instant.

## Want to go deeper?

Switch to **Expert** mode above for SPA (single-page app) routing fallback configuration.
