---
title: Responsive Design
order: 6
estMinutes: 15
difficulty: easy
checklist:
  - Explain the mobile-first approach and why it is preferred
  - Write a media query that targets screens wider than a given breakpoint
  - Set the viewport meta tag correctly and explain what it does
  - Use rem, em, %, and vw/vh units in the right contexts
  - Add responsive images with srcset and sizes attributes
  - Apply CSS clamp() to create fluid typography without media queries
---

Water takes the shape of whatever glass you pour it into. **Responsive design** makes a web page do the same thing — one page that reshapes itself to look good on a tiny phone, a tablet, or a giant monitor. Since most people browse on phones, this isn't a nice-to-have; a site that breaks on mobile is simply broken.

## Start small: mobile-first

Design for the phone first, then *add* styles for bigger screens. This is easier than the reverse, because you start simple and layer on complexity.

```css
/* Default: one column (phone) */
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* Bigger screen? Add more columns */
@media (min-width: 640px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .card-grid { grid-template-columns: repeat(3, 1fr); }
}
```

A `@media (min-width: 640px)` block is just "apply these styles *only* when the screen is at least 640px wide."

## The one tag you must not forget

Without this line in your `<head>`, phones pretend to be a wide desktop and shrink everything down to unreadable size:

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

It tells the phone "use your real width." Media queries won't behave correctly without it.

## Units that flex

- **`%`** — relative to the parent. Good for widths.
- **`rem`** — relative to the page's base font size. Best for font sizes and spacing, because it respects the user's zoom/preferences.
- **`vw` / `vh`** — 1% of the screen's width / height. Good for full-screen sections.

```css
h1 { font-size: 2rem; } /* scales nicely, ~32px */
.container { max-width: 72rem; padding-inline: 1rem; }
```

## Fluid text with `clamp()`

`clamp(min, ideal, max)` picks a size that grows with the screen but never gets too small or too big — no media queries needed:

```css
h1 {
  font-size: clamp(1.5rem, 4vw + 1rem, 3rem);
  /* never smaller than 1.5rem, never bigger than 3rem */
}
```

## Images that fit the device

`srcset` lets one `<img>` offer several sizes, and the browser picks the best one — so phones don't download a huge desktop photo:

```html
<img
  src="photo-800.jpg"
  srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1600.jpg 1600w"
  sizes="(max-width: 640px) 100vw, 50vw"
  alt="A mountain at sunset"
  width="800" height="533"
/>
```

> [!NOTE]
> Always add `width` and `height` to images. It lets the browser reserve the right amount of space so the page doesn't jump around while images load.

## In one sentence

Write styles for phones first, add the viewport meta tag, use `rem` and `clamp()` for text, and let `@media` queries widen the layout on bigger screens.

## Want to go deeper?

Switch to **Expert** mode above for the full units table, `<picture>` for art direction, and Core Web Vitals.
