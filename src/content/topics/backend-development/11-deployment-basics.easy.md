---
title: Deployment Basics
order: 11
estMinutes: 12
difficulty: easy
checklist:
  - Build an application artifact for release
  - Configure environment variables per environment
  - Run database migrations safely
  - Check health before routing traffic
  - Roll back when a release is unsafe
  - Understand horizontal scaling basics
---

**Deployment** is the process of turning your code into a live, running service. A good deployment is repeatable (do it the same way every time), observable (you can tell if it worked), and reversible (you can undo it if something's wrong).

## Same build, different settings

Build your app **once**, then use the same build for staging and production — only the *settings* (environment variables) should differ, not the actual code:

```ts
function loadConfig(env) {
  if (!env.DATABASE_URL) throw new Error('Missing required config')
  return { databaseUrl: env.DATABASE_URL, port: Number(env.PORT ?? 3000) }
}
```

This way you know staging and production are running the *exact same code* — just pointed at different databases/settings.

## Health checks: don't send traffic to a broken instance

A **health check** is a simple endpoint (`GET /health`) that says "I'm ready." Your hosting platform checks this before sending real users your way.

> [!WARNING]
> Don't mark your service "healthy" until it can actually reach its database and other critical dependencies. A server that responds "ok" but can't talk to its database will just fail every real request.

## Have a way back out

Before you deploy, know how you'd **undo** it if something breaks. A rollback plan that only exists in someone's head isn't really a plan.

> [!TIP]
> Practice your rollback process *before* you need it in a real emergency.

## Scaling: run more copies

**Horizontal scaling** means running more copies of your server to handle more traffic (instead of buying one giant machine). This works best when your server doesn't keep important state in memory — any copy should be able to handle any request.

## In one sentence

Deployment should be repeatable (same build everywhere, config via environment variables), safe (health checks before routing traffic, migrations planned), and reversible (a real rollback plan) — and scaling means running more stateless copies of your server.

## Want to go deeper?

Switch to **Expert** mode above for blue-green deployments and zero-downtime migration strategies.
