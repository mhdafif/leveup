---
title: DOM Manipulation
order: 7
estMinutes: 25
difficulty: easy
checklist:
  - Explain what the DOM is and how it relates to HTML source
  - Select elements using querySelector and querySelectorAll
  - Create elements with createElement and add them to the page
  - Toggle classes and read/write data attributes
  - Update element text and HTML content safely
  - Identify common DOM manipulation pitfalls and how to avoid them
---

The Document Object Model (DOM) is the browser's live, in-memory representation of the HTML on a page. It is a tree of objects — each HTML element becomes a node — and JavaScript can read and modify that tree at any time, instantly updating what the user sees. DOM manipulation is how JavaScript makes pages interactive.

## What the DOM Is (and Isn't)

The DOM is **not** the same as your HTML source. By the time JavaScript runs, the browser has parsed the HTML, corrected any errors (like unclosed tags), run any server-side rendering, and built a live object tree. If JavaScript adds a `<li>` to a list, "View Source" still shows the original HTML — but inspecting the DOM in DevTools shows the new element.

## Selecting Elements

```ts
// Select the first matching element (or null if not found)
const btn = document.querySelector<HTMLButtonElement>('.submit-btn')

// Select all matching elements — returns a static NodeList
const items = document.querySelectorAll<HTMLLIElement>('.todo-item')

// Iterate over all items
items.forEach(item => {
  console.log(item.textContent)
})

// querySelector on a specific element (scoped search — much faster in large DOMs)
const form = document.querySelector('form')
const input = form?.querySelector<HTMLInputElement>('input[name="email"]')
```

> [!WARNING]
> `querySelector` returns `null` if no match is found. Always null-check before calling methods on the result, or use optional chaining (`?.`). A `Cannot read properties of null` error almost always means you tried to use an element before it exists in the DOM, or your selector has a typo.

## Creating and Inserting Elements

```ts
// Create a new element
const li = document.createElement('li')
li.textContent = 'Buy groceries'
li.classList.add('todo-item')

// Insert it at the end of a list
const list = document.querySelector('#todo-list')!
list.appendChild(li)

// Insert before a specific element
const firstItem = list.firstElementChild
list.insertBefore(li, firstItem)

// Modern: insertAdjacentElement for flexible positioning
list.insertAdjacentElement('afterbegin', li) // before first child
list.insertAdjacentElement('beforeend', li)  // after last child
```

## classList and data Attributes

```ts
const card = document.querySelector('.card')!

// Toggle, add, remove CSS classes
card.classList.add('active')
card.classList.remove('hidden')
card.classList.toggle('expanded')          // adds if absent, removes if present
const isActive = card.classList.contains('active')

// data-* attributes — store arbitrary metadata on elements
// <div class="card" data-user-id="42" data-role="admin">
const userId = card.dataset.userId   // "42" (always a string)
const role = card.dataset.role       // "admin"
card.dataset.status = 'verified'     // sets data-status="verified"
```

## Updating Content Safely

```ts
// textContent — safe, treats value as plain text (no HTML parsing)
const title = document.querySelector('h1')!
title.textContent = userInput  // safe even if userInput contains <script>

// innerHTML — parses HTML, useful for templates but dangerous with user input
const container = document.querySelector('.results')!
container.innerHTML = '<p>No results found.</p>'  // fine — static string

// NEVER do this with user-controlled data:
// container.innerHTML = userInput  ← XSS vulnerability

// Safe alternative for dynamic HTML: use createElement + textContent
function createResultItem(text: string): HTMLLIElement {
  const li = document.createElement('li')
  li.textContent = text  // text is escaped automatically
  return li
}
```

> [!IMPORTANT]
> Setting `innerHTML` with user-provided strings is one of the most common **Cross-Site Scripting (XSS)** vulnerabilities. Always use `textContent` for user data, or sanitize with a library like DOMPurify before inserting HTML.

## Modifying Styles

```ts
// Prefer classList — keeps styling in CSS
card.classList.add('is-visible')

// Direct style — useful for dynamic values that can't live in CSS
card.style.transform = `translateX(${offset}px)`
card.style.opacity = String(progress)

// Reading computed styles (the actual rendered value)
const styles = window.getComputedStyle(card)
const padding = styles.paddingTop  // "16px"
```

## Common Pitfalls

1. **Querying before the DOM is ready.** Put your `<script>` at the end of `<body>` or use `defer` on the `<script>` tag so the DOM is fully parsed before your code runs.
2. **Forgetting `querySelectorAll` returns a static snapshot**, not a live collection. If you add elements after calling it, they won't appear in the NodeList.
3. **Leaking event listeners** by re-registering them on every render without removing old ones. Use `removeEventListener` or the `{ once: true }` option.

> [!TIP]
> In DevTools Console, `$('selector')` is shorthand for `document.querySelector` and `$$('selector')` is shorthand for `document.querySelectorAll`. Handy for one-off debugging, but do not use these in production code.

## Further Learning

Search these terms to go deeper:
- **"DOM API MDN"** — comprehensive reference for all Node, Element, and Document methods
- **"XSS cross-site scripting prevention"** — OWASP's guide to preventing injection attacks via the DOM
- **"DOMPurify library"** — the standard way to safely sanitize HTML strings before inserting them
- **"MutationObserver API"** — how to watch for DOM changes without polling
- **"virtual DOM vs real DOM"** — how React and other frameworks optimize DOM updates
