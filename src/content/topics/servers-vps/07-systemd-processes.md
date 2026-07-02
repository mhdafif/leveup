---
title: Systemd Processes
order: 7
estMinutes: 35
difficulty: medium
checklist:
  - Explain systemd services
  - Create a service file for an app
  - Start, stop, restart, and enable services
  - Inspect service logs
  - Configure restart behavior
---

`systemd` keeps long-running processes alive. Instead of starting an app manually in a terminal, define a service.

```ini
[Unit]
Description=LevelUp app
After=network.target

[Service]
WorkingDirectory=/var/www/app
ExecStart=/usr/bin/node server.js
Restart=always
User=deploy

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now levelup
sudo systemctl status levelup
journalctl -u levelup -f
```

## Further Learning

- **"systemd service file ExecStart"** — service units
- **"journalctl service logs"** — log inspection
- **"systemctl enable restart"** — lifecycle commands
