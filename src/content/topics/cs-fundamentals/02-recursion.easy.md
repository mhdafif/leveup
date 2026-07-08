---
title: Recursion
order: 2
estMinutes: 15
difficulty: easy
checklist:
  - Understand what makes a valid base case and why it's required
  - Trace through a recursive call stack by hand
  - Implement factorial and Fibonacci recursively in TypeScript
  - Explain memoization and apply it to eliminate redundant recursive calls
  - Identify when recursion is a natural fit vs when iteration is better
  - Solve 2 practice problems using recursive thinking
---

**Recursion** is when a function calls *itself* to solve a smaller piece of the same problem. Picture Russian nesting dolls: to open the biggest, you open the next, and the next — until you reach the tiny solid one that doesn't open. That tiny doll is the key to not looping forever.

## Every recursion needs two parts

1. **Base case** — the "stop here" condition that returns an answer without calling itself again (the solid doll).
2. **Recursive case** — calls itself with a *smaller* input, heading toward the base case.

Forget the base case (or fail to shrink the problem) and it calls itself forever — which crashes with a "stack overflow."

## A worked example: factorial

`4!` means `4 × 3 × 2 × 1`. Notice `4! = 4 × 3!` — the problem contains a smaller version of itself:

```ts
function factorial(n) {
  if (n <= 1) return 1        // base case: stop
  return n * factorial(n - 1) // recursive case: smaller problem
}
```

Tracing `factorial(4)`:

```
4 * factorial(3)
    3 * factorial(2)
        2 * factorial(1)
            1          ← base case reached
        = 2
    = 6
= 24
```

Each call waits for the smaller one to finish, then they resolve back up.

## The classic trap: repeated work

The Fibonacci sequence (`0, 1, 1, 2, 3, 5, 8...`) written naively is *correct* but painfully slow:

```ts
function fib(n) {
  if (n <= 1) return n
  return fib(n - 1) + fib(n - 2)  // recomputes the same values over and over
}
```

`fib(40)` makes over a *billion* calls because it keeps recalculating the same numbers.

## The fix: remember answers (memoization)

Store each result the first time you compute it, then reuse it:

```ts
function fib(n, memo = new Map()) {
  if (n <= 1) return n
  if (memo.has(n)) return memo.get(n)  // already known? reuse it
  const result = fib(n - 1, memo) + fib(n - 2, memo)
  memo.set(n, result)
  return result
}
```

This turns a hopeless calculation into an instant one — you never solve the same subproblem twice.

## When to reach for recursion

Recursion shines on things shaped like trees: folders inside folders, the page's HTML tree, nested menus. For simple "go through a big list" work, a plain loop is usually clearer and safer.

## In one sentence

Recursion solves a problem by calling itself on a smaller version until it hits a base case — great for tree-shaped data, but add memoization (a cache) when the same subproblems repeat.

## Want to go deeper?

Switch to **Expert** mode above for the call-stack mechanics, tail recursion, and why JavaScript prefers loops for very large inputs.
