---
title: Load Balancing
order: 2
estMinutes: 20
difficulty: medium
checklist:
  - Understand the role of a load balancer
  - Compare round-robin and least-connections
  - Know what a health check does
---

A **load balancer** sits in front of several identical servers and spreads
incoming requests across them. It's how you scale **horizontally** — add more
machines instead of buying a bigger one.

```mermaid
flowchart LR
  C[Client] --> LB[Load Balancer]
  LB --> S1[Server 1]
  LB --> S2[Server 2]
  LB --> S3[Server 3]
```

## Common strategies

- **Round-robin** — hand each new request to the next server in turn.
- **Least-connections** — send to whichever server is currently least busy.

> [!TIP]
> A load balancer runs **health checks** and quietly stops routing to any server
> that fails them, so one dead machine doesn't take down your service.
