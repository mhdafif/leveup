---
title: Closures
order: 3
estMinutes: 15
difficulty: easy
checklist:
  - Define what a closure is in terms of scope and lifetime
  - Explain that closures capture variables by reference, not by value
  - Implement a counter factory using a closure
  - Implement a simple memoize function using a closure
  - Describe the classic loop-with-var pitfall and two ways to fix it
  - Identify the module pattern and explain what problem it solves
---

A **closure** is a function that remembers the variables around it, even after the code that created it has finished. Think of it like a backpack: when a function is created, it packs up the variables it needs and carries them wherever it goes.

## A function with a memory

```ts
function makeGreeter(greeting) {
  // the inner function packs 'greeting' in its backpack
  return function (name) {
    return `${greeting}, ${name}!`
  }
}

const sayHello = makeGreeter('Hello')
const sayHi = makeGreeter('Hi')

sayHello('Alice') // "Hello, Alice!"
sayHi('Bob')      // "Hi, Bob!"
```

`makeGreeter` has already finished running, but each returned function still remembers its own `greeting`. That memory is the closure.

## Why closures are useful: private state

Closures let you keep a value hidden and safe — only reachable through the functions you choose to expose:

```ts
function makeCounter() {
  let count = 0  // private — nobody outside can touch it directly

  return {
    increment: () => ++count,
    value: () => count,
  }
}

const counter = makeCounter()
counter.increment()  // 1
counter.increment()  // 2
counter.value()      // 2
```

There's no way to reach `count` from outside — the only way in is through `increment` and `value`. That's a clean way to protect data.

## The classic gotcha (loops)

A closure remembers the *variable*, not a snapshot of its value. With the old `var`, this surprises people:

```ts
// Bug: prints 3, 3, 3 — all share one `i`
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100)
}

// Fix: use `let` — each loop gets its own `i`
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100)
}
// prints 0, 1, 2
```

The fix is simple: use `let` instead of `var` in loops.

## In one sentence

A closure is a function that carries a backpack of the variables it was created with — great for keeping private state, and a good reason to use `let` (not `var`) in loops.

## Want to go deeper?

Switch to **Expert** mode above for a memoize implementation, the module pattern, and how closures keep variables alive in memory.
