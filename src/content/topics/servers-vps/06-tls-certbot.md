---
title: TLS with Certbot
order: 6
estMinutes: 30
difficulty: medium
checklist:
  - Explain what TLS certificates prove
  - Install Certbot for Nginx
  - Issue a certificate for a domain
  - Verify auto-renewal
  - Redirect HTTP to HTTPS
---

TLS certificates let browsers verify they are talking to the correct domain and encrypt traffic. Let's Encrypt provides free certificates, and Certbot automates issuance and renewal.

```bash
sudo certbot --nginx -d example.com -d www.example.com
sudo certbot renew --dry-run
```

> [!TIP]
> DNS must already point to the server before HTTP validation can succeed.

Certificate renewal usually runs through a system timer. Always test renewal after setup.

## Further Learning

- **"Certbot nginx Ubuntu"** — install flow
- **"Let's Encrypt HTTP challenge"** — validation model
- **"certbot renew dry run"** — renewal testing
