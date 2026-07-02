---
title: Health Checks
order: 7
estMinutes: 25
difficulty: easy
checklist:
  - Add a lightweight health endpoint
  - Separate liveness from readiness
  - Avoid expensive health checks
  - Use health checks in deploys
  - Alert on user-visible failure
---

Health checks tell infrastructure whether an app should receive traffic. A liveness check says the process is alive. A readiness check says the app can serve requests.

```ts
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});
```

> [!WARNING]
> A health check that always returns OK can hide broken dependencies. A health check that checks too much can create false outages.

## Further Learning

- **"liveness readiness health checks"** — health check types
- **"Kubernetes readiness probe"** — common model
- **"HTTP health endpoint design"** — practical endpoint design
