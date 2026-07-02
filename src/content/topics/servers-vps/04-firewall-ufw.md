---
title: Firewall with UFW
order: 4
estMinutes: 20
difficulty: easy
checklist:
  - Explain default deny inbound traffic
  - Allow SSH safely
  - Allow HTTP and HTTPS
  - Check firewall status
  - Remove unnecessary open ports
---

`ufw` is a simple firewall wrapper often used on Ubuntu servers. A basic web server should expose only what it needs.

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose
```

> [!IMPORTANT]
> Allow SSH before enabling the firewall, or you can lock yourself out.

Public ports are part of your attack surface. If a database only needs local access, do not expose it to the internet.

## Further Learning

- **"ufw allow OpenSSH"** — safe setup sequence
- **"Linux firewall open ports"** — port exposure
- **"ss command listening ports"** — inspect services
