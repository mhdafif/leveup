---
title: Analytics and Observability
order: 11
estMinutes: 10
difficulty: easy
checklist:
  - Read traffic and cache analytics
  - Inspect security events
  - Track error rates by path
  - Use logs for incident debugging
  - Separate edge problems from origin problems
---

Cloudflare's analytics dashboard is often the *first* place to look when something's wrong with your site — it shows what happened to requests before they even reached your server.

## The useful signals

- **Request volume** — how much traffic, and any sudden spikes/drops?
- **Cache hit ratio** — how much traffic is served from Cloudflare's cache vs. hitting your real server?
- **Response status codes** — are more requests failing than usual?
- **Security events** — anything blocked by the WAF or rate limiting?

## The debugging question to ask first

> [!TIP]
> When something's broken, ask in order: **Did the request even reach Cloudflare? Did Cloudflare forward it to my server? What did my server actually respond with?** This quickly tells you whether the problem is at the edge (Cloudflare's side) or the origin (your actual server) — and you fix very different things depending on which it is.

## In one sentence

Cloudflare's analytics show traffic, caching, and security events at the edge — check them first when debugging, and separate "did Cloudflare have a problem?" from "did my actual server have a problem?" to find the real cause faster.

## Want to go deeper?

Switch to **Expert** mode above for detailed request logs and reviewing security events.
