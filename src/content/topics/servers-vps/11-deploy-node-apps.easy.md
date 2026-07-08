---
title: Deploy Node Apps
order: 11
estMinutes: 10
difficulty: easy
checklist:
  - Build the app on server or CI
  - Run the app on localhost
  - Put Nginx in front of the app
  - Manage environment variables
  - Restart safely after deploy
---

Deploying a Node app (unlike a static site) means keeping an actual running process alive, and putting something in front of it to handle public traffic safely.

## The typical setup

```
Browser → Nginx (public, port 443) → Node app (private, port 3000)
```

Nginx faces the internet and handles HTTPS; your Node app just runs quietly on an internal port that only the server itself can reach. (See the earlier lessons on Nginx and systemd for how each piece works.)

## The deploy sequence

```bash
npm install
npm run build
sudo systemctl restart my-app   # picks up the new code
```

Restarting the systemd service is what actually swaps in your new code — just building isn't enough on its own.

## Settings, not secrets, in your code

Environment variables (database URLs, API keys) should be injected through systemd's config or a protected env file — never hardcoded and never committed to the repository.

> [!WARNING]
> Never commit a production `.env` file to Git. If it contains real secrets and ends up in your repo history, treat those secrets as compromised.

## In one sentence

Deploying a Node app means Nginx handling public traffic and forwarding to your app running privately, with a restart step (via systemd) actually applying new code — and environment variables/secrets should never be committed to Git.

## Want to go deeper?

Switch to **Expert** mode above for the full deployment flow with environment variable management.
