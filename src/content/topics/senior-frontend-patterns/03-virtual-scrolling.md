---
title: Virtual Scrolling
order: 3
estMinutes: 35
difficulty: hard
checklist:
  - Explain why rendering 10,000 DOM nodes degrades performance
  - Implement a fixed-height virtual list that renders only visible rows
  - Calculate the visible window using scrollTop, containerHeight, and itemHeight
  - Apply overscan rows to prevent flicker during fast scrolling
  - Evaluate when to use native content-visibility auto instead
---

Large lists fail in boring ways: 50000 rows create expensive layout, style, paint, memory, and accessibility-tree work before the user sees the first screen. Virtual scrolling keeps the scroll height real while rendering only the rows near the viewport.

## Fixed Height Windowing

The simplest virtual list assumes every row has the same height. From there, the math is deterministic: divide `scrollTop` by `itemHeight`, calculate how many rows fit in the container, then render that slice.

```ts
type WindowRange = {
  startIndex: number;
  endIndex: number;
  offsetTop: number;
  totalHeight: number;
};

export function getVirtualRange(
  itemCount: number,
  itemHeight: number,
  containerHeight: number,
  scrollTop: number,
  overscan = 4,
): WindowRange {
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, visibleStart - overscan);
  const endIndex = Math.min(itemCount, visibleStart + visibleCount + overscan);

  return {
    startIndex,
    endIndex,
    offsetTop: startIndex * itemHeight,
    totalHeight: itemCount * itemHeight,
  };
}
```

The outer container scrolls normally. Inside it, a spacer establishes total height, and the visible rows are translated down by `offsetTop`.

## Rendering Shape

```ts
type Item = { id: string; label: string };

export function getVisibleItems(items: Item[], range: WindowRange) {
  return items.slice(range.startIndex, range.endIndex).map((item, offset) => ({
    item,
    absoluteIndex: range.startIndex + offset,
  }));
}
```

Overscan renders a few extra rows above and below the viewport. Without it, fast scrolling can reveal blank gaps because the browser paints before your next state update lands.

## Native Shortcut

CSS `content-visibility: auto` lets the browser skip rendering off-screen content while keeping layout simpler. It is excellent for long article pages, feeds with predictable independent sections, and static content. It is less useful when you need precise keyboard navigation, dynamic row measurement, sticky subheaders, or full control over how many elements exist in the DOM.

> [!TIP]
> Start with content-visibility: auto — it handles most cases without JavaScript. Only reach for JS virtualization when you need heterogeneous row heights or need full control.

## Further Learning

Search these terms to go deeper:
- **"virtual scrolling fixed height algorithm"** — row window calculations and spacer layout
- **"react window virtualization"** — production implementation patterns
- **"CSS content-visibility auto"** — native off-screen rendering optimization
- **"virtualized list accessibility"** — keyboard and screen reader constraints in windowed lists
