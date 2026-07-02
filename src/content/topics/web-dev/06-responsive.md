---
title: Responsive Design
order: 6
estMinutes: 25
difficulty: medium
checklist:
  - Explain the mobile-first approach and why it is preferred
  - Write a media query that targets screens wider than a given breakpoint
  - Set the viewport meta tag correctly and explain what it does
  - Use rem, em, %, and vw/vh units in the right contexts
  - Add responsive images with srcset and sizes attributes
  - Apply CSS clamp() to create fluid typography without media queries
---

Responsive design means a single HTML document adapts its layout, typography, and imagery to work well across all screen sizes — from a 320 px wide phone to a 4K monitor. It is not an optional feature; more than half of all web traffic comes from mobile devices, and a site that breaks on mobile is a broken site.

## Mobile-First Approach

Mobile-first means you write your default CSS for small screens, then use media queries to progressively enhance the layout for larger screens. The alternative — desktop-first — means overriding complex desktop styles for mobile, which is harder to maintain.

```css
/* Mobile-first: default styles for narrow screens */
.card-grid {
  display: grid;
  grid-template-columns: 1fr; /* single column on mobile */
  gap: 16px;
}

/* Enhance for wider screens */
@media (min-width: 640px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

> [!IMPORTANT]
> Mobile-first also reflects network conditions: smaller screens are more likely to be on slower connections. Starting with minimal styles and progressively loading more is better for performance.

## The Viewport Meta Tag

Without this tag, mobile browsers render the page at ~980 px and then scale it down, which looks terrible:

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

`width=device-width` tells the browser to use the device's actual screen width as the viewport width. `initial-scale=1` prevents any initial zoom. This tag is required for media queries to work as expected on mobile.

## Fluid Units

| Unit | Relative to | Best for |
|------|------------|---------|
| `%` | Parent element | Widths, fluid containers |
| `rem` | Root font size (`<html>`) | Font sizes, spacing (consistent scale) |
| `em` | Current element's font size | Component-relative spacing, padding |
| `vw` | 1% of viewport width | Hero sections, full-width elements |
| `vh` | 1% of viewport height | Full-screen sections |
| `svh` | Small viewport height (excludes mobile browser chrome) | Mobile full-screen layouts |

```css
/* rem-based spacing scale */
.container {
  max-width: 72rem;      /* ~1152px at 16px base */
  padding-inline: 1rem;
}

h1 { font-size: 2rem; }       /* 32px — scales with user preferences */
p  { font-size: 1rem; }       /* 16px baseline */
```

## CSS clamp() for Fluid Typography

`clamp(min, preferred, max)` returns a value that scales between a minimum and maximum as the viewport changes — no media queries needed:

```css
h1 {
  /* Minimum 1.5rem, fluid between viewports, maximum 3rem */
  font-size: clamp(1.5rem, 4vw + 1rem, 3rem);
}

.container {
  /* Fluid padding that never goes below 1rem or above 2rem */
  padding-inline: clamp(1rem, 5vw, 2rem);
}
```

The `4vw + 1rem` preferred value is calculated relative to the viewport, creating genuinely fluid scaling with no breakpoints.

## Responsive Images with srcset

A single `<img>` tag can serve different image files based on the device's screen width and pixel density:

```html
<img
  src="photo-800.jpg"
  srcset="
    photo-400.jpg   400w,
    photo-800.jpg   800w,
    photo-1600.jpg 1600w
  "
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 50vw,
    33vw
  "
  alt="A mountain landscape at sunset"
  width="800"
  height="533"
/>
```

- `srcset` lists candidate files with their intrinsic widths in `w` descriptors.
- `sizes` tells the browser how wide the image will be displayed at each breakpoint.
- The browser combines these to select the most appropriate file — high-DPI phones automatically get the larger file.

> [!NOTE]
> Always specify `width` and `height` attributes on `<img>`. The browser uses them to reserve space before the image loads, preventing **Cumulative Layout Shift (CLS)** — one of the Core Web Vitals metrics.

> [!TIP]
> Use the `<picture>` element when you need to serve completely different image crops at different screen sizes (art direction), not just different resolutions of the same image. `srcset` on `<img>` handles resolution switching; `<picture>` handles art direction.

## Further Learning

Search these terms to go deeper:
- **"Responsive design patterns Google Developers"** — canonical patterns for navigation, tables, and images at different sizes
- **"CSS clamp fluid typography"** — tools like Utopia let you generate clamp() values visually
- **"Core Web Vitals"** — Google's performance metrics (LCP, CLS, INP) and how responsive design affects them
- **"container queries CSS"** — the modern evolution: styling based on a component's own container, not the viewport
- **"logical properties responsive design"** — `padding-inline` and `margin-block` for direction-agnostic responsive styles
