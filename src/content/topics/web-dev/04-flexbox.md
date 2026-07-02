---
title: Flexbox
order: 4
estMinutes: 25
difficulty: easy
checklist:
  - Distinguish flex container properties from flex item properties
  - Explain the difference between the main axis and cross axis
  - Use justify-content and align-items to position items
  - Control wrapping with flex-wrap and understand how it creates new lines
  - Use flex-grow, flex-shrink, and flex-basis to control item sizing
  - Build a centered layout and a navigation bar using only flexbox
---

Flexbox (the Flexible Box Layout module) is a one-dimensional layout system designed for distributing space among items in a row or column, even when their sizes are unknown. It replaced decades of float-based and table-based hacks and remains the most practical tool for component-level layout.

## Container vs Items

Flexbox has two sets of properties: those applied to the **flex container** (the parent with `display: flex`) and those applied to **flex items** (the direct children).

```css
/* Everything on the container */
.container {
  display: flex;            /* activate flexbox */
  flex-direction: row;      /* main axis: row (default) | column | row-reverse | column-reverse */
  flex-wrap: nowrap;        /* wrap: nowrap (default) | wrap | wrap-reverse */
  justify-content: flex-start; /* alignment on main axis */
  align-items: stretch;    /* alignment on cross axis */
  gap: 16px;               /* space between items (preferred over margin) */
}
```

## Main Axis and Cross Axis

The **main axis** runs in the direction of `flex-direction`. The **cross axis** is perpendicular to it.

- `flex-direction: row` → main axis is horizontal (left→right), cross axis is vertical.
- `flex-direction: column` → main axis is vertical (top→bottom), cross axis is horizontal.

`justify-content` aligns items along the **main axis**. `align-items` aligns them along the **cross axis**.

## justify-content Values

| Value | Effect |
|-------|--------|
| `flex-start` | Items at the start of the main axis (default) |
| `flex-end` | Items at the end |
| `center` | Items centered |
| `space-between` | First and last items at edges, equal gaps between |
| `space-around` | Equal space around each item (half-space at edges) |
| `space-evenly` | Equal space between items and edges |

## align-items Values

| Value | Effect |
|-------|--------|
| `stretch` | Items stretch to fill cross axis (default) |
| `flex-start` | Items at cross-axis start |
| `flex-end` | Items at cross-axis end |
| `center` | Items centered on cross axis |
| `baseline` | Items aligned by their text baseline |

## flex-grow, flex-shrink, flex-basis

These three properties control how a flex item sizes itself relative to available space. The shorthand `flex` combines all three:

```css
/* flex: grow shrink basis */
.item { flex: 1 1 0; }     /* grow and shrink equally, start from 0 width */
.item { flex: 1; }         /* shorthand for flex: 1 1 0 */
.item { flex: none; }      /* shorthand for flex: 0 0 auto — rigid, no grow/shrink */
.sidebar { flex: 0 0 240px; }  /* fixed 240px, never grows or shrinks */
.main { flex: 1; }             /* takes all remaining space */
```

- **flex-grow**: how much of the remaining free space the item claims (relative ratio).
- **flex-shrink**: how much the item shrinks when there is not enough space (0 = never shrink).
- **flex-basis**: the item's default size before growth/shrink is applied (`auto` = use the item's content size).

## Common Layout Patterns

```css
/* 1. Perfect centering */
.centered {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* 2. Navigation bar: logo left, links right */
.nav {
  display: flex;
  align-items: center;
  gap: 24px;
}
.nav .logo { margin-right: auto; } /* pushes everything else to the right */

/* 3. Card grid that wraps */
.card-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.card {
  flex: 1 1 280px; /* grow, shrink, minimum width 280px */
}

/* 4. Sidebar + content layout */
.layout {
  display: flex;
  gap: 32px;
}
.sidebar { flex: 0 0 240px; }
.content { flex: 1; }
```

> [!TIP]
> `margin-right: auto` (or `margin-left: auto`) on a flex item is one of the most useful tricks in flexbox — it absorbs all available free space on that side, effectively pushing sibling items to the opposite end. No need for `justify-content: space-between` when you only want to push one item.

> [!NOTE]
> `gap` on a flex container adds space *between* items only, not outside the first or last item. It is the modern replacement for margin-based spacing and is supported in all modern browsers.

> [!WARNING]
> Flexbox is one-dimensional. If you need two-dimensional control (rows *and* columns simultaneously), use CSS Grid instead. Trying to build a full page grid with flexbox leads to fragile, hard-to-maintain code.

## Further Learning

Search these terms to go deeper:
- **"CSS Flexbox visual guide css-tricks"** — the most-bookmarked flexbox cheat sheet on the web
- **"Flexbox Froggy"** — interactive game that teaches all flexbox properties through 24 levels
- **"flex shorthand values MDN"** — the exact meaning of `flex: 1`, `flex: auto`, `flex: none`, and `flex: 0`
- **"align-content vs align-items flexbox"** — the subtle but important difference when wrapping is enabled
- **"intrinsic sizing min-content max-content"** — how flex-basis interacts with content sizing keywords
