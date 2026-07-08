---
title: HTML Semantics
order: 2
estMinutes: 15
difficulty: easy
checklist:
  - Explain why semantic HTML matters for accessibility and SEO
  - Distinguish block-level elements from inline elements
  - Use the correct landmark elements (header, nav, main, aside, footer)
  - Choose between article and section appropriately
  - Mark up a figure with a caption and a date with the time element
  - Identify at least three ways non-semantic HTML harms users
---

Imagine you're organizing a book. You could dump every sentence into one giant paragraph — or you could add chapters, a table of contents, and page headers. The words are the same, but the second version is far easier to navigate. **Semantic HTML** is that structure for a web page: choosing tags that describe *what* something is, not just how it looks.

## Why the right tags matter

A `<div>` (a generic box) and a `<nav>` (a navigation menu) can look identical on screen. But the difference is huge for people and machines that can't "see" your page:

- **Screen readers** (software that reads pages aloud for blind users) can jump straight to a `<nav>` or `<main>`. With plain `<div>`s, they have to read everything top to bottom.
- **Search engines** like Google use `<article>` to find the real content of your page, so it ranks better.
- **Browser features** like reader mode and print layouts rely on these tags to work.

Use the wrong tag and you quietly lose all of that.

## Two kinds of elements: block and inline

- **Block elements** start on their own line and stretch across the full width. Think of paragraphs and headings: `<p>`, `<h1>`, `<div>`, `<section>`.
- **Inline elements** sit *inside* a line of text and only take up as much room as they need: `<a>` (a link), `<strong>` (bold), `<span>`, `<time>`.

Quick rule: block = a stacked box, inline = a word or two inside a sentence.

## The "landmark" tags to know

These describe the main regions of a page:

| Tag | What it's for |
|---------|---------|
| `<header>` | The top strip — logo, title, main menu |
| `<nav>` | A set of navigation links |
| `<main>` | The main content (use it once per page) |
| `<article>` | A self-contained chunk — a blog post, a comment |
| `<aside>` | Side content — a callout or related links |
| `<footer>` | The bottom strip — copyright, contact |

## See the difference

```html
<!-- ❌ Everything is a plain box — meaningless to a screen reader -->
<div class="header">
  <div class="nav"><a href="/">Home</a></div>
</div>
<div class="content">
  <div class="title">My First Post</div>
</div>
```

```html
<!-- ✅ Same look, but now the structure has meaning -->
<header>
  <nav aria-label="Primary"><a href="/">Home</a></nav>
</header>
<main>
  <article>
    <h1>My First Post</h1>
  </article>
</main>
```

## Pictures and dates

`<figure>` groups an image with a caption, and `<time>` gives a date the computer can actually read:

```html
<figure>
  <img src="chart.png" alt="User growth, Jan–Jun 2025" />
  <figcaption>Figure 1: users over the first half of 2025.</figcaption>
</figure>

<p>Published on <time datetime="2025-06-15">June 15, 2025</time>.</p>
```

> [!IMPORTANT]
> Every `<img>` needs an `alt` — a short text description for people who can't see it. If the image is purely decorative, use `alt=""` (empty) so screen readers skip it.

## In one sentence

Pick the tag that matches the *meaning* of your content — `<nav>` for menus, `<main>` for the main stuff, `<article>` for a post — and your page instantly works better for real people and for Google.

## Want to go deeper?

Switch to **Expert** mode above for the full breakdown, including how `<section>` vs `<article>` differ and how ARIA landmarks fit in.
