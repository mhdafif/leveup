---
title: Health Checks
order: 7
estMinutes: 10
difficulty: easy
checklist:
  - Add a lightweight health endpoint
  - Separate liveness from readiness
  - Avoid expensive health checks
  - Use health checks in deploys
  - Alert on user-visible failure
---

A **health check** is a simple endpoint your server exposes that answers "are you okay?" Your hosting platform pings this regularly to decide whether to keep sending real traffic your way.

```ts
app.get('/health', (_req, res) => {
  res.json({ ok: true })
})
```

## Two slightly different questions

- **Liveness** — "is the process even running?" (should I restart it?)
- **Readiness** — "can it actually handle a real request right now?" (should I send it traffic?)

A server can be *alive* (the process hasn't crashed) but not *ready* (its database connection isn't set up yet). Both matter for different reasons.

## Get the check itself right

> [!WARNING]
> A health check that *always* says "ok" is useless — it hides real problems, like a broken database connection. But a health check that does *too much* work (running expensive queries) can slow things down or create false alarms. Keep it lightweight but meaningful — check the things that would actually stop your app from working.

## In one sentence

A health check tells your hosting platform whether an instance should get traffic — keep it lightweight, but meaningful enough to actually catch broken dependencies (not just "yes, the process exists").

## Want to go deeper?

Switch to **Expert** mode above for liveness vs readiness probes in platforms like Kubernetes.
