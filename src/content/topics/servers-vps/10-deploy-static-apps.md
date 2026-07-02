---
title: Deploy Static Apps
order: 10
estMinutes: 25
difficulty: easy
checklist:
  - Build static output locally or in CI
  - Copy files to the web root
  - Serve files with Nginx
  - Configure SPA fallback when needed
  - Roll back by keeping previous builds
---

Static apps produce files that any web server can serve. Astro static output usually lives in `dist/`.

```bash
pnpm build
rsync -avz --delete dist/ deploy@example.com:/var/www/site/
```

Nginx can serve that directory directly:

```nginx
root /var/www/site;
index index.html;
```

> [!TIP]
> Keep a previous build directory or artifact so rollback is a copy/symlink change, not a rebuild under pressure.

## Further Learning

- **"Nginx static site root index"** — static hosting
- **"rsync deploy static site"** — file sync deploys
- **"Astro static deploy nginx"** — Astro output hosting
