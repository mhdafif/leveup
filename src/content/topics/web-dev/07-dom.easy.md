---
title: DOM Manipulation
order: 7
estMinutes: 15
difficulty: easy
checklist:
  - Explain what the DOM is and how it relates to HTML source
  - Select elements using querySelector and querySelectorAll
  - Create elements with createElement and add them to the page
  - Toggle classes and read/write data attributes
  - Update element text and HTML content safely
  - Identify common DOM manipulation pitfalls and how to avoid them
---

When the browser reads your HTML, it builds a living model of the page in memory — a family tree where every tag is a branch. That tree is the **DOM** (Document Object Model). JavaScript can reach into this tree and change it on the fly, and the page updates instantly. That's how buttons, menus, and live updates work.

## The DOM isn't your HTML file

Your HTML is the *starting recipe*. The DOM is the *live dish* the browser cooked from it. Once your page is running, JavaScript can add and remove items — "View Source" still shows the original file, but the DOM (what you see in DevTools) reflects the changes.

## Finding elements

You grab elements with `querySelector` (using the same selectors you write in CSS):

```ts
// The first match (or null if nothing matches)
const btn = document.querySelector('.submit-btn')

// Every match, as a list you can loop over
const items = document.querySelectorAll('.todo-item')
items.forEach(item => console.log(item.textContent))
```

> [!WARNING]
> If nothing matches, `querySelector` gives you `null`. A `Cannot read properties of null` error almost always means your element wasn't on the page yet, or your selector has a typo.

## Creating and adding elements

```ts
const li = document.createElement('li')  // make a new <li>
li.textContent = 'Buy groceries'         // put text in it
li.classList.add('todo-item')            // give it a class

const list = document.querySelector('#todo-list')
list.appendChild(li)                     // add it to the page
```

## Classes and data attributes

```ts
const card = document.querySelector('.card')

card.classList.add('active')       // add a class
card.classList.remove('hidden')    // remove one
card.classList.toggle('expanded')  // flip it on/off

// data-* attributes store little bits of info on an element
// <div class="card" data-user-id="42">
const id = card.dataset.userId     // "42"
```

Toggling a class is the cleanest way to show/hide things or change styles — you keep the actual styling in your CSS.

## Changing content — safely

There are two ways to set content, and one is safer:

```ts
// textContent → plain text, always safe
title.textContent = userInput

// innerHTML → parses HTML. Fine for your own static strings,
// but DANGEROUS with anything a user typed.
container.innerHTML = '<p>No results found.</p>'  // ok
// container.innerHTML = userInput  ← security hole!
```

> [!IMPORTANT]
> Dropping user-typed text into `innerHTML` is the classic **XSS** (a security bug where someone injects malicious code into your page). For anything a user provides, use `textContent`, which treats it as harmless plain text.

## Two common traps

1. **Running too early.** If your script runs before the page is built, `querySelector` finds nothing. Put `<script defer>` in the `<head>`, or your `<script>` at the end of `<body>`.
2. **Duplicate event listeners.** Re-adding the same click handler over and over causes it to fire multiple times. Remove old ones, or add with `{ once: true }`.

## In one sentence

The DOM is the browser's live version of your page — use `querySelector` to grab elements, `classList` to change them, and `textContent` (not `innerHTML`) for anything a user typed.

## Want to go deeper?

Switch to **Expert** mode above for insertion methods, `getComputedStyle`, and sanitizing HTML with DOMPurify.
