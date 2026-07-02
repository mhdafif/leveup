---
title: Lazy Loading & Code Splitting
order: 6
estMinutes: 30
difficulty: medium
checklist:
  - "Split a route into a dynamically imported chunk using import()"
  - "Implement image lazy loading using the native loading=\"lazy\" attribute"
  - Use IntersectionObserver to lazy-load a below-the-fold component
  - Identify which parts of an app are good candidates for code splitting
  - Measure the impact of lazy loading on initial bundle size
---

Lazy loading moves non-essential work out of the first page load. The goal is not to hide slow code; it is to avoid downloading, parsing, and executing code or media before the user can benefit from it. Good candidates are routes, modals, drawers, charts, editors, maps, and below-the-fold media.

## Dynamic Imports

Bundlers split dynamic imports into separate chunks. The initial bundle gets smaller, and the chunk loads only when the route or feature is needed.

```ts
type RouteModule = {
  render: () => void;
};

export async function loadSettingsRoute(): Promise<RouteModule> {
  const module = await import("./routes/settings");
  return module;
}
```

React wraps this with `React.lazy`. In Svelte islands, you usually keep the island focused and dynamically import heavy helpers or data visualizations inside the component when a user action requires them.

## Native Media Lazy Loading

Images and iframes support browser-native lazy loading. In TypeScript-heavy codebases, you can still centralize attributes through a typed helper.

```ts
type LazyImageAttrs = {
  src: string;
  alt: string;
  loading: "lazy";
  decoding: "async";
};

export function lazyImage(src: string, alt: string): LazyImageAttrs {
  return { src, alt, loading: "lazy", decoding: "async" };
}
```

Do not lazy-load the largest above-the-fold image because it usually affects Largest Contentful Paint.

## IntersectionObserver Pattern

For custom components, place a sentinel near the content and mount the expensive component after it intersects.

```ts
export function observeOnce(
  element: Element,
  onVisible: () => void,
  rootMargin = "200px",
) {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return;
    onVisible();
    observer.disconnect();
  }, { rootMargin });

  observer.observe(element);
  return () => observer.disconnect();
}
```

Prefetch hints are useful when intent is likely. For example, prefetch a settings route after the user opens the account menu, not on every page load.

> [!TIP]
> Lazy-load components that are off-screen or behind a user action (modal, drawer, tab). Don't lazy-load things the user sees immediately — that adds a waterfall.

## Further Learning

Search these terms to go deeper:
- **"dynamic import code splitting Vite"** — how chunks are created by modern bundlers
- **"IntersectionObserver lazy loading component"** — viewport-triggered rendering patterns
- **"native image loading lazy LCP"** — when lazy loading helps or harms metrics
- **"link rel prefetch route chunks"** — warming likely future navigation
