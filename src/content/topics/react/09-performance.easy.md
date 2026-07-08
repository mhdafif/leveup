---
title: React Performance
order: 9
estMinutes: 15
difficulty: easy
checklist:
  - Explain when React.memo prevents re-renders and when it doesn't
  - Use useMemo to memoize expensive computed values
  - Use useCallback to stabilize function references passed to memoized children
  - Implement code splitting with React.lazy and Suspense
  - Profile a React app using React DevTools Profiler to find real bottlenecks
---

React is already fast for most apps. So the first rule of performance is: **don't optimize until you've measured a real problem.** But it helps to know the tools React gives you and when they actually matter.

## Why components re-draw

A component re-draws when:

1. Its own **state** changes.
2. Its **parent** re-draws.
3. A **context** it uses changes.

Usually this is totally fine — re-drawing is cheap. The tools below just prevent re-draws that are provably pointless.

## The three optimization tools

- **`React.memo`** wraps a component so it skips re-drawing when its props haven't changed.
- **`useMemo`** remembers the result of an expensive calculation, redoing it only when its inputs change:

```tsx
const filtered = useMemo(
  () => products.filter(p => p.name.includes(query)),
  [products, query]  // only re-filter when these change
)
```

- **`useCallback`** is the same idea but for functions — it keeps a function from being freshly created every render (useful when passing it to a `React.memo` child).

> [!WARNING]
> Don't sprinkle these everywhere! For cheap work (like `count * 2`), `useMemo` costs more than it saves and just clutters the code. Use them only where you've measured a real slowdown.

## Load less up front: code splitting

You can split heavy parts of your app into separate files that load only when needed, so the first page loads faster:

```tsx
import { lazy, Suspense } from 'react'
const Dashboard = lazy(() => import('./Dashboard'))

<Suspense fallback={<Spinner />}>
  <Dashboard />
</Suspense>
```

Now `Dashboard`'s code only downloads when it's actually shown. Doing this per-route (per page) is the biggest, easiest win.

## Find real slowdowns with the Profiler

The **React DevTools** browser extension has a **Profiler** tab. Hit record, use the slow part of your app, stop, and it shows you which components re-drew and how long they took.

> [!IMPORTANT]
> Measure with a **production build**, not dev mode — dev mode adds extra checks that make things look slower than they really are.

## In one sentence

React is fast by default — measure first, then reach for `React.memo`/`useMemo`/`useCallback` only on proven hotspots, and use `React.lazy` + `Suspense` to load heavy pages on demand.

## Want to go deeper?

Switch to **Expert** mode above for exactly when `React.memo` helps, `useCallback` with memoized children, and reading Profiler flame charts.
