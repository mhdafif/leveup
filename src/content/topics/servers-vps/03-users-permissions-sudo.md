---
title: Users, Permissions, and Sudo
order: 3
estMinutes: 25
difficulty: easy
checklist:
  - Create a non-root user
  - Understand file owner, group, and mode
  - Use chmod and chown carefully
  - Grant sudo access
  - Avoid running apps as root
---

Linux permissions decide who can read, write, and execute files. Production apps should usually run as a dedicated user, not as `root`.

```bash
sudo adduser deploy
sudo usermod -aG sudo deploy
ls -l app.log
sudo chown deploy:deploy app.log
chmod 640 app.log
```

Permission bits are owner, group, and others:

```txt
-rw-r-----  deploy deploy  app.log
```

> [!WARNING]
> `chmod 777` is almost never the right fix. It hides ownership problems by making files writable by everyone.

## Further Learning

- **"Linux file permissions chmod chown"** — permission model
- **"sudoers Linux"** — privilege escalation
- **"run service as non-root Linux"** — safer app runtime
