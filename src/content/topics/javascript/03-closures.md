---
title: Closures
order: 3
estMinutes: 30
difficulty: medium
checklist:
  - Define what a closure is in terms of scope and lifetime
  - Explain that closures capture variables by reference, not by value
  - Implement a counter factory using a closure
  - Implement a simple memoize function using a closure
  - Describe the classic loop-with-var pitfall and two ways to fix it
  - Identify the module pattern and explain what problem it solves
---

A **closure** is a function that remembers the variables from the scope in which it was created, even after that outer scope has finished executing. Closures are not a special feature you opt into — every function in JavaScript is a closure.

## How Closures Work

When a function is defined, it gets a hidden reference to its surrounding scope (technically, to the **environment record** of the enclosing scope). If a variable in that scope is referenced by the inner function, the engine keeps it alive even after the outer function returns.

```ts
function makeGreeter(greeting: string) {
  // `greeting` lives in makeGreeter's scope
  return function (name: string): string {
    return `${greeting}, ${name}!`; // closure over `greeting`
  };
}

const sayHello = makeGreeter("Hello");
const sayHi = makeGreeter("Hi");

sayHello("Alice"); // "Hello, Alice!"
sayHi("Bob");      // "Hi, Bob!"
```

`makeGreeter` has returned, but `greeting` is not garbage-collected because `sayHello` and `sayHi` still hold references to it.

> [!IMPORTANT]
> Closures capture **variables**, not values. If the variable changes after the closure is created, the closure sees the new value.

## Closures Capture Variables, Not Values

This distinction bites almost every JavaScript learner at least once:

```ts
// Bug: all callbacks share the same `i` variable
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Prints: 3, 3, 3

// Fix 1: use `let` — each iteration gets its own block-scoped `i`
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Prints: 0, 1, 2

// Fix 2: IIFE to capture current value (pre-let pattern)
for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(() => console.log(j), 100);
  })(i);
}
// Prints: 0, 1, 2
```

## Practical Use: Counter Factory

A closure can maintain private state across calls:

```ts
function makeCounter(initial = 0) {
  let count = initial; // private — not accessible from outside

  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
    reset: () => { count = initial; },
  };
}

const counter = makeCounter(10);
counter.increment(); // 11
counter.increment(); // 12
counter.decrement(); // 11
counter.value();     // 11
counter.reset();
counter.value();     // 10
```

There is no way to directly access or modify `count` from outside `makeCounter`. The only way in is through the returned methods.

## Practical Use: Memoize

Closures make it straightforward to cache expensive computation results:

```ts
function memoize<T extends unknown[], R>(
  fn: (...args: T) => R
): (...args: T) => R {
  const cache = new Map<string, R>();

  return (...args: T): R => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const expensiveSqrt = memoize((n: number) => {
  console.log("computing...");
  return Math.sqrt(n);
});

expensiveSqrt(9);  // computing... → 3
expensiveSqrt(9);  // (cached)    → 3
```

## The Module Pattern

Before ES modules, closures were the only way to create truly private state in JavaScript. The **module pattern** returns an object whose methods close over private variables:

```ts
const bankAccount = (function () {
  let balance = 0; // private

  return {
    deposit(amount: number) { balance += amount; },
    withdraw(amount: number) {
      if (amount > balance) throw new Error("Insufficient funds");
      balance -= amount;
    },
    getBalance() { return balance; },
  };
})();

bankAccount.deposit(100);
bankAccount.withdraw(30);
bankAccount.getBalance(); // 70
// balance — not directly accessible
```

> [!TIP]
> Today you would achieve the same thing with ES modules (a file's top-level variables are private by default) or class private fields (`#balance`). But understanding the module pattern helps you read older codebases and deepens your mental model of closures.

## Further Learning

Search these terms to go deeper:
- **"You Don't Know JS: Scope & Closures"** — chapters on closures are especially thorough
- **"MDN: Closures"** — includes the classic loop counter gotcha with clear explanations
- **"JavaScript module pattern"** — Addy Osmani's "Learning JavaScript Design Patterns" covers this well
- **"JavaScript memoization"** — search for articles on caching strategies and memoize implementations
- **"JavaScript closure interview questions"** — good for testing your mental model against common puzzles
