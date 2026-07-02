---
title: Accessibility (a11y)
order: 4
estMinutes: 30
difficulty: medium
checklist:
  - Explain WCAG levels A, AA, and AAA and which to target
  - Write semantic HTML that communicates structure to assistive technology
  - Apply ARIA roles, properties, and states correctly
  - Implement keyboard navigation and focus management
  - Audit a page with axe DevTools and interpret the results
---

Accessibility (a11y) is the practice of building products that people with disabilities can use. Around 15% of the world's population lives with some form of disability — visual, motor, auditory, or cognitive. Accessibility is not a feature you add at the end; it is a quality attribute baked into every component you build.

## WCAG Levels

The Web Content Accessibility Guidelines (WCAG) define three conformance levels:

| Level | Description | Target |
|---|---|---|
| **A** | Minimum — must not block access | Required baseline |
| **AA** | Standard — most accessibility needs | Target for most products |
| **AAA** | Enhanced — maximally inclusive | Aspirational for specific content |

Most legal standards (ADA, EN 301 549, AODA) require **WCAG 2.1 AA**. WCAG 2.2 added new criteria around focus and dragging; WCAG 3.0 is in development.

## Semantic HTML

Semantic HTML gives the browser and assistive technology the correct role and name for each element without any ARIA. A button that submits a form is `<button>`, not `<div class="button">`. A landmark that contains navigation is `<nav>`, not `<div class="nav">`.

```html
<!-- ❌ Bad: role and keyboard behavior must be faked with ARIA + JS -->
<div class="btn" onclick="submit()">Submit</div>

<!-- ✅ Good: semantics, keyboard, and focus come for free -->
<button type="submit">Submit</button>
```

Key semantic elements: `<header>`, `<main>`, `<nav>`, `<aside>`, `<footer>`, `<article>`, `<section>`, `<h1>`–`<h6>`, `<button>`, `<a href>`, `<label>`, `<fieldset>`, `<legend>`.

> [!TIP]
> Screen readers use heading levels to build a document outline. Never skip heading levels (e.g., jump from `<h2>` to `<h4>`) just for visual sizing. Use CSS to control the size; use heading levels to communicate hierarchy.

## ARIA Roles, Properties, and States

Use ARIA to fill gaps where HTML semantics are insufficient — custom components like date pickers, comboboxes, or tabs:

```html
<!-- ARIA role tells assistive tech what the element is -->
<div role="tablist" aria-label="Settings panels">
  <button role="tab" aria-selected="true" aria-controls="panel-general">General</button>
  <button role="tab" aria-selected="false" aria-controls="panel-privacy">Privacy</button>
</div>
<div id="panel-general" role="tabpanel" tabindex="0">...</div>
```

**Properties** describe what an element is (`aria-label`, `aria-labelledby`, `aria-describedby`, `aria-controls`).
**States** describe what an element is currently doing (`aria-selected`, `aria-expanded`, `aria-checked`, `aria-disabled`).

> [!WARNING]
> The first rule of ARIA is: do not use ARIA if you can use native HTML. Adding `role="button"` to a `<div>` does not give you keyboard behavior, click-on-Space, or focus styling — you must implement all of that yourself. A `<button>` does it automatically.

## Keyboard Navigation

Every interactive element must be reachable and operable with a keyboard alone. Users navigate with `Tab` (forward), `Shift+Tab` (backward), `Enter`/`Space` (activate), and arrow keys (within widgets like menus and tabs).

Rules:
- Do not remove focus outlines without providing an equivalent replacement
- `tabindex="0"` adds an element to the tab order in DOM sequence
- `tabindex="-1"` removes an element from the tab order but keeps it programmatically focusable
- Never use positive `tabindex` values — they break the natural order

**Focus management:** when you open a modal dialog, move focus into it. When you close it, return focus to the element that opened it:

```ts
const triggerRef = useRef<HTMLButtonElement>(null);
const modalRef = useRef<HTMLDivElement>(null);

function openModal() {
  setOpen(true);
  // Focus moves to the modal after the next render
  requestAnimationFrame(() => modalRef.current?.focus());
}

function closeModal() {
  setOpen(false);
  triggerRef.current?.focus(); // return focus to trigger
}
```

## Color Contrast

WCAG 2.1 AA requires:
- **4.5:1** contrast ratio for normal text (under 18pt / 14pt bold)
- **3:1** for large text and UI components (borders, icons)

> [!IMPORTANT]
> Contrast failures are the most common WCAG violation in real-world audits. Always verify contrast with a tool — perceived brightness is not a reliable judge.

## Auditing with axe DevTools

axe DevTools (browser extension) catches ~57% of WCAG issues automatically. Run it on every page before shipping. Each violation includes impact level (critical, serious, moderate), the affected element, and a fix description.

Automated tools cannot catch everything — missing captions on video, logical reading order issues, and complex keyboard patterns require manual testing. Test with VoiceOver (macOS/iOS) or NVDA (Windows) and a keyboard only.

> [!NOTE]
> The **a11yproject.com** checklist is a practical, plain-language reference for manual testing across all WCAG 2.1 AA criteria.

## Further Learning

Search these terms to go deeper:
- **"WCAG 2.1 quick reference"** — filterable list of every success criterion with techniques
- **"a11yproject.com checklist"** — plain-language manual testing checklist
- **"WebAIM million report"** — annual automated audit of the top 1 million homepages; shows the most common failures
- **"ARIA authoring practices guide APG"** — WAI-ARIA patterns for every common widget with keyboard behavior specs
- **"axe DevTools browser extension"** — free automated accessibility scanner with guided remediation
