---
title: Systemd Processes
order: 7
estMinutes: 12
difficulty: easy
checklist:
  - Explain systemd services
  - Create a service file for an app
  - Start, stop, restart, and enable services
  - Inspect service logs
  - Configure restart behavior
---

If you start your app by just typing `node server.js` in a terminal, it stops the moment you close that window — not great for a real server. **systemd** keeps long-running apps alive properly, restarting them automatically if they crash, and starting them on boot.

## Describing your app as a service

```ini
[Unit]
Description=My app
After=network.target

[Service]
WorkingDirectory=/var/www/app
ExecStart=/usr/bin/node server.js
Restart=always
User=deploy

[Install]
WantedBy=multi-user.target
```

`Restart=always` is the key line — if your app crashes, systemd automatically brings it back up.

## Controlling it

```bash
sudo systemctl daemon-reload         # tell systemd about the new service file
sudo systemctl enable --now my-app   # start it now, AND on every future boot
sudo systemctl status my-app         # is it running?
journalctl -u my-app -f              # watch its logs live
```

## In one sentence

systemd keeps your app running as a proper background service — restarting it automatically if it crashes and starting it on boot — instead of relying on a terminal window staying open.

## Want to go deeper?

Switch to **Expert** mode above for the full service-file options and log inspection with `journalctl`.
