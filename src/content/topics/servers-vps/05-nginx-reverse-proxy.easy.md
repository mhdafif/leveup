---
title: Nginx Reverse Proxy
order: 5
estMinutes: 12
difficulty: easy
checklist:
  - Explain reverse proxy behavior
  - Serve static files with Nginx
  - Proxy traffic to a local app process
  - Set Host and forwarding headers
  - Test and reload Nginx config
---

Your app probably runs on some internal port (like `3000`), but visitors expect to reach it at a normal web address on port 80/443. **Nginx** sits in front and forwards public traffic to your app running behind it — this is a **reverse proxy**.

## A basic setup

```nginx
server {
  listen 80;
  server_name example.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

`proxy_pass` says "send this request to my app running on port 3000." The `proxy_set_header` lines pass along useful info (like the original visitor's address) that your app would otherwise lose.

## Always test before you reload

```bash
sudo nginx -t              # check the config is valid FIRST
sudo systemctl reload nginx  # apply it
```

> [!TIP]
> Always run `nginx -t` before reloading. If your config has a typo, this catches it *before* it takes your live site down — reloading a broken config can knock your whole server offline.

## In one sentence

Nginx acts as a reverse proxy — accepting public web traffic and forwarding it to your app running privately on a port like 3000 — and you should always run `nginx -t` to validate the config before reloading.

## Want to go deeper?

Switch to **Expert** mode above for serving static files directly and the full forwarding-header setup.
