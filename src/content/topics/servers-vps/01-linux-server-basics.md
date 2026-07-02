---
title: Linux Server Basics
order: 1
estMinutes: 25
difficulty: easy
checklist:
  - Navigate common Linux directories
  - Inspect CPU, memory, disk, and processes
  - Install packages with the system package manager
  - Edit config files safely
  - Reboot and update a server deliberately
---

A VPS is usually a Linux machine you control remotely. Basic server work means understanding files, processes, users, packages, and logs.

Common commands:

```bash
pwd
ls -la
df -h
free -m
top
sudo apt update
```

Important directories:

- `/etc` — system and service configuration
- `/var/log` — logs
- `/var/www` — common web root location
- `/home` — user directories

> [!TIP]
> Before changing config, copy the original file or use version-controlled deployment files.

## Further Learning

- **"Linux filesystem hierarchy"** — common directories
- **"system resource commands Linux"** — CPU/memory/disk inspection
- **"apt package manager basics"** — package installation
