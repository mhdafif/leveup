---
title: Serverless Functions
order: 6
estMinutes: 10
difficulty: easy
checklist:
  - Explain serverless execution
  - Understand cold starts
  - Know timeout and memory limits
  - Use functions for event-driven work
  - Avoid hidden coupling to provider limits
---

**Serverless functions** let you run a small piece of code without managing any server at all — you just write a function, and the cloud provider runs it whenever it's needed (a request comes in, a scheduled time hits, an event fires), then shuts it down.

## Great for short, on-demand work

Perfect fits: processing a webhook, resizing an uploaded image, running a scheduled nightly task, handling a lightweight API endpoint. You pay only while the function is actually running — no idle server sitting around costing money.

## The trade-offs

- **Cold starts** — if a function hasn't run in a while, the *first* request after that idle period can be slower while it "wakes up."
- **Time limits** — functions typically can't run forever; there's usually a max execution time (often measured in seconds or a few minutes).
- **No persistent connections** — since the function shuts down between calls, it's not a good fit for things needing a constantly-open connection, like a WebSocket server.

> [!WARNING]
> Long-running jobs or things needing a persistent connection don't fit the serverless model well — those are better run on a regular server or background worker instead.

## In one sentence

Serverless functions run your code on-demand without managing a server — great for short, event-driven tasks (webhooks, scheduled jobs, image processing), but a poor fit for long-running or persistent-connection work.

## Want to go deeper?

Switch to **Expert** mode above for cold-start mitigation and provider-specific limits.
