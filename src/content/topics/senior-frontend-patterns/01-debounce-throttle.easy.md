---
title: Debounce & Throttle
order: 1
estMinutes: 15
difficulty: easy
checklist:
  - Implement debounce from scratch using closures and setTimeout
  - Implement throttle using a last-call timestamp
  - Apply debounce to a search input handler
  - Apply throttle to a scroll or resize event listener
  - Explain the trade-off between debounce and throttle for a given use case
---

Some events fire like crazy — typing, scrolling, resizing can trigger dozens of times a second. If you run expensive work (like an API call) on *every* one, your app stutters. **Debounce** and **throttle** are two ways to calm that flood.

## Debounce: "wait until they stop"

Debounce waits for a pause before running. Perfect for a search box — you don't want to search on every keystroke, just once the user stops typing:

```ts
function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)              // cancel the previous wait
    timer = setTimeout(() => fn(...args), delay)  // restart the wait
  }
}

const search = debounce(query => fetch('/api/search?q=' + query), 300)
```

Each keystroke resets the timer, so the search only fires 300ms after the *last* one. One call instead of twenty.

## Throttle: "at most once every X"

Throttle lets the work run at a steady pace — at most once per interval. Perfect for scroll or resize, where you want *regular* updates while it's happening:

```ts
function throttle(fn, interval) {
  let last = 0
  return (...args) => {
    const now = Date.now()
    if (now - last < interval) return   // too soon, skip
    last = now
    fn(...args)
  }
}
```

## Which one?

- **Debounce** = "only care about the *final* result" → search boxes, autosave.
- **Throttle** = "want steady updates *during* the action" → scroll position, resize.

> [!TIP]
> In React, you'll often debounce a *value* with a `useDebounce` hook rather than the handler — it makes effects easier to reason about. And always clean up the timer when the component unmounts.

## In one sentence

Debounce waits until activity stops before running (great for search), while throttle runs at most once per interval (great for scroll/resize) — both tame events that fire too often.

## Want to go deeper?

Switch to **Expert** mode above for the `useDebounce` React hook, `requestAnimationFrame` alternatives, and cleanup details.
