---
title: Cost, Logs, and Metrics
order: 8
estMinutes: 10
difficulty: easy
checklist:
  - Set a budget alert
  - Track usage by service
  - Centralize logs
  - Monitor key metrics
  - Review cost after architecture changes
---

Cloud bills are usage-based — you pay for what you actually use. That's great when you're small, but a small mistake (an infinite loop hitting an API, forgotten test resources left running) can quietly balloon into a surprisingly large bill if nobody's watching.

## Set a budget alert on day one

> [!TIP]
> Add a budget alert *before* you need it, not after a scary invoice arrives. Most cloud providers let you set a threshold ("alert me if spending crosses $X this month") in a couple of clicks — this is basic production hygiene, not something to leave for later.

## The signals worth watching

Beyond cost itself, a few basic operational signals tell you if things are healthy:

- **Error rate** — are requests failing more than usual?
- **Request volume** — is traffic doing something unexpected?
- **Latency** — are responses getting slower?
- **Storage growth** — is something silently accumulating data (and cost) it shouldn't?

## Keep logs in one place

As you add more services (functions, workers, servers), scattered logs across each become hard to search. Centralizing them (in one dashboard or logging service) means you can actually find what you need when debugging.

## In one sentence

Cloud costs scale with usage, so set a budget alert early, and watch a handful of basic signals (errors, traffic, latency, storage growth) with centralized logs — treating cost monitoring as part of running a healthy production system, not an afterthought.

## Want to go deeper?

Switch to **Expert** mode above for cost optimization strategies and full observability layers (logs, metrics, traces).
