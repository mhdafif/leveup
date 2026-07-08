---
title: Events & the Event Loop
order: 8
estMinutes: 18
difficulty: easy
checklist:
  - Add and remove event listeners correctly with addEventListener
  - Explain the difference between event bubbling and capturing
  - Use event delegation to handle events on dynamic elements efficiently
  - Apply event.preventDefault() and event.stopPropagation() appropriately
  - Describe the call stack, task queue, and microtask queue
  - Explain why long-running synchronous code freezes the UI
---

A web page is always listening. A click, a keypress, a scroll — each is an **event**, and you can run code whenever one happens. Think of it like putting a doorbell on an element: "when this button is clicked, do this."

## Listening for events

```ts
const button = document.querySelector('#submit')

function handleClick(event) {
  console.log('Button clicked!')
}
button.addEventListener('click', handleClick)

// To stop listening later, pass the SAME function
button.removeEventListener('click', handleClick)
```

> [!WARNING]
> If you write the handler inline as an arrow function — `addEventListener('click', () => {...})` — you can't remove it later, because each one is a brand-new function. Save it to a variable if you'll need to remove it.

## Events "bubble" upward

When you click a button inside a box, the click doesn't just fire on the button — it then travels *up* to the box, then the page, and so on. This is called **bubbling**. It sounds like trivia, but it powers a really useful trick below.

## One listener for many items (event delegation)

Instead of adding a listener to every list item (tedious, and it misses items added later), add **one** listener to the parent and ask "what got clicked?":

```ts
const list = document.querySelector('#todo-list')

list.addEventListener('click', (event) => {
  const item = event.target.closest('li.todo-item')
  if (!item) return          // clicked empty space — ignore
  item.classList.toggle('done')
})
```

Because clicks bubble up to the list, this one handler covers every item — even ones you add tomorrow.

## Stopping the defaults

Some elements have built-in behavior: forms reload the page, links navigate away. `preventDefault()` cancels that so you can handle it yourself:

```ts
form.addEventListener('submit', (event) => {
  event.preventDefault()  // don't reload the page
  // ...send the data with fetch instead
})
```

## Why the page sometimes "freezes"

JavaScript does **one thing at a time** (it's single-threaded). It keeps a to-do list and works through it. If you give it one enormous task — like a loop that runs for three seconds — it can't respond to clicks until that finishes. That's why the page freezes.

There's also a priority rule worth knowing: quick follow-ups from Promises (called **microtasks**) run *before* timers like `setTimeout`. So:

```ts
console.log('1')
setTimeout(() => console.log('4'), 0)
Promise.resolve().then(() => console.log('3'))
console.log('2')
// prints: 1, 2, 3, 4
```

The plain lines run first, then the Promise, then the timer — even though the timer said "0."

## In one sentence

Use `addEventListener` to react to clicks and keypresses, lean on bubbling to handle many items with one listener, and remember JavaScript does one thing at a time — so keep each task short to keep the page responsive.

## Want to go deeper?

Switch to **Expert** mode above for the capture phase, `stopPropagation`, and the full call-stack / task-queue / microtask-queue model.
