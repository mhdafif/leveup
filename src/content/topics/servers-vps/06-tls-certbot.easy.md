---
title: TLS with Certbot
order: 6
estMinutes: 10
difficulty: easy
checklist:
  - Explain what TLS certificates prove
  - Install Certbot for Nginx
  - Issue a certificate for a domain
  - Verify auto-renewal
  - Redirect HTTP to HTTPS
---

That little padlock in the address bar (HTTPS) needs a **TLS certificate** to work. **Certbot** is a free tool that gets you one automatically (from Let's Encrypt) and keeps it renewed — no manual paperwork required.

## Getting a certificate

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

That's it. Certbot talks to Let's Encrypt, proves you control the domain, gets a certificate, and even configures Nginx to use it — including setting up the HTTP→HTTPS redirect automatically.

> [!TIP]
> Your domain's DNS must already point at your server *before* running this — Certbot needs to reach your server through the real domain to prove you own it.

## Certificates expire — make sure renewal works

Certificates need periodic renewal (usually every ~90 days for Let's Encrypt). Certbot sets up automatic renewal, but you should verify it actually works:

```bash
sudo certbot renew --dry-run
```

This simulates a renewal without actually changing anything — a safe way to confirm it'll work when the real renewal time comes.

## In one sentence

Certbot automatically gets you a free TLS certificate (for the HTTPS padlock) from Let's Encrypt and configures your server to use and renew it — just make sure DNS is pointed at your server first, and test renewal with `--dry-run`.

## Want to go deeper?

Switch to **Expert** mode above for how the domain validation process works under the hood.
