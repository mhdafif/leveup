---
title: CSS Grid
order: 5
estMinutes: 30
difficulty: medium
checklist:
  - Define a grid with grid-template-columns and grid-template-rows
  - Use the fr unit to create proportional column tracks
  - Place items explicitly using grid-column and grid-row span syntax
  - Assign items to named grid areas with grid-template-areas
  - Understand auto-placement and the implicit grid
  - Build a responsive grid layout using auto-fill and minmax()
---

CSS Grid is a two-dimensional layout system that lets you control both rows and columns simultaneously. While flexbox excels at distributing items along a single axis, Grid gives you precise control over the entire page canvas — making it the right tool for page-level layouts, dashboards, image galleries, and any design where items need to align both horizontally and vertically.

## Defining a Grid

You create a grid by setting `display: grid` on a container, then defining tracks (columns and rows) with `grid-template-columns` and `grid-template-rows`.

```css
.grid {
  display: grid;
  grid-template-columns: 200px 1fr 1fr; /* 3 columns: fixed, then two equal */
  grid-template-rows: auto 1fr auto;    /* 3 rows: shrink-wrap, fill, shrink-wrap */
  gap: 16px;                            /* gap between all tracks */
}
```

## The fr Unit

`fr` stands for **fraction of the available free space**. After fixed and content-sized tracks are placed, the remaining space is divided among `fr` tracks proportionally.

```css
/* Three equal columns */
grid-template-columns: 1fr 1fr 1fr;

/* Shorthand using repeat() */
grid-template-columns: repeat(3, 1fr);

/* Sidebar + main: sidebar is 240px, main gets the rest */
grid-template-columns: 240px 1fr;

/* Two-thirds / one-third split */
grid-template-columns: 2fr 1fr;
```

## Placing Items Explicitly

By default, items are placed sequentially left-to-right, top-to-bottom (auto-placement). You can override this with `grid-column` and `grid-row`, which accept line numbers or `span` values.

```css
/* Grid lines are numbered from 1 */
.hero {
  grid-column: 1 / 3;  /* start at line 1, end at line 3 (spans 2 columns) */
  grid-row: 1 / 2;
}

/* Span syntax is often clearer */
.wide-card {
  grid-column: span 2;  /* take up 2 column tracks wherever auto-placed */
}
```

## Named Grid Areas

`grid-template-areas` lets you define a visual ASCII-art layout and assign elements to named regions. This is the most readable approach for full-page layouts.

```css
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 64px 1fr 48px;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
  min-height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

> [!TIP]
> Named areas also name the grid lines automatically. The area `header` creates lines named `header-start` and `header-end`, which you can reference in `grid-column` and `grid-row` for extra precision.

## Auto-Placement and the Implicit Grid

When you place more items than your explicit grid has room for, CSS Grid automatically creates new tracks in the **implicit grid**. You can control the size of these implicit tracks with `grid-auto-rows` and `grid-auto-columns`.

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 200px; /* all implicitly created rows are 200px tall */
  gap: 12px;
}
```

## Responsive Grids with auto-fill and minmax()

The most powerful responsive grid pattern requires no media queries at all:

```css
.card-grid {
  display: grid;
  /* Create as many columns as fit, each at least 280px, max 1fr */
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
```

`auto-fill` creates as many tracks as will fit. `minmax(280px, 1fr)` means each track is at least 280 px wide but can grow to fill remaining space. The grid automatically reflows from 4 columns on wide screens to 1 column on narrow ones.

> [!NOTE]
> `auto-fill` keeps empty tracks (useful when you want alignment across rows). `auto-fit` collapses empty tracks so filled items stretch to fill all available space. Use `auto-fill` for grids that always have the same number of columns; `auto-fit` when you want the items to expand to fill the row.

> [!WARNING]
> `grid-template-areas` requires every row to have the same number of columns, and each named area must be rectangular. A non-rectangular or inconsistent area definition causes the entire `grid-template-areas` declaration to be ignored silently.

## Further Learning

Search these terms to go deeper:
- **"CSS Grid Garden"** — interactive game for learning grid placement with 28 levels
- **"CSS Grid by Example Rachel Andrew"** — the definitive pattern library for grid layouts
- **"subgrid CSS"** — how nested grids can align to their parent's tracks (CSS Grid Level 2)
- **"grid vs flexbox when to use"** — practical decision framework for choosing between the two
- **"CSS masonry layout"** — the emerging grid extension for Pinterest-style staggered layouts
