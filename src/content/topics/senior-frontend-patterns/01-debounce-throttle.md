---
title: Debounce & Throttle
order: 1
estMinutes: 25
difficulty: easy
checklist:
  - Implement debounce from scratch using closures and setTimeout
  - Implement throttle using a last-call timestamp
  - Apply debounce to a search input handler
  - Apply throttle to a scroll or resize event listener
  - Explain the trade-off between debounce and throttle for a given use case
---

Browsers can fire input, scroll, pointer, and resize events dozens of times per second. If every event triggers filtering, layout reads, analytics, or network requests, the interface starts dropping frames. Debounce and throttle are small control-flow patterns that reduce noisy event streams without changing the rest of your component architecture.

## Debounce

Debounce waits until activity has paused. A search box is the classic case: users care about the final query after they stop typing, not every intermediate keypress.

```ts
type AnyFn<TArgs extends unknown[]> = (...args: TArgs) => void;

export function debounce<TArgs extends unknown[]>(
  fn: AnyFn<TArgs>,
  delayMs: number,
) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: TArgs) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delayMs);
  };
}

const search = debounce((query: string) => {
  void fetch(`/api/search?q=${encodeURIComponent(query)}`);
}, 300);
```

The closure keeps the current timeout. Each call cancels the old one and schedules a new one, so only the last call survives.

## Throttle

Throttle allows one execution per interval. It is better for scroll and resize work because you want regular updates while the action continues.

```ts
export function throttle<TArgs extends unknown[]>(
  fn: AnyFn<TArgs>,
  intervalMs: number,
) {
  let lastCall = 0;

  return (...args: TArgs) => {
    const now = Date.now();
    if (now - lastCall < intervalMs) return;
    lastCall = now;
    fn(...args);
  };
}

const measureViewport = throttle(() => {
  console.log(window.innerWidth, window.scrollY);
}, 100);

window.addEventListener("resize", measureViewport);
window.addEventListener("scroll", measureViewport, { passive: true });
```

## React Hook Wrapper

Hooks usually debounce values rather than event handlers, which makes effects easier to reason about.

```ts
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
```

> [!TIP]
> If the user needs the last action to always fire, use debounce. If you need consistent interval firing, use throttle.

> [!WARNING]
> Forgetting to cancel the timeout on component unmount causes stale state updates and memory leaks.

## Further Learning

Search these terms to go deeper:
- **"debounce vs throttle JavaScript"** — practical timing diagrams and event examples
- **"requestAnimationFrame scroll handler"** — frame-aligned alternatives for visual updates
- **"React useDebounce hook cleanup"** — hook lifecycle and stale update prevention
- **"passive event listeners scroll performance"** — why scroll handlers should not block scrolling
