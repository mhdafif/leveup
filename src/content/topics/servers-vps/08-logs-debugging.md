---
title: Logs and Debugging
order: 8
estMinutes: 30
difficulty: medium
checklist:
  - Locate system and service logs
  - Follow logs while reproducing a bug
  - Separate app errors from proxy errors
  - Check disk, memory, and process health
  - Use logs without leaking secrets
---

Production debugging starts with evidence. Logs answer what happened, when, and often why.

```bash
journalctl -u nginx -f
journalctl -u my-app --since "1 hour ago"
sudo tail -f /var/log/nginx/error.log
```

Check resources too:

```bash
df -h
free -m
systemctl status my-app
```

> [!WARNING]
> Logs should not contain passwords, API keys, auth tokens, or full private payloads.

## Further Learning

- **"journalctl examples"** — querying systemd logs
- **"Nginx access error logs"** — proxy debugging
- **"Linux out of disk debug"** — common server failure
