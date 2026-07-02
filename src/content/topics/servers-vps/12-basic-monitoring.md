---
title: Basic Monitoring
order: 12
estMinutes: 30
difficulty: medium
checklist:
  - Track uptime
  - Track CPU, memory, disk, and errors
  - Create alerts for user-visible failure
  - Watch certificate expiry
  - Review monitoring after incidents
---

Monitoring turns invisible server failure into visible signals. Start with simple checks: is the app reachable, is disk filling up, are error rates rising, and will certificates expire soon?

Useful checks:

- HTTP uptime check
- Disk usage
- Memory pressure
- Service status
- TLS certificate expiry
- 5xx response rate

> [!TIP]
> Alerts should be actionable. If nobody knows what to do when an alert fires, improve the runbook or remove the alert.

## Further Learning

- **"uptime monitoring HTTP check"** — external availability checks
- **"Linux disk usage alert"** — resource monitoring
- **"TLS certificate expiry monitoring"** — avoiding avoidable outages
