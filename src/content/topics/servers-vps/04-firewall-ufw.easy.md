---
title: Firewall with UFW
order: 4
estMinutes: 10
difficulty: easy
checklist:
  - Explain default deny inbound traffic
  - Allow SSH safely
  - Allow HTTP and HTTPS
  - Check firewall status
  - Remove unnecessary open ports
---

A **firewall** decides which doors into your server are open. The safest default: **everything closed** except the specific things you actually need. `ufw` (Uncomplicated Firewall) is a friendly tool for managing this on Ubuntu servers.

## Opening only what's needed

```bash
sudo ufw allow OpenSSH    # keep your remote login working
sudo ufw allow 80/tcp     # allow regular web traffic
sudo ufw allow 443/tcp    # allow secure (HTTPS) web traffic
sudo ufw enable
sudo ufw status verbose   # see what's actually open
```

A basic web server usually only needs these three doors open — nothing else.

## The order matters

> [!IMPORTANT]
> Always allow SSH access **before** turning the firewall on. If you enable the firewall first and haven't allowed SSH, you'll instantly lock yourself out of the server with no way back in.

## Less exposed = safer

Every open port is a potential target. If something (like a database) only needs to be reached from *inside* the server, don't open it to the whole internet — only expose what the outside world genuinely needs.

## In one sentence

A firewall should deny everything by default and only open the specific ports you need (SSH, HTTP, HTTPS) — and always allow SSH *before* enabling the firewall, or you'll lock yourself out.

## Want to go deeper?

Switch to **Expert** mode above for inspecting open ports and reducing your attack surface further.
