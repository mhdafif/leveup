---
title: Basic Monitoring
order: 12
estMinutes: 10
difficulty: easy
checklist:
  - Track uptime
  - Track CPU, memory, disk, and errors
  - Create alerts for user-visible failure
  - Watch certificate expiry
  - Review monitoring after incidents
---

Without monitoring, a broken server just fails silently until a user complains. **Monitoring** turns invisible problems into visible signals, so *you* find out before your users do.

## The basics worth watching

- **Uptime** — is the site reachable at all?
- **Disk usage** — is it about to run out of space?
- **Memory** — is it under pressure?
- **Error rate** — are requests suddenly failing more than usual?
- **TLS certificate expiry** — is HTTPS about to break?

Most of these can be checked with a simple external service that pings your site every few minutes, plus basic server metrics.

## Make alerts actually useful

> [!TIP]
> An alert is only good if someone knows what to *do* when it fires. If an alert goes off and nobody has a clear next step, either write down the response steps (a "runbook") or remove the alert — a noisy, useless alert just gets ignored, which defeats the whole purpose.

## In one sentence

Monitoring watches the basics (uptime, disk, memory, error rate, certificate expiry) so problems surface as clear alerts before users notice — and every alert should come with a known next step, or it's just noise.

## Want to go deeper?

Switch to **Expert** mode above for setting up specific checks and reviewing monitoring after an incident.
