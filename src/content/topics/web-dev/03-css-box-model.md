---
title: CSS Box Model
order: 3
estMinutes: 20
difficulty: easy
checklist:
  - Name the four layers of the CSS box model in order
  - Explain the difference between content-box and border-box sizing
  - Predict how margin, padding, and border affect element size
  - Know when margin collapse occurs and how to prevent it
  - Distinguish block, inline, and inline-block display behavior
  - "Use box-sizing: border-box correctly in a stylesheet reset"
---

Every element on a web page is a rectangular box. Understanding the rules that govern how those boxes are sized and spaced is the single most important step toward writing CSS that behaves predictably.

## The Four Layers

From innermost to outermost, each box has four regions:

```
/*
 *  ┌─────────────────────────────────────┐
 *  │              MARGIN                 │  ← transparent, pushes other elements away
 *  │  ┌───────────────────────────────┐  │
 *  │  │            BORDER             │  │  ← visible line (or invisible if border: none)
 *  │  │  ┌─────────────────────────┐  │  │
 *  │  │  │         PADDING         │  │  │  ← space between content and border
 *  │  │  │  ┌───────────────────┐  │  │  │
 *  │  │  │  │      CONTENT      │  │  │  │  ← text, image, child elements
 *  │  │  │  └───────────────────┘  │  │  │
 *  │  │  └─────────────────────────┘  │  │
 *  │  └───────────────────────────────┘  │
 *  └─────────────────────────────────────┘
 */
```

- **Content** — where text, images, and child elements live. Sized by `width` and `height`.
- **Padding** — transparent space between the content and the border. Has the element's background color.
- **Border** — a rendered line around the padding. Can have color, style, and width.
- **Margin** — transparent space outside the border. Always transparent; never has a background.

## content-box vs border-box

The default `box-sizing: content-box` means `width` applies only to the **content area**. If you set `width: 200px`, `padding: 20px`, and `border: 2px solid`, the element's rendered width is actually `200 + 40 + 4 = 244px`. This is almost never what you intend.

`box-sizing: border-box` includes padding and border in the `width` value. A `200px` element stays `200px` no matter how much padding or border you add.

```css
/* Apply border-box globally — include this in every project reset */
*,
*::before,
*::after {
  box-sizing: border-box;
}

.card {
  width: 300px;
  padding: 24px;
  border: 2px solid #e5e7eb;
  /* Total rendered width: 300px (padding and border are inside) */
}
```

> [!IMPORTANT]
> Always set `box-sizing: border-box` globally. It is the default in every modern CSS framework (Tailwind, Bootstrap, etc.) and eliminates an entire class of sizing bugs.

## Margin Collapse

Vertical margins between block elements **collapse** — the space between two elements is the *larger* of the two margins, not their sum. This happens in three situations:

1. Adjacent siblings: the bottom margin of one element and the top margin of the next.
2. Parent and first/last child when there is no border, padding, or block formatting context between them.
3. An element with no content, padding, or border whose top and bottom margins collapse with each other.

```css
/* These two paragraphs are separated by 24px, not 16px + 24px = 40px */
p { margin-bottom: 16px; }
h2 { margin-top: 24px; }
```

To prevent collapse: add `padding`, `border`, `overflow: hidden`, or `display: flex` to the parent.

## Display Types

| Value | Behavior |
|-------|----------|
| `block` | New line, full width, respects width/height/margin |
| `inline` | Flows in text, width/height ignored, vertical margin ignored |
| `inline-block` | Flows in text but respects width/height and all margins |
| `none` | Removed from layout entirely (not just invisible) |

```css
/* Making a span act like a block for a badge */
.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 9999px;
  background: #10b981;
  color: white;
  font-size: 0.75rem;
}
```

> [!NOTE]
> `visibility: hidden` hides an element but keeps its space in the layout. `display: none` removes it from the layout entirely. Both leave the element in the DOM.

> [!TIP]
> In DevTools, hovering over any element in the Elements panel highlights all four box model regions on the page in real time. The Computed panel shows the exact resolved values for every box property.

## Further Learning

Search these terms to go deeper:
- **"CSS box model MDN"** — the definitive reference with interactive diagrams
- **"CSS margin collapse rules"** — all three collapse scenarios with examples
- **"block formatting context CSS"** — what triggers a BFC and why it stops margin collapse
- **"CSS reset vs normalize"** — different approaches to establishing a predictable baseline
- **"CSS logical properties"** — `margin-block`, `padding-inline` and how they work with writing modes
