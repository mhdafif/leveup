---
title: Full-Stack Deployment
order: 6
estMinutes: 35
difficulty: medium
checklist:
  - Build frontend and backend artifacts predictably
  - Configure API origins and allowed domains
  - Run migrations before dependent code paths
  - Verify health checks after release
  - Roll back frontend and backend safely
---

Full-stack deployment coordinates static assets, server code, databases, environment variables, and sometimes background workers. A release can fail even when each piece builds alone if the pieces are deployed in the wrong order.

## Release Order

A common safe sequence is:

1. Deploy backward-compatible backend code.
2. Run database migrations.
3. Deploy frontend that uses the new API.
4. Monitor errors and latency.
5. Remove old compatibility code later.

This avoids deploying a frontend that calls endpoints production does not understand yet.

## Cross-Origin Configuration

```ts
const allowedOrigins = new Set([
  "https://app.example.com",
  "https://staging.example.com",
]);

function isAllowedOrigin(origin: string | null) {
  return origin !== null && allowedOrigins.has(origin);
}
```

Cookies, CORS, and redirects must match the deployed domains. A login flow that works locally can fail in production if cookie domain, `SameSite`, `Secure`, or CORS headers are wrong.

> [!WARNING]
> Avoid wildcard CORS with credentials. It weakens the browser boundary and often masks incorrect environment configuration.

## Further Learning

Search these terms to go deeper:
- **"backward compatible API deployment"** — ordering frontend and backend releases
- **"CORS credentials cookies production"** — browser security configuration
- **"database migration deploy order"** — schema changes without downtime
- **"frontend backend rollback strategy"** — reversing multi-part releases
