---
title: useEffect & Lifecycle
order: 4
estMinutes: 30
difficulty: medium
checklist:
  - Describe what a side effect is and why it needs special handling in React
  - Control when an effect runs using the dependency array correctly
  - Write cleanup functions to prevent memory leaks and stale subscriptions
  - Avoid infinite loops caused by incorrect dependencies
  - Fetch data inside an effect with proper loading and error handling
  - Know when to use a data-fetching library instead of useEffect
---

`useEffect` is how function components synchronize with the outside world — APIs, timers, subscriptions, DOM manipulations, analytics. If something your component does isn't about computing UI from state and props, it's probably a side effect and belongs in a `useEffect`.

## The Basic Shape

```tsx
import { useEffect } from "react";

useEffect(() => {
  // side effect code runs after render

  return () => {
    // cleanup code runs before the next effect or on unmount
  };
}, [/* dependency array */]);
```

React runs the effect **after** the browser has painted the updated UI. The optional cleanup function runs before the next execution of the effect and when the component unmounts.

## The Dependency Array

The second argument controls when the effect re-runs:

```tsx
// Runs after every render — usually wrong
useEffect(() => { document.title = "Hello"; });

// Runs once, on mount only
useEffect(() => { fetchInitialData(); }, []);

// Runs when `userId` changes (and on mount)
useEffect(() => { fetchUser(userId); }, [userId]);
```

> [!WARNING]
> **Every reactive value used inside the effect must be listed in the dependency array.** Omitting a dependency is a bug — the effect captures a stale closure. The `eslint-plugin-react-hooks` `exhaustive-deps` rule enforces this automatically. Enable it and listen to it.

## Cleanup Functions

Without cleanup, subscriptions and timers accumulate across re-renders and component remounts.

```tsx
function LiveFeed({ channelId }: { channelId: string }) {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const subscription = subscribe(channelId, (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      subscription.unsubscribe(); // Runs when channelId changes or component unmounts
    };
  }, [channelId]);

  return <ul>{messages.map((m, i) => <li key={i}>{m}</li>)}</ul>;
}
```

Without the cleanup, old subscriptions for previous `channelId` values keep firing and calling `setMessages` on an unmounted component.

## Fetching Data in Effects

A minimal data-fetch pattern inside `useEffect`:

```tsx
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const data = await fetchUser(userId);
        if (!cancelled) setUser(data);
      } catch (err) {
        if (!cancelled) setError(err as Error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; }; // Prevent state updates after unmount/re-run
  }, [userId]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return <div>{user?.name}</div>;
}
```

The `cancelled` flag prevents a "race condition" where a fast response for a new `userId` arrives after a slow response for an old one, setting stale data.

> [!NOTE]
> React 18 in Strict Mode intentionally mounts components twice in development to expose missing cleanup functions. If your effect runs twice and breaks, the effect needs a cleanup function — not a workaround to prevent the double-run.

## The Infinite Loop Trap

```tsx
// Bug: creates a new object reference on every render
function InfiniteLoop() {
  const [data, setData] = useState([]);
  const options = { limit: 10 }; // New object reference every render

  useEffect(() => {
    fetch("/api/items", options).then(r => r.json()).then(setData);
  }, [options]); // options changes every render → effect fires → re-render → repeat
}
```

The fix: move the object inside the effect, memoize it with `useMemo`, or use primitive values as dependencies.

## When to Use a Library Instead

`useEffect` for data fetching handles the happy path, but production requirements — caching, deduplication, background refetching, optimistic updates, pagination — demand much more code. Prefer:

- **TanStack Query** (React Query) for server state
- **SWR** for simpler caching needs
- **React Router's loader API** for route-level data

> [!TIP]
> The React team's own guidance (react.dev) now recommends against fetching in `useEffect` for production apps. Use a data-fetching library or a framework with built-in data loading.

## Further Learning

Search these terms to go deeper:
- **"You might not need an effect react.dev"** — the definitive guide to avoiding overuse of useEffect
- **"Kent C. Dodds useEffect guide"** — thorough walkthrough of dependency arrays and cleanup
- **"race condition React useEffect fetch"** — understanding and fixing stale response bugs
- **"TanStack Query getting started"** — the library most teams use instead of manual fetch effects
- **"React 18 strict mode double invoke effects"** — why double invocation exists and what it reveals
