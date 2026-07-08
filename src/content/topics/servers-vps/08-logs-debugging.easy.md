---
title: Logs and Debugging
order: 8
estMinutes: 10
difficulty: easy
checklist:
  - Locate system and service logs
  - Follow logs while reproducing a bug
  - Separate app errors from proxy errors
  - Check disk, memory, and process health
  - Use logs without leaking secrets
---

When something's wrong on a server, **logs** are your evidence — they tell you what happened, when, and often why. Debugging production issues almost always starts with reading them.

## Watching logs live

```bash
journalctl -u my-app -f          # follow your app's logs in real time
journalctl -u nginx --since "1 hour ago"   # nginx logs from the last hour
sudo tail -f /var/log/nginx/error.log      # nginx's error log specifically
```

The `-f` flag means "follow" — new log lines appear as they happen, so you can watch what happens as you reproduce a bug.

## Is the app broken, or the proxy?

If a request fails, check **both** layers separately: your app's own logs, and Nginx's logs. Sometimes the app is fine but Nginx can't reach it (a proxy problem); sometimes the app itself is erroring (an app problem). Checking both tells you which.

## Check the basics too

```bash
df -h              # is disk space running out?
free -m             # is memory running low?
systemctl status my-app   # is the service even running?
```

A surprising number of "mysterious" production issues turn out to just be a full disk.

## Never log secrets

> [!WARNING]
> Never let passwords, API keys, or full private data end up in your logs. Logs often get shipped elsewhere or kept around a long time — treat them as something other people might see.

## In one sentence

Debugging starts with logs — follow your app's and your proxy's logs separately while reproducing the issue, check basic resources (disk/memory), and never let secrets end up in a log line.

## Want to go deeper?

Switch to **Expert** mode above for detailed `journalctl` querying and separating proxy errors from app errors.
