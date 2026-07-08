---
title: Regions and Availability
order: 1
estMinutes: 10
difficulty: easy
checklist:
  - Explain regions
  - Explain availability zones
  - Choose a region near users
  - Understand multi-region tradeoffs
  - Know latency and compliance concerns
---

Cloud providers (AWS, Google Cloud, etc.) run their data centers in different physical locations around the world, called **regions**. Choosing where your app "lives" affects how fast it feels to your users.

## Picking a region

Choose a region **close to your users** — the physical distance between your server and someone's browser directly affects how fast requests feel. If most of your users are in Southeast Asia, hosting your app in the US adds real, noticeable delay to every request.

## Inside a region: availability zones

A region is usually split into several **availability zones** — separate physical locations within that region, each with independent power and networking. This means if one zone has an outage, the others usually keep running.

## Do you need more than one region?

> [!TIP]
> Start with just **one region** unless you have a clear reason not to (like users spread globally, or strict legal requirements about where data is stored). Running in multiple regions adds real operational complexity — only take it on when you actually need it.

## In one sentence

A region is a physical location your cloud provider offers — pick one close to your users for speed, and stick to a single region until you have a clear reason (global users, compliance) to spread across more.

## Want to go deeper?

Switch to **Expert** mode above for multi-region trade-offs and data residency/compliance concerns.
