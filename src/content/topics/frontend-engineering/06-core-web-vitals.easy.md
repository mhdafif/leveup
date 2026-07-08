---
title: Core Web Vitals
order: 6
estMinutes: 12
difficulty: easy
checklist:
  - Define LCP, CLS, and INP and what each measures
  - Identify the thresholds for good, needs improvement, and poor ratings
  - Diagnose common causes of LCP, CLS, and INP regressions
  - Measure Core Web Vitals with Lighthouse and the CrUX dataset
  - Apply targeted fixes for each vital
---

**Core Web Vitals** are three scores Google uses to measure how good your page *feels* to real users. They even affect your Google search ranking. Each one captures a different frustration: waiting, jumping, and lagging.

## The three scores

### LCP — how fast the main content shows up

**Largest Contentful Paint** measures how long until the biggest thing on screen (usually the hero image or headline) appears. Basically: "how long until it looks loaded?"

- 🟢 Good: under **2.5 seconds**

Common cause: a big, unoptimized hero image. Fix: compress it, use WebP, and *don't* lazy-load it.

### CLS — does the page jump around?

**Cumulative Layout Shift** measures annoying movement — like when you go to tap a button and an image loads, shoving everything down.

- 🟢 Good: under **0.1**

Common cause: images and ads without reserved space. Fix: always set `width` and `height` on images so the browser holds the spot:

```html
<img src="photo.jpg" width="800" height="450" alt="..." />
```

### INP — does it respond quickly when you tap?

**Interaction to Next Paint** measures the lag between you clicking/tapping and the page reacting. Basically: "does it feel snappy or sluggish?"

- 🟢 Good: under **200 milliseconds**

Common cause: heavy JavaScript hogging the browser. Fix: break big tasks into smaller pieces and defer non-essential scripts.

## How to measure them

- **Lighthouse** (in Chrome DevTools → Lighthouse tab) gives you a quick lab score anytime.
- **PageSpeed Insights** (pagespeed.web.dev) shows both lab scores *and* real-user data from actual Chrome users.

Run one of these on your page and you'll get a clear report card with the three vitals and suggested fixes.

## In one sentence

Core Web Vitals score three feelings — **LCP** (how fast content appears, aim under 2.5s), **CLS** (how much the page jumps, aim under 0.1), and **INP** (how fast it responds to taps, aim under 200ms) — measured easily with Lighthouse or PageSpeed Insights.

## Want to go deeper?

Switch to **Expert** mode above for the full threshold tables, detailed causes and fixes for each vital, and measuring real-user data with the web-vitals library.
