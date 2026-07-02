---
title: Deploy Node Apps
order: 11
estMinutes: 35
difficulty: medium
checklist:
  - Build the app on server or CI
  - Run the app on localhost
  - Put Nginx in front of the app
  - Manage environment variables
  - Restart safely after deploy
---

Node apps need a running process. A common setup is Nginx on public ports and Node on localhost.

```txt
Browser -> Nginx :443 -> Node app :3000
```

Deploy flow:

```bash
pnpm install --frozen-lockfile
pnpm build
sudo systemctl restart my-app
```

Environment variables should be injected through systemd, a secrets manager, or controlled env files with strict permissions.

> [!WARNING]
> Do not commit production `.env` files to git.

## Further Learning

- **"Node app systemd deploy"** — process management
- **"Nginx reverse proxy Node app"** — traffic routing
- **"environment variables production Node"** — config handling
