---
title: Serverless Functions
order: 6
estMinutes: 30
difficulty: medium
checklist:
  - Explain serverless execution
  - Understand cold starts
  - Know timeout and memory limits
  - Use functions for event-driven work
  - Avoid hidden coupling to provider limits
---

Serverless functions run code on demand without managing servers directly. They fit webhooks, background jobs, image processing, scheduled tasks, and lightweight APIs.

Tradeoffs include cold starts, execution time limits, runtime restrictions, and provider-specific behavior.

> [!WARNING]
> Long-running jobs and persistent connections may not fit serverless functions well.

## Further Learning

- **"serverless functions cold start"** — startup latency
- **"serverless timeout memory limits"** — platform constraints
- **"event driven architecture serverless"** — usage patterns
