# Deploying LevelUp to a VPS

LevelUp builds to a folder of static files (`dist/`). No Node runtime is needed
in production — any static file server works. These notes use nginx.

## 1. Build locally

```bash
pnpm install
pnpm build        # runs `astro build` then `pagefind --site dist`
```

The output is in `dist/`, including the PWA service worker (`sw.js`),
`manifest.webmanifest`, and the Pagefind search index under `pagefind/`.

## 2a. Deploy with rsync (simplest)

On the VPS, create the web root and install nginx:

```bash
sudo mkdir -p /var/www/levelup
sudo cp deploy/nginx.conf /etc/nginx/sites-available/levelup
sudo ln -s /etc/nginx/sites-available/levelup /etc/nginx/sites-enabled/levelup
sudo nginx -t && sudo systemctl reload nginx
```

From your machine, push the build:

```bash
rsync -avz --delete dist/ user@your-vps:/var/www/levelup/
```

Re-run that `rsync` after every `pnpm build` to deploy updates.

## 2b. Deploy with Docker (optional)

After `pnpm build`:

```bash
docker build -f deploy/Dockerfile -t levelup .
docker run -d --name levelup -p 80:80 levelup
```

## 2c. Deploy with Nixpacks (optional)

Platforms that support Nixpacks can build from the repo root. The included
`nixpacks.toml` uses Node 22 + pnpm, runs `pnpm build`, then serves the static
output with Astro preview on `$PORT`.

```bash
nixpacks build . -n levelup
```

No extra start command is needed unless your platform overrides it. If it does,
use:

```bash
pnpm preview --host 0.0.0.0 --port $PORT
```

## HTTPS

Put the site behind TLS with Certbot:

```bash
sudo certbot --nginx -d your-domain.com
```

A PWA only becomes installable over HTTPS (or on `localhost`), so enable TLS
before testing "Add to Home Screen".

## Notes

- All user data (progress, coins, notes) lives in the visitor's browser
  `localStorage` — there is no database or backend to provision.
- To add study content, drop new markdown files under
  `src/content/topics/<topic>/` and rebuild. See the top-level `README.md`.
