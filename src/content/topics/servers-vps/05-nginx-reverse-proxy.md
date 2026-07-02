---
title: Nginx Reverse Proxy
order: 5
estMinutes: 35
difficulty: medium
checklist:
  - Explain reverse proxy behavior
  - Serve static files with Nginx
  - Proxy traffic to a local app process
  - Set Host and forwarding headers
  - Test and reload Nginx config
---

Nginx often sits on ports `80` and `443`, then serves files or forwards requests to an app running on localhost.

```nginx
server {
  listen 80;
  server_name example.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Always test before reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Further Learning

- **"Nginx reverse proxy proxy_pass"** — proxy basics
- **"Nginx serve static files"** — static deployment
- **"X-Forwarded-For X-Forwarded-Proto"** — proxy headers
