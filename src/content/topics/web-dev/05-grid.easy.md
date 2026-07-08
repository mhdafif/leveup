---
title: CSS Grid
order: 5
estMinutes: 18
difficulty: easy
checklist:
  - Define a grid with grid-template-columns and grid-template-rows
  - Use the fr unit to create proportional column tracks
  - Place items explicitly using grid-column and grid-row span syntax
  - Assign items to named grid areas with grid-template-areas
  - Understand auto-placement and the implicit grid
  - Build a responsive grid layout using auto-fill and minmax()
---

If Flexbox is arranging books on a single shelf, **CSS Grid** is a whole bookcase — rows *and* columns at the same time. It's the tool for page layouts, photo galleries, and dashboards where things need to line up in both directions, like a spreadsheet or a chessboard.

## Drawing the grid

You turn on Grid and then describe the columns you want:

```css
.grid {
  display: grid;
  grid-template-columns: 200px 1fr 1fr; /* 3 columns */
  gap: 16px;                            /* space between cells */
}
```

That says: first column is a fixed 200px, and the other two split the leftover space evenly.

## The `fr` unit = "a share of what's left"

`fr` means "fraction of the free space." It's the easiest way to make flexible columns:

```css
grid-template-columns: 1fr 1fr 1fr;      /* three equal columns */
grid-template-columns: repeat(3, 1fr);   /* same thing, shorter */
grid-template-columns: 240px 1fr;        /* sidebar + main content */
```

## Putting an item in a specific spot

By default items fill the grid left-to-right, top-to-bottom. To make one item stretch across columns, use `span`:

```css
.wide-card {
  grid-column: span 2; /* take up two columns */
}
```

## The readable way: named areas

You can literally draw your layout with words, then drop each element into its named spot:

```css
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
}
.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

You can *see* the layout right there in the CSS — header on top, sidebar next to main, footer at the bottom.

## The magic responsive grid (no media queries)

This one pattern makes a card grid that automatically fits as many columns as will comfortably fit, and reflows on smaller screens all by itself:

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
```

Read it as: "make as many columns as fit, each at least 280px wide." On a wide screen you get 4 columns; on a phone, 1 — with zero extra code.

> [!TIP]
> Rule of thumb: reach for **Flexbox** to line things up in one direction, and **Grid** when you need control over rows *and* columns together.

## In one sentence

Grid lets you lay out a page in rows and columns at once — define your columns with `fr`, and use `repeat(auto-fill, minmax(...))` for grids that resize themselves.

## Want to go deeper?

Switch to **Expert** mode above for explicit line-number placement, the implicit grid, and `auto-fill` vs `auto-fit`.
