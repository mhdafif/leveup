---
title: Deployment Basics
order: 11
estMinutes: 35
difficulty: medium
checklist:
  - Build an application artifact for release
  - Configure environment variables per environment
  - Run database migrations safely
  - Check health before routing traffic
  - Roll back when a release is unsafe
  - Understand horizontal scaling basics
---

Deployment turns code into a running service. A good deployment process is repeatable, observable, and reversible. The goal is not just to ship, but to ship without guessing what is running.

## Build and Release

Build once, then promote the same artifact across environments when possible. Environment variables should change between staging and production, not the compiled application code.

```ts
type AppConfig = {
  databaseUrl: string;
  sessionSecret: string;
  port: number;
};

function loadConfig(env: NodeJS.ProcessEnv): AppConfig {
  if (!env.DATABASE_URL || !env.SESSION_SECRET) {
    throw new Error("Missing required configuration");
  }

  return {
    databaseUrl: env.DATABASE_URL,
    sessionSecret: env.SESSION_SECRET,
    port: Number(env.PORT ?? 3000),
  };
}
```

## Migrations and Health Checks

Database migrations need ordering and rollback planning. A backward-compatible deployment often uses two steps: deploy code that supports old and new schema, migrate data, then remove old paths later.

Health checks let load balancers route only to ready instances.

```http
GET /health
200 OK
```

> [!WARNING]
> Do not mark a service healthy before it can connect to critical dependencies such as the database, cache, or message broker.

## Scaling

Horizontal scaling means running more instances of the service. Stateless servers scale more easily because any instance can handle any request.

> [!TIP]
> Practice rollback before an incident. A rollback plan that only exists in someone's memory is not a plan.

## Further Learning

Search these terms to go deeper:
- **"blue green deployment explained"** — reducing release risk
- **"zero downtime database migrations"** — safe schema changes
- **"health checks readiness liveness"** — deployment platform checks
- **"twelve factor app config"** — environment-based application configuration
