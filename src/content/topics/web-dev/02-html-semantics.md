---
title: HTML Semantics
order: 2
estMinutes: 25
difficulty: easy
checklist:
  - Explain why semantic HTML matters for accessibility and SEO
  - Distinguish block-level elements from inline elements
  - Use the correct landmark elements (header, nav, main, aside, footer)
  - Choose between article and section appropriately
  - Mark up a figure with a caption and a date with the time element
  - Identify at least three ways non-semantic HTML harms users
---

HTML is not just a way to display content — it is a contract between your page and the browsers, screen readers, search engines, and other tools that consume it. The specific elements you choose communicate meaning, not just appearance. That meaning is called **semantics**.

## Why Semantics Matter

A `<div>` and a `<nav>` can look identical on screen. But a screen reader announces a `<nav>` as a navigation landmark and lets users jump straight to it. A search engine treats `<article>` content as the primary body of a page. A browser's reader mode strips everything except semantic content areas. Using the wrong element — or defaulting to `<div>` everywhere — silently removes all of those benefits.

Three concrete harms of non-semantic HTML:
1. Screen reader users cannot navigate by landmarks (they must read every element in order).
2. Search engines cannot distinguish main content from sidebars or footers.
3. Browser features like reader mode, print styles, and focus management break or degrade.

## Block vs Inline

**Block-level elements** start on a new line and expand to fill their container's full width. Examples: `<p>`, `<div>`, `<h1>`–`<h6>`, `<ul>`, `<ol>`, `<li>`, `<section>`, `<article>`.

**Inline elements** flow within text and only occupy as much width as their content. Examples: `<span>`, `<a>`, `<strong>`, `<em>`, `<code>`, `<time>`, `<abbr>`.

The distinction matters for CSS layout, margin/padding behavior, and valid nesting (you cannot put a `<p>` inside a `<span>`).

## Key Landmark Elements

| Element | Purpose |
|---------|---------|
| `<header>` | Introductory content for the page or a section — logo, title, top nav |
| `<nav>` | A block of navigation links (primary menu, breadcrumbs, pagination) |
| `<main>` | The single primary content area of the page — use only once |
| `<section>` | A thematically related group of content that would benefit from a heading |
| `<article>` | Self-contained content that makes sense on its own (blog post, card, comment) |
| `<aside>` | Content tangentially related to the main content (callout box, related links) |
| `<footer>` | Closing content — copyright, contact links, secondary nav |

## Good vs Bad Example

```html
<!-- ❌ Non-semantic: meaningful only to sighted users -->
<div class="header">
  <div class="nav">
    <div class="nav-item"><a href="/">Home</a></div>
    <div class="nav-item"><a href="/about">About</a></div>
  </div>
</div>
<div class="content">
  <div class="post">
    <div class="title">My First Post</div>
    <div class="body">Lorem ipsum...</div>
  </div>
</div>
<div class="footer">© 2025</div>
```

```html
<!-- ✅ Semantic: structure is machine-readable -->
<header>
  <nav aria-label="Primary">
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>
<main>
  <article>
    <h1>My First Post</h1>
    <p>Lorem ipsum...</p>
  </article>
</main>
<footer>
  <p>© <time datetime="2025">2025</time></p>
</footer>
```

## Figure, Figcaption, and Time

`<figure>` wraps self-contained media (images, diagrams, code blocks) and `<figcaption>` provides an accessible caption. The `<time>` element attaches a machine-readable date to human-readable text:

```html
<figure>
  <img src="chart.png" alt="Monthly active users, Jan–Jun 2025" />
  <figcaption>Figure 1: User growth over the first half of 2025.</figcaption>
</figure>

<p>Published on <time datetime="2025-06-15">June 15, 2025</time>.</p>
```

> [!IMPORTANT]
> Every `<img>` must have an `alt` attribute. For decorative images use `alt=""` (empty string, not missing). Screen readers skip empty-alt images but announce images with a missing alt attribute as the filename — which is useless.

> [!NOTE]
> `<section>` should almost always have a heading as its first child. If a grouping of content doesn't warrant a heading, `<div>` is often the right choice instead.

> [!TIP]
> Install the "Accessibility Insights for Web" browser extension or run Lighthouse in DevTools to instantly see which semantic landmarks your page exposes and which are missing.

## Further Learning

Search these terms to go deeper:
- **"ARIA landmark roles"** — how ARIA supplements (not replaces) native HTML semantics
- **"HTML5 document outline algorithm"** — why heading hierarchy still matters even with sectioning elements
- **"WebAIM screen reader survey"** — real data on how assistive technology users navigate the web
- **"SEO semantic HTML"** — how search engines use structured markup to understand page content
- **"MDN HTML elements reference"** — the canonical list of every element with usage guidance
