---
title: Core Web Vitals
order: 6
estMinutes: 30
difficulty: medium
checklist:
  - Define LCP, CLS, and INP and what each measures
  - Identify the thresholds for good, needs improvement, and poor ratings
  - Diagnose common causes of LCP, CLS, and INP regressions
  - Measure Core Web Vitals with Lighthouse and the CrUX dataset
  - Apply targeted fixes for each vital
---

Core Web Vitals are Google's standardized metrics for measuring real-world user experience. They are included in Google's search ranking algorithm and are the closest thing the industry has to an official definition of "fast." Unlike synthetic benchmarks, they measure what the user actually experiences during a page load and interaction.

## The Three Vitals

### Largest Contentful Paint (LCP)

LCP measures how long it takes for the largest image or text block in the viewport to render. It approximates how quickly the page feels "loaded" to the user.

| Rating | Threshold |
|---|---|
| Good | ≤ 2.5 s |
| Needs improvement | 2.5 – 4.0 s |
| Poor | > 4.0 s |

**Common causes of poor LCP:**
- Slow server response time (TTFB > 600 ms)
- Render-blocking CSS or JavaScript delaying the LCP element
- LCP image is not preloaded and discovered late in the HTML
- LCP image is not sized or compressed correctly

**Fixes:**
- Preload the LCP image with `<link rel="preload" as="image">`
- Never lazy-load the LCP image (`loading="lazy"` on the hero)
- Serve images in WebP/AVIF from a CDN with long cache TTL
- Use server-side rendering or SSG to reduce TTFB

### Cumulative Layout Shift (CLS)

CLS measures unexpected visual movement. Every time an element shifts its position unexpectedly, the shift contributes to the CLS score (impact fraction × distance fraction).

| Rating | Threshold |
|---|---|
| Good | ≤ 0.1 |
| Needs improvement | 0.1 – 0.25 |
| Poor | > 0.25 |

**Common causes:**
- Images without `width` and `height` attributes (browser cannot reserve space)
- Ads, embeds, or iframes injected without reserved dimensions
- Web fonts causing FOUT (Flash of Unstyled Text) that reflows layout
- Dynamically injected banners above existing content

**Fixes:**
```html
<!-- Always set width and height so the browser reserves space -->
<img src="photo.jpg" width="800" height="450" alt="...">
```

```css
/* Reserve space for dynamic content with aspect-ratio */
.ad-slot { width: 300px; aspect-ratio: 300 / 250; }
```

> [!TIP]
> Use `font-display: optional` to avoid FOUT entirely by falling back to the system font if the web font is not cached. For most text, the difference is imperceptible.

### Interaction to Next Paint (INP)

INP replaced FID (First Input Delay) in March 2024. It measures the latency of all interactions (clicks, taps, keyboard input) across the full page lifetime and reports the worst one (with some outlier trimming). It includes processing time and rendering delay — not just input latency.

| Rating | Threshold |
|---|---|
| Good | ≤ 200 ms |
| Needs improvement | 200 – 500 ms |
| Poor | > 500 ms |

**Common causes:**
- Long JavaScript tasks blocking the main thread
- Expensive event handlers (synchronous DOM reads + writes causing forced reflow)
- Hydration spikes in React/Vue SSR applications
- Third-party scripts (analytics, tag managers) hogging the main thread

**Fixes:**
- Break up long tasks with `scheduler.yield()` or `setTimeout(..., 0)`
- Defer non-critical third-party scripts until after `load`
- Move expensive computation to a Web Worker
- Use `startTransition` in React to mark non-urgent state updates

> [!WARNING]
> INP is measured from field data (real users), not synthetic runs. A page can pass Lighthouse's lab test but fail INP in the field because Lighthouse doesn't simulate slow interactions over a full browsing session.

## Measuring Core Web Vitals

### Lighthouse (Lab Data)

Run in Chrome DevTools → Lighthouse tab, or via the CLI (`npx lighthouse <url>`). Lab data is reproducible and great for CI, but it simulates a single mid-tier device and cannot capture INP.

### CrUX (Field Data)

The Chrome User Experience Report (CrUX) aggregates real user measurements from Chrome browsers. Access it via:

- **PageSpeed Insights** (pagespeed.web.dev) — combines Lab (Lighthouse) and Field (CrUX) data
- **Google Search Console** → Core Web Vitals report — shows pass/fail breakdown for your entire site
- **CrUX Dashboard** — BigQuery export for custom analysis

> [!NOTE]
> Field data lags by 28 days and requires enough traffic to be collected. For new pages or low-traffic sites, you will only have lab data.

### web-vitals JavaScript Library

Collect field data from your own users and send it to your analytics:

```ts
import { onLCP, onCLS, onINP } from "web-vitals";

onLCP(({ value, rating }) => {
  analytics.track("core_web_vital", { metric: "LCP", value, rating });
});
```

## Further Learning

Search these terms to go deeper:
- **"web.dev vitals"** — the canonical explainer for each metric from the Chrome team
- **"CrUX dashboard Google Data Studio"** — how to explore field data for your site over time
- **"INP optimization guide web.dev"** — deep dive into interaction latency and main-thread scheduling
- **"Lighthouse CI GitHub Actions"** — enforcing performance budgets on every pull request
- **"web-vitals npm library"** — how to measure and report field data from real users
