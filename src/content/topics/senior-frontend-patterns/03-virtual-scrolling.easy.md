---
title: Virtual Scrolling
order: 3
estMinutes: 15
difficulty: easy
checklist:
  - Explain why rendering 10,000 DOM nodes degrades performance
  - Implement a fixed-height virtual list that renders only visible rows
  - Calculate the visible window using scrollTop, containerHeight, and itemHeight
  - Apply overscan rows to prevent flicker during fast scrolling
  - Evaluate when to use native content-visibility auto instead
---

Say you need to show a list of 50,000 items. If you put all 50,000 on the page at once, the browser chokes — that's a *lot* of elements to build and keep in memory. **Virtual scrolling** is the trick: only actually render the handful of rows the user can currently see.

## The core idea

The user *thinks* they're scrolling through 50,000 rows, but at any moment maybe 20 fit on screen. So why render the other 49,980? Virtual scrolling:

1. Makes the scrollbar the *correct* height (as if all rows existed).
2. Only renders the ~20 rows currently visible.
3. As you scroll, it swaps in the rows you're now looking at.

It's like a movie set — only the room the camera's pointing at is actually built.

## The simple math

If every row is the same height, figuring out which rows to show is just arithmetic:

```ts
// how far you've scrolled ÷ row height = first visible row
const firstVisible = Math.floor(scrollTop / rowHeight)
// how many rows fit in the visible area
const visibleCount = Math.ceil(containerHeight / rowHeight)
```

Render that slice, and push it down by the right amount so it lines up with the scrollbar.

> [!TIP]
> Render a few *extra* rows just above and below the visible area ("overscan"). Otherwise, fast scrolling can flash blank gaps before the new rows appear.

## The easy modern option

Before reaching for full virtual scrolling, try the CSS property **`content-visibility: auto`**. It tells the browser to skip rendering off-screen content automatically — no JavaScript needed. It handles long articles and simple feeds beautifully.

> [!NOTE]
> Start with `content-visibility: auto`. Only build a JavaScript virtual list when you need fine control — like rows of different heights or precise keyboard navigation.

## In one sentence

Virtual scrolling renders only the rows currently on screen (while faking the full scrollbar height) so huge lists stay fast — but try CSS `content-visibility: auto` first, since it does this automatically for many cases.

## Want to go deeper?

Switch to **Expert** mode above for the full windowing calculation, overscan, and the react-window library.
