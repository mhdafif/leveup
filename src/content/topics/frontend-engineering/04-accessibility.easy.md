---
title: Accessibility (a11y)
order: 4
estMinutes: 15
difficulty: easy
checklist:
  - Explain WCAG levels A, AA, and AAA and which to target
  - Write semantic HTML that communicates structure to assistive technology
  - Apply ARIA roles, properties, and states correctly
  - Implement keyboard navigation and focus management
  - Audit a page with axe DevTools and interpret the results
---

**Accessibility** (often shortened to "a11y" — an "a", 11 letters, then "y") means building things people with disabilities can actually use — folks who are blind, can't use a mouse, are colorblind, and more. It's not an add-on at the end; it's a quality you build in from the start. And it makes your site better for *everyone*.

## The single biggest win: use the right HTML

Most accessibility comes free if you use real HTML elements instead of faking them with `<div>`s:

```html
<!-- ❌ A fake button — no keyboard support, screen readers ignore it -->
<div class="btn" onclick="submit()">Submit</div>

<!-- ✅ A real button — keyboard, focus, and screen-reader support built in -->
<button type="submit">Submit</button>
```

A real `<button>` can be tabbed to, pressed with Enter or Space, and is announced correctly — all for free. A `<div>` gives you none of that.

> [!WARNING]
> The first rule of ARIA (accessibility attributes) is: **don't use ARIA if plain HTML can do it.** Use `<button>`, `<nav>`, `<label>`, headings, and links, and you've done most of the work already.

## Make everything keyboard-friendly

Lots of people navigate without a mouse. Every button, link, and input must be reachable with **Tab** and usable with **Enter/Space**. Two rules:

- Don't remove the focus outline (the ring showing where you are) without adding your own.
- When you open a popup/modal, move focus into it — and when it closes, send focus back to what opened it.

## Check your colors

Text needs enough contrast against its background or people can't read it. The standard (WCAG AA) asks for a **4.5:1** ratio for normal text. Don't eyeball it — use a contrast checker.

> [!IMPORTANT]
> Low color contrast is the *most common* accessibility problem on real websites. Always verify with a tool.

## Scan your page automatically

Install the free **axe DevTools** browser extension and run it on your pages. It instantly flags many issues (missing labels, low contrast, bad structure) with plain-language fixes. It won't catch *everything*, so also try tabbing through with just your keyboard.

## The standard to aim for

Accessibility guidelines (WCAG) have three levels: A (bare minimum), **AA** (the real target — what most laws require), and AAA (extra strict). Aim for **AA**.

## In one sentence

Use real HTML elements (not `<div>`s pretending to be buttons), make everything keyboard-operable, ensure enough color contrast, and scan with axe DevTools — targeting the WCAG **AA** level.

## Want to go deeper?

Switch to **Expert** mode above for ARIA roles/states, focus-management code, the full WCAG levels, and screen-reader testing.
