---
title: CSS Box Model
order: 3
estMinutes: 12
difficulty: easy
checklist:
  - Name the four layers of the CSS box model in order
  - Explain the difference between content-box and border-box sizing
  - Predict how margin, padding, and border affect element size
  - Know when margin collapse occurs and how to prevent it
  - Distinguish block, inline, and inline-block display behavior
  - "Use box-sizing: border-box correctly in a stylesheet reset"
---

Think of every element on a page as a framed photo on a wall. There's the photo itself, a mat around it, the frame, and then the empty wall space keeping it away from other frames. CSS sees every element exactly this way — as a box with layers. Once you understand these layers, CSS spacing stops feeling random.

## The four layers (inside to outside)

- **Content** — the actual text or image. This is the photo.
- **Padding** — space *inside* the box, between the content and the edge. This is the mat around the photo. It takes on the background color.
- **Border** — a line around the padding. This is the frame.
- **Margin** — invisible space *outside* the box that pushes other elements away. This is the gap to the next frame on the wall.

```
┌─────────── margin ───────────┐
│  ┌──────── border ───────┐   │
│  │  ┌──── padding ────┐  │   │
│  │  │    content      │  │   │
│  │  └─────────────────┘  │   │
│  └───────────────────────┘   │
└──────────────────────────────┘
```

## The sizing gotcha (and the one-line fix)

By default, when you say `width: 200px`, that's only the **content**. Add padding and a border and the box gets *wider* than 200px — which surprises everyone at first.

The fix is to tell CSS "include padding and border in the width I gave you":

```css
/* Put this at the top of every project */
*, *::before, *::after {
  box-sizing: border-box;
}

.card {
  width: 300px;
  padding: 24px;
  border: 2px solid #e5e7eb;
  /* Stays exactly 300px wide. No surprises. */
}
```

> [!IMPORTANT]
> Always set `box-sizing: border-box` globally. Every popular CSS framework does this by default because it prevents a whole category of "why is my box too big?" bugs.

## The margin surprise

When two stacked elements both have a vertical margin, the browser doesn't add them together — it uses the **bigger** of the two. So a `16px` bottom margin next to a `24px` top margin gives you `24px` of space, not `40px`. This is called **margin collapse**. If it ever throws off your spacing, adding padding or `display: flex` to the parent stops it.

## How elements sit next to each other

| Value | Behavior |
|-------|----------|
| `block` | Own line, full width (paragraphs, divs) |
| `inline` | Flows inside text, ignores width/height (links, spans) |
| `inline-block` | Flows inside text *but* respects width/height (great for badges) |
| `none` | Removed from the page entirely |

## In one sentence

Every element is a box with content, padding, border, and margin — set `box-sizing: border-box` once and the numbers you write will match what you see.

## Want to go deeper?

Switch to **Expert** mode above for the exact margin-collapse rules and how `visibility: hidden` differs from `display: none`.
