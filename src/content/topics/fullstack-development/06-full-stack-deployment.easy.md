---
title: Full-Stack Deployment
order: 6
estMinutes: 12
difficulty: easy
checklist:
  - Build frontend and backend artifacts predictably
  - Configure API origins and allowed domains
  - Run migrations before dependent code paths
  - Verify health checks after release
  - Roll back frontend and backend safely
---

Deploying a full-stack app means coordinating several moving pieces at once — frontend, backend, database changes — and the *order* you deploy them in matters. Get it wrong, and a shiny new frontend can call an API endpoint that doesn't exist yet.

## The safe release order

A dependable sequence:

1. Deploy backend code that still works with the **old** database schema *and* the new one (backward-compatible).
2. Run database migrations.
3. Deploy the frontend that uses the new API.
4. Watch for errors.
5. Clean up any old compatibility code later.

This way, there's never a moment where the frontend expects something the backend can't yet provide.

## Make sure cookies and CORS match your real domains

A login that works perfectly on your laptop can break in production if the cookie/CORS settings don't match your actual deployed domain:

```ts
const allowedOrigins = new Set([
  'https://app.example.com',
  'https://staging.example.com',
])
```

> [!WARNING]
> Avoid allowing "any origin" (`*`) for requests that include cookies/credentials — it weakens your security boundary and often just masks a misconfiguration you should actually fix.

## Verify it's actually healthy

After deploying, check that your health-check endpoint responds correctly before assuming everything's fine. And know your rollback plan *before* you need it — for both the frontend and backend.

## In one sentence

Deploy full-stack changes in a safe order (backward-compatible backend → migrations → frontend), make sure cookie/CORS settings match your real production domains, and verify health checks after every release.

## Want to go deeper?

Switch to **Expert** mode above for zero-downtime migration ordering and rollback strategies for multi-part releases.
