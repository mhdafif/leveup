---
title: Web Performance
order: 5
estMinutes: 15
difficulty: easy
checklist:
  - Explain the critical rendering path and where bottlenecks occur
  - Identify and eliminate render-blocking resources
  - Implement code splitting and lazy loading at route and component level
  - Apply image optimization techniques (WebP, srcset, loading=lazy)
  - Define a performance budget and enforce it in CI
---

Speed is a feature. People leave slow sites — even a one-second delay measurably loses customers. The good news: most slowness comes from a few common causes, and once you know them, you can fix them instead of guessing.

## Why pages feel slow

Before anyone sees your page, the browser has to download the HTML, the CSS, and often some JavaScript, then draw everything. Two things commonly block that first paint:

- **CSS** must fully load before the browser paints (it needs to know how things look).
- **Synchronous JavaScript** (`<script>` in the head) *pauses* everything until it runs.

So the more stuff crammed into that critical first load, the longer users stare at a blank screen.

## Quick win: don't let scripts block

Add `defer` to scripts so they wait until the page is built instead of freezing it:

```html
<script src="analytics.js" defer></script>  <!-- runs after the page loads -->
```

Use `defer` for scripts that need the page, and `async` for totally independent ones (like analytics).

## Quick win: only ship code that's needed (code splitting)

Don't force users to download the whole app just to see the home page. Load heavy pages/components only when needed:

```ts
const Dashboard = React.lazy(() => import('./pages/Dashboard'))

<Suspense fallback={<Spinner />}>
  <Dashboard />
</Suspense>
```

Now the Dashboard's code only downloads when someone actually visits it.

## Quick win: optimize images

Images are usually the heaviest thing on a page. Three easy habits:

```html
<img src="photo.jpg" width="800" height="450"
     loading="lazy" alt="A description" />
```

- Use modern formats like **WebP** (much smaller than JPEG).
- Add `loading="lazy"` so off-screen images load only when scrolled to (but *not* your big hero image).
- Always set `width` and `height` so the page doesn't jump around as images load.

## Set a budget

Decide on limits — like "less than 200 KB of JavaScript" — and have your build fail if you go over. It stops your site from slowly getting bloated over time.

## In one sentence

Pages feel slow when too much CSS/JS blocks the first paint — so `defer` your scripts, split code so pages load only what they need, optimize images (WebP + lazy load + set dimensions), and enforce a size budget.

## Want to go deeper?

Switch to **Expert** mode above for the critical rendering path, `preload`/`preconnect`, caching headers, and setting up a performance budget in CI.
