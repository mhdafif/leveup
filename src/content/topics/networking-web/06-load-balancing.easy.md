---
title: Load Balancing
order: 6
estMinutes: 10
difficulty: easy
checklist:
  - Explain why load balancers exist
  - Understand health checks
  - Compare round robin and least connections
  - Know sticky session tradeoffs
  - Avoid single-instance assumptions
---

When one server can't keep up with all your visitors, you run several copies of your app. A **load balancer** stands in front and spreads incoming requests across them — so no single server gets overwhelmed.

```txt
Visitors → Load balancer → app-1 | app-2 | app-3
```

This does two things: handles **more traffic** (more servers = more capacity), and improves **reliability** (if one server dies, the others carry on).

## Health checks

The load balancer regularly pings each server: "still healthy?" If a server stops responding, it quietly stops sending traffic there until it recovers. Users never notice one server went down.

## A trap to avoid: local sessions

Here's a subtle bug. If you store a user's login/session in *one server's memory*, and their next request lands on a *different* server, that server has no idea who they are — they appear logged out.

> [!WARNING]
> Once you have multiple servers, don't keep session data in a single server's memory. Store it somewhere shared (a database or a cache like Redis) so any server can handle any request.

## In one sentence

A load balancer spreads traffic across multiple copies of your app for more capacity and reliability (routing around unhealthy servers) — just remember to store sessions somewhere shared, not in one server's memory.

## Want to go deeper?

Switch to **Expert** mode above for routing strategies (round-robin vs least-connections) and sticky-session trade-offs.
