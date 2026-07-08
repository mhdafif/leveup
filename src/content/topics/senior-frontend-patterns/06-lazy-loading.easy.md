---
title: Lazy Loading & Code Splitting
order: 6
estMinutes: 12
difficulty: easy
checklist:
  - "Split a route into a dynamically imported chunk using import()"
  - "Implement image lazy loading using the native loading=\"lazy\" attribute"
  - Use IntersectionObserver to lazy-load a below-the-fold component
  - Identify which parts of an app are good candidates for code splitting
  - Measure the impact of lazy loading on initial bundle size
---

Why make someone download your *entire* app just to see the home page? **Lazy loading** means loading things only when they're actually needed — so the first screen appears fast, and heavier stuff loads on demand.

## Code splitting: load pages when visited

Instead of bundling every page into one giant file, split them so each page's code loads only when someone goes there. The magic is the `import()` *function* (note the parentheses):

```ts
// this page's code downloads only when this runs
const settings = await import('./routes/settings')
```

In React, you'd wrap this with `React.lazy`. Your initial download shrinks, and the settings code loads the moment someone opens settings.

## Lazy-load images (one attribute!)

For images below the fold, the browser can wait until you scroll near them — just add one attribute:

```html
<img src="photo.jpg" loading="lazy" alt="..." />
```

> [!TIP]
> Don't lazy-load your big hero image at the top — it's the first thing people see, so you want it to load *immediately*. Lazy-load only things that are off-screen.

## Load components when they scroll into view

For custom components further down the page, you can watch when they're about to appear (using the browser's `IntersectionObserver`) and only build them then. Great for a heavy chart or map that's way down the page.

## What's worth lazy-loading?

Good candidates: other **routes/pages**, **modals and drawers** (hidden until opened), heavy things like **charts, editors, maps**, and **below-the-fold images**. Basically: anything the user doesn't see right away.

## In one sentence

Lazy loading defers non-essential code and media until needed — split pages with `import()`, add `loading="lazy"` to off-screen images (never the hero), and load heavy off-screen components only when they scroll into view.

## Want to go deeper?

Switch to **Expert** mode above for the `IntersectionObserver` pattern, prefetching likely routes, and measuring bundle impact.
