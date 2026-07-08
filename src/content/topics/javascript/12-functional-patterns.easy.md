---
title: Functional Patterns
order: 12
estMinutes: 15
difficulty: easy
checklist:
  - Define a pure function and explain why purity makes code easier to test
  - Apply immutability when working with objects and arrays
  - Compose two or more functions into a pipeline
  - Implement a curried function and explain why currying is useful
  - Write a partial application helper and describe how it differs from currying
  - Identify side effects in code and refactor them to the edges of a program
---

**Functional programming** is a style, not a rulebook. Its two big ideas — **pure functions** and **not changing data in place** — make your code easier to test and reason about. You don't have to go all-in; even a little of this makes code better.

## Pure functions: predictable little machines

A function is **pure** if it (1) always gives the same output for the same input, and (2) doesn't touch anything outside itself.

```ts
// Impure — depends on outside state
let count = 0
function increment() { return ++count }  // result changes each call 😬

// Pure — only uses its input
function increment(n) { return n + 1 }    // increment(5) is always 6 ✅
```

> [!TIP]
> Pure functions are the easiest thing to test: call it with an input, check the output. No setup, no surprises.

## Don't change data — make a new copy

Instead of editing an object or array in place, create a new one with the change. Spread (`...`) makes this easy:

```ts
const user = { name: 'Alice', score: 0 }

// ❌ changing the original
user.score += 10

// ✅ making a new updated copy
const updated = { ...user, score: user.score + 10 }

// arrays too
const tags = ['js', 'ts']
const more = [...tags, 'react']              // add
const fewer = tags.filter(t => t !== 'ts')   // remove
```

Why? When data doesn't change unexpectedly, bugs get much rarer — nobody else's code can surprise you by mutating your object.

## Composing functions into a pipeline

If you have small functions, you can chain them so each one's output feeds the next — like an assembly line:

```ts
// Instead of hard-to-read nesting:
const result = trim(toUpperCase(clean(input)))

// ...build a readable pipeline (this pattern is called "pipe")
const transform = pipe(clean, toUpperCase, trim)
transform('  hello!  ')  // runs left to right
```

Small pure functions snap together like Lego.

## Keep side effects at the edges

"Side effects" are things like saving to a database, calling an API, or logging. You can't avoid them — but keep them *out* of your core logic. Do the calculations with pure functions, and only touch the outside world at the start and end:

```ts
// pure core — easy to test
function calculateTotal(orders) {
  return orders.reduce((sum, o) => sum + o.price * o.quantity, 0)
}

async function processOrders() {
  const orders = await db.query('...')   // edge: get data
  const total = calculateTotal(orders)   // pure core
  await db.save(total)                   // edge: save result
}
```

## In one sentence

Prefer pure functions (same input → same output, no side effects), make new copies instead of mutating data, and keep database/network calls at the edges — your code gets far easier to test and trust.

## Want to go deeper?

Switch to **Expert** mode above for function composition helpers, currying, partial application, and libraries like Immer and Ramda.
