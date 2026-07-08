---
title: Functions & Scope
order: 2
estMinutes: 15
difficulty: easy
checklist:
  - Distinguish function declarations, expressions, and arrow functions by syntax and hoisting behaviour
  - Explain hoisting and predict what gets hoisted vs what stays in the TDZ
  - Trace the scope chain to determine which variable a reference resolves to
  - Explain what lexical scope means and why it differs from dynamic scope
  - Describe what `this` refers to in regular functions vs arrow functions
  - Recognise an IIFE and explain why it was useful before block scope
---

A **function** is a reusable recipe: give it ingredients (arguments), it does some steps, and hands back a result. **Scope** is simply the question of "which variables can this piece of code see?" These two ideas together explain most of how JavaScript finds your data.

## Three ways to write a function

```ts
// 1. Declaration — the classic
function add(a, b) {
  return a + b
}

// 2. Expression — a function stored in a variable
const multiply = function (a, b) {
  return a * b
}

// 3. Arrow function — shorter, very common today
const divide = (a, b) => a / b
```

They mostly do the same job. Arrow functions are shorter and have one special behavior with `this` (below).

## Scope: who can see what

Scope is like nested rooms. Code in an inner room can see out into the rooms around it, but the outer rooms can't see in.

```ts
const level = 'global'   // outer room

function outer() {
  const level = 'inner'  // inner room — its own 'level'
  console.log(level)     // 'inner' — finds the closest one first
}
```

When JavaScript needs a variable, it looks in the current room, then the room outside it, then further out, until it finds it. This is called the **scope chain**.

## `this` — the one tricky part

`this` refers to "who is calling me," and it depends on *how* a function is called, not where it's written. This trips people up constantly. The good news: **arrow functions don't have their own `this`** — they borrow it from the surrounding code, which is usually exactly what you want:

```ts
class Timer {
  seconds = 0
  start() {
    // arrow function → `this` is still the Timer. 
    setInterval(() => { this.seconds++ }, 1000)
  }
}
```

> [!WARNING]
> If you use a *regular* function as a `setInterval`/`setTimeout` callback, `this` won't be your object anymore — a classic bug. Use an arrow function to keep `this` pointing at the right thing.

## In one sentence

Functions are reusable recipes, scope decides which variables code can see (inner code sees outward), and arrow functions conveniently borrow `this` from their surroundings.

## Want to go deeper?

Switch to **Expert** mode above for hoisting and the temporal dead zone, all four `this` binding rules, and the IIFE pattern.
