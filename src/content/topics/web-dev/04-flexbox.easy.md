---
title: Flexbox
order: 4
estMinutes: 15
difficulty: easy
checklist:
  - Distinguish flex container properties from flex item properties
  - Explain the difference between the main axis and cross axis
  - Use justify-content and align-items to position items
  - Control wrapping with flex-wrap and understand how it creates new lines
  - Use flex-grow, flex-shrink, and flex-basis to control item sizing
  - Build a centered layout and a navigation bar using only flexbox
---

Imagine arranging books on a shelf. You can push them all to the left, spread them out evenly, or center them. You decide the rules for the *shelf*, and the books follow. **Flexbox** is exactly that: you set a few rules on a container, and its children line up automatically — no more fighting with spacing.

## Two roles: the shelf and the books

- The **container** is the parent you add `display: flex` to. It sets the rules.
- The **items** are its direct children. They follow the rules.

```css
.container {
  display: flex;        /* turn on flexbox */
  gap: 16px;            /* space between items */
  justify-content: center; /* line them up along the row */
  align-items: center;     /* line them up top-to-bottom */
}
```

## Two directions: main and cross

Flexbox thinks in two directions:

- The **main axis** is the direction items line up in. By default that's left → right (a row).
- The **cross axis** is the other direction (top → bottom for a row).

Two properties do the aligning:

- `justify-content` → positions items along the **main axis** (the row).
- `align-items` → positions items along the **cross axis** (up and down).

## The handful of values you'll actually use

For `justify-content` (along the row):

| Value | Effect |
|-------|--------|
| `flex-start` | Bunched at the start (default) |
| `center` | Centered |
| `space-between` | Pushed to both ends, gaps in the middle |
| `space-evenly` | Equal space everywhere |

For `align-items` (up/down): `center` (middle), `flex-start` (top), `flex-end` (bottom), `stretch` (fill the height).

## Making items grow and shrink

Sometimes you want one item to fill leftover space. The `flex` property handles it:

```css
.sidebar { flex: 0 0 240px; } /* fixed 240px, never changes */
.content { flex: 1; }         /* grabs all the remaining space */
```

Rough translation: `flex: 1` means "stretch to fill," and `flex: 0 0 240px` means "stay 240px, no matter what."

## Copy-paste patterns

```css
/* Perfectly center anything */
.centered {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* Nav bar: logo on the left, links on the right */
.nav { display: flex; align-items: center; gap: 24px; }
.nav .logo { margin-right: auto; } /* pushes everything else right */
```

> [!TIP]
> `margin-right: auto` on one item is a flexbox superpower — it soaks up all the free space on that side and shoves the other items to the far end. Perfect for a logo-left / links-right nav bar.

> [!NOTE]
> Flexbox is for lining things up in **one** direction (a row *or* a column). For full grids with rows *and* columns at once, use CSS Grid — that's the next lesson.

## In one sentence

Add `display: flex` to a parent, then use `justify-content` and `align-items` to line up its children — it's the easiest way to center and arrange things on the web.

## Want to go deeper?

Switch to **Expert** mode above for the full `flex-grow` / `flex-shrink` / `flex-basis` breakdown and more layout recipes.
