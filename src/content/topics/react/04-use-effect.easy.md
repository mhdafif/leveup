---
title: useEffect & Lifecycle
order: 4
estMinutes: 15
difficulty: easy
checklist:
  - Describe what a side effect is and why it needs special handling in React
  - Control when an effect runs using the dependency array correctly
  - Write cleanup functions to prevent memory leaks and stale subscriptions
  - Avoid infinite loops caused by incorrect dependencies
  - Fetch data inside an effect with proper loading and error handling
  - Know when to use a data-fetching library instead of useEffect
---

Most of what a component does is just "turn data into UI." But sometimes it needs to reach *outside* itself — load data from a server, start a timer, set the page title. Those are **side effects**, and `useEffect` is where they go.

## The basic shape

```tsx
import { useEffect } from 'react'

useEffect(() => {
  // do the side effect here (runs after the screen updates)
}, [/* dependencies */])
```

The effect runs *after* React draws the screen. The second argument — the dependency array — controls *when* it runs again.

## The dependency array is the key part

```tsx
// runs once, when the component first appears
useEffect(() => { loadData() }, [])

// runs whenever userId changes (and on first appearance)
useEffect(() => { loadUser(userId) }, [userId])

// no array → runs after EVERY render (usually a mistake)
useEffect(() => { ... })
```

Simple mental model: the array lists "things that, when they change, should re-run this effect." `[]` means "just once at the start."

> [!WARNING]
> Any value from your component that the effect uses should be in the array. Leaving one out causes sneaky "stale value" bugs. There's an ESLint rule (`exhaustive-deps`) that catches this — trust it.

## Clean up after yourself

If your effect *starts* something ongoing — a timer, a subscription — return a function to *stop* it. React runs that cleanup when the component leaves or before the effect re-runs:

```tsx
useEffect(() => {
  const timer = setInterval(tick, 1000)
  return () => clearInterval(timer)  // cleanup
}, [])
```

Without cleanup, timers and subscriptions pile up and cause bugs.

## Loading data (the simple version)

```tsx
useEffect(() => {
  let cancelled = false
  async function load() {
    const data = await fetchUser(userId)
    if (!cancelled) setUser(data)  // ignore if we've moved on
  }
  load()
  return () => { cancelled = true }
}, [userId])
```

The `cancelled` flag avoids a race where an old, slow response overwrites a newer one.

## For real apps, use a library

Fetching by hand in `useEffect` works, but real apps also want caching, retries, and refreshing. Most teams use a library like **TanStack Query** (React Query) instead — even the React docs now recommend this over manual fetching.

> [!TIP]
> If you find yourself writing lots of loading/error/caching logic in `useEffect`, that's your signal to reach for TanStack Query.

## In one sentence

`useEffect(fn, [deps])` runs side effects (data loading, timers, subscriptions) after render — the dependency array controls when it re-runs, return a cleanup function to stop ongoing work, and reach for TanStack Query for real data fetching.

## Want to go deeper?

Switch to **Expert** mode above for the infinite-loop trap, Strict Mode's double-invoke, and race-condition details.
