---
title: Functional Patterns
order: 12
estMinutes: 30
difficulty: medium
checklist:
  - Define a pure function and explain why purity makes code easier to test
  - Apply immutability when working with objects and arrays
  - Compose two or more functions into a pipeline
  - Implement a curried function and explain why currying is useful
  - Write a partial application helper and describe how it differs from currying
  - Identify side effects in code and refactor them to the edges of a program
---

Functional programming (FP) is a style — not a strict discipline — that emphasises **pure functions**, **immutability**, and **composition**. JavaScript supports it natively. Applying FP patterns even partially leads to code that is easier to test, reason about, and refactor.

## Pure Functions

A function is **pure** if:
1. Given the same input, it always returns the same output
2. It has no side effects (does not modify anything outside itself)

```ts
// Impure — depends on and modifies external state
let count = 0;
function increment(): number {
  return ++count; // reading and writing external state
}

// Pure — depends only on its arguments
function increment(n: number): number {
  return n + 1;
}

// Impure — side effect: logs to console
function add(a: number, b: number): number {
  console.log(`Adding ${a} + ${b}`); // side effect
  return a + b;
}

// Pure
function add(a: number, b: number): number {
  return a + b;
}
```

> [!TIP]
> Pure functions are trivially unit-testable — call with input, check output, no setup or teardown needed. They are also cacheable (memoizable) and safe to run in parallel.

## Immutability

Instead of mutating data, create new data with the desired changes. JavaScript's spread syntax makes this ergonomic:

```ts
interface User {
  id: number;
  name: string;
  score: number;
}

const user: User = { id: 1, name: "Alice", score: 0 };

// Mutation — bad
user.score += 10; // original changed

// Immutable update — good
const updated = { ...user, score: user.score + 10 };

// Arrays
const tags = ["js", "ts"];
const withReact = [...tags, "react"];   // add
const withoutTs = tags.filter((t) => t !== "ts"); // remove
const renamed = tags.map((t) => t === "js" ? "javascript" : t); // update
```

> [!NOTE]
> For deeply nested structures, spread becomes verbose. Libraries like **Immer** let you write mutation-style code that is applied to a draft, producing a new immutable value.

## Function Composition

Composition means combining two or more functions so that the output of one feeds into the next. This replaces deeply nested function calls with a readable pipeline:

```ts
// Nested calls — hard to read (inside-out)
const result = trim(toUpperCase(stripPunctuation(input)));

// Compose — create a new function that applies left-to-right (pipe)
function pipe<T>(...fns: Array<(x: T) => T>): (x: T) => T {
  return (x: T) => fns.reduce((acc, fn) => fn(acc), x);
}

const transform = pipe(stripPunctuation, toUpperCase, trim);
transform("  hello, world!  "); // "HELLO WORLD"

// Or right-to-left (compose, mathematical convention)
function compose<T>(...fns: Array<(x: T) => T>): (x: T) => T {
  return (x: T) => fns.reduceRight((acc, fn) => fn(acc), x);
}
```

## Currying

**Currying** transforms a function that takes multiple arguments into a chain of single-argument functions. Each call returns a new function expecting the next argument:

```ts
// Normal function
function add(a: number, b: number): number {
  return a + b;
}

// Curried
function curriedAdd(a: number) {
  return function (b: number): number {
    return a + b;
  };
}

const add5 = curriedAdd(5);
add5(3);  // 8
add5(10); // 15

// Currying is useful for creating specialised functions from generic ones
const multiply = (a: number) => (b: number) => a * b;
const double = multiply(2);
const triple = multiply(3);

[1, 2, 3, 4].map(double); // [2, 4, 6, 8]
[1, 2, 3, 4].map(triple); // [3, 6, 9, 12]
```

## Partial Application

Partial application fixes some arguments of a function, returning a new function expecting the remaining ones. Unlike currying (which fixes one at a time), partial application can fix any number at once:

```ts
function partial<T extends unknown[], U extends unknown[], R>(
  fn: (...args: [...T, ...U]) => R,
  ...presetArgs: T
): (...remainingArgs: U) => R {
  return (...remainingArgs: U) => fn(...presetArgs, ...remainingArgs);
}

function request(method: string, url: string, body?: unknown): Promise<Response> {
  return fetch(url, { method, body: body ? JSON.stringify(body) : undefined });
}

const get = partial(request, "GET");
const post = partial(request, "POST");

get("/api/users");
post("/api/users", { name: "Alice" });
```

## Managing Side Effects

Side effects (I/O, network calls, state changes) are unavoidable. The FP approach is to **push them to the edges** — keep the core logic pure and call side-effecting functions only at the boundary.

```ts
// Impure core — hard to test
async function processOrders() {
  const orders = await db.query("SELECT * FROM orders"); // side effect
  const totals = orders.map((o) => o.price * o.quantity); // pure logic mixed in
  await db.execute("UPDATE summary SET total = ?", [sum(totals)]); // side effect
}

// Pure core, side effects at edges
function calculateTotals(orders: Order[]): number[] {
  return orders.map((o) => o.price * o.quantity); // pure — easily testable
}

function sum(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0); // pure
}

async function processOrders() {
  const orders = await db.query("SELECT * FROM orders"); // edge: input
  const total = sum(calculateTotals(orders));             // pure core
  await db.execute("UPDATE summary SET total = ?", [total]); // edge: output
}
```

> [!IMPORTANT]
> You do not need to go "fully functional" to benefit from these patterns. Even in an object-oriented or imperative codebase, preferring pure functions for data transformation and keeping side effects isolated significantly improves testability and readability.

## Further Learning

Search these terms to go deeper:
- **"Professor Frisby's Mostly Adequate Guide to Functional Programming"** — free online book using JavaScript; covers functors, monads, and more
- **"Composing Software" by Eric Elliott** — series of articles on Medium covering composition and FP patterns in JavaScript
- **"Immer library"** — practical immutability with a mutable-style API; widely used in React/Redux
- **"Ramda.js"** — a JS library built for FP: auto-curried, data-last functions designed for composition
- **"fp-ts"** — TypeScript library for strongly-typed functional patterns including Option, Either, Task
