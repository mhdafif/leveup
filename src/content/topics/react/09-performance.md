---
title: React Performance
order: 9
estMinutes: 35
difficulty: hard
checklist:
  - Explain when React.memo prevents re-renders and when it doesn't
  - Use useMemo to memoize expensive computed values
  - Use useCallback to stabilize function references passed to memoized children
  - Implement code splitting with React.lazy and Suspense
  - Profile a React app using React DevTools Profiler to find real bottlenecks
---

React is fast by default for most UIs. Performance optimization should be driven by measurement, not assumption. This lesson covers the tools React provides, when they genuinely help, and — equally important — when applying them is premature or actively harmful.

## Why React Re-renders

React re-renders a component when:
1. Its **state** changes
2. Its **parent re-renders** (and props may have changed)
3. A **context value** it reads changes

Most of the time this is fine — renders are cheap. The optimization tools below prevent renders that are provably unnecessary.

## React.memo

`React.memo` wraps a component and skips re-rendering it if its props haven't changed (using shallow comparison).

```tsx
type BadgeProps = { count: number; label: string };

// Without memo: re-renders whenever parent re-renders, even if count and label haven't changed
const Badge = ({ count, label }: BadgeProps) => (
  <span>{label}: {count}</span>
);

// With memo: skips render if count and label are the same references/values
const MemoizedBadge = React.memo(({ count, label }: BadgeProps) => (
  <span>{label}: {count}</span>
));
```

> [!WARNING]
> `React.memo` only helps when the parent re-renders frequently AND the child's props are actually unchanged. If the parent always passes new object or function references, `React.memo` will still re-render every time — you must also stabilize those references with `useMemo` and `useCallback`.

## useMemo

`useMemo` memoizes the result of an expensive computation, recalculating only when its dependencies change.

```tsx
function ProductList({ products, filterText }: { products: Product[]; filterText: string }) {
  // Without useMemo: filters on every render
  const filtered = products.filter(p => p.name.includes(filterText));

  // With useMemo: only re-filters when products or filterText changes
  const filteredMemo = useMemo(
    () => products.filter(p => p.name.includes(filterText)),
    [products, filterText]
  );
}
```

**When to use:** filtering/sorting large arrays, expensive mathematical computations, creating stable object references for memoized children or context values.

**When not to use:** for cheap operations (string concatenation, simple arithmetic), or as a default for all computed values. The memoization itself has a cost.

## useCallback

`useCallback` memoizes a function reference, returning the same function object between renders unless dependencies change.

```tsx
function Parent() {
  const [count, setCount] = useState(0);

  // Without useCallback: new function reference every render → MemoizedChild always re-renders
  const handleClick = () => console.log("clicked");

  // With useCallback: stable reference → MemoizedChild skips re-render when count changes
  const stableHandleClick = useCallback(() => console.log("clicked"), []);

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <MemoizedChild onClick={stableHandleClick} />
    </>
  );
}
```

> [!NOTE]
> `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`. Use `useCallback` for functions, `useMemo` for values — they're the same mechanism with different ergonomics.

## The Premature Optimization Trap

```tsx
// Unnecessary: the computation is trivial
const doubled = useMemo(() => count * 2, [count]);

// Unnecessary: nothing reads this reference for memoization purposes
const handleChange = useCallback((e) => setName(e.target.value), []);
```

Adding `useMemo` and `useCallback` everywhere:
- **Clutters the code** with dependency arrays that must be maintained
- **Costs memory** for the cached values and dependency comparisons
- **Can hide real performance problems** by masking them instead of fixing root causes

Profile first. Optimize second.

## Code Splitting with React.lazy and Suspense

Splitting your bundle into chunks loaded on demand reduces initial page load time.

```tsx
import { lazy, Suspense } from "react";

// The component and its dependencies are in a separate chunk
const HeavyDashboard = lazy(() => import("./HeavyDashboard"));

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <>
      <button onClick={() => setShowDashboard(true)}>Open Dashboard</button>
      {showDashboard && (
        <Suspense fallback={<div>Loading dashboard...</div>}>
          <HeavyDashboard />
        </Suspense>
      )}
    </>
  );
}
```

`React.lazy` works with dynamic `import()`. The `Suspense` boundary catches the loading state while the chunk downloads and renders the `fallback` in its place.

> [!TIP]
> Route-level code splitting is the highest-leverage application of `React.lazy`. Splitting at the route boundary means users only download code for the pages they actually visit.

## Profiling with React DevTools

The React DevTools browser extension includes a **Profiler** tab that records renders and shows:
- Which components rendered and why ("why did this render?")
- How long each render took
- The render count for each component during a recording

**Workflow:**
1. Open DevTools → Profiler tab
2. Click "Record"
3. Interact with the slow part of your app
4. Stop recording
5. Inspect the flame chart — look for components that render unexpectedly often or take >16ms

> [!IMPORTANT]
> Always profile in **production build** mode (`npm run build`). Development mode includes extra checks that artificially inflate render times. A component that seems slow in development may be fast in production.

## Further Learning

Search these terms to go deeper:
- **"Josh W. Comeau understanding useMemo and useCallback"** — the most thorough explanation of when these hooks genuinely help
- **"React DevTools Profiler tutorial"** — how to read flame charts and identify real bottlenecks
- **"React.lazy Suspense code splitting react.dev"** — official guide with router integration examples
- **"Mark Erikson React rendering behavior"** — deep dive into exactly when and why React renders
- **"Million.js block virtual DOM"** — an alternative reconciliation approach for extreme performance cases
