---
title: Load Balancing
order: 6
estMinutes: 30
difficulty: medium
checklist:
  - Explain why load balancers exist
  - Understand health checks
  - Compare round robin and least connections
  - Know sticky session tradeoffs
  - Avoid single-instance assumptions
---

Load balancers distribute traffic across multiple backend instances. They improve capacity and availability when paired with healthy app design.

```txt
Client -> Load balancer -> app-1 | app-2 | app-3
```

Health checks decide whether an instance should receive traffic. A bad health check can either hide broken apps or remove healthy ones.

> [!WARNING]
> Local memory sessions break when traffic can reach multiple app instances. Store shared session state externally.

## Further Learning

- **"load balancer health checks"** — availability routing
- **"sticky sessions tradeoffs"** — session affinity
- **"horizontal scaling web apps"** — multiple instances
