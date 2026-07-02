---
title: Recursion
order: 2
estMinutes: 30
difficulty: medium
checklist:
  - Understand what makes a valid base case and why it's required
  - Trace through a recursive call stack by hand
  - Implement factorial and Fibonacci recursively in TypeScript
  - Explain memoization and apply it to eliminate redundant recursive calls
  - Identify when recursion is a natural fit vs when iteration is better
  - Solve 2 practice problems using recursive thinking
---

Recursion is when a function calls itself to solve a smaller version of the same problem. Done right, it turns complex problems into elegant, readable solutions. Done wrong, it causes stack overflows and exponential slowdowns. The key is understanding *why* it works and how to control it.

## The Two Required Pieces

Every correct recursive function has exactly two things:

1. **Base case** — the condition where the function stops and returns a value directly, without calling itself again.
2. **Recursive case** — the step where the function calls itself with a *smaller* or *simpler* input, moving toward the base case.

If you're missing the base case, you get infinite recursion. If your recursive case doesn't actually shrink the problem, you get infinite recursion. Both crash with a stack overflow.

> [!WARNING]
> JavaScript and TypeScript have a call stack limit (typically around 10,000–15,000 frames). Recursion on very large inputs will hit this limit. Always ask: could this be a loop instead?

## Factorial Example

The factorial of n (written n!) is n × (n−1) × (n−2) × … × 1. By definition, 0! = 1.

```ts
function factorial(n: number): number {
  // Base case
  if (n <= 1) return 1;
  // Recursive case: n! = n × (n-1)!
  return n * factorial(n - 1);
}

// factorial(4) calls:
//   4 * factorial(3)
//     3 * factorial(2)
//       2 * factorial(1)
//         1   ← base case
//       2 * 1 = 2
//     3 * 2 = 6
//   4 * 6 = 24
```

## Fibonacci and the Problem with Naive Recursion

The Fibonacci sequence is defined as: F(0) = 0, F(1) = 1, F(n) = F(n−1) + F(n−2).

```ts
// Naive — O(2^n) time due to redundant calls
function fib(n: number): number {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
```

This is correct but catastrophically slow. `fib(40)` makes over a billion recursive calls because it recomputes the same subproblems repeatedly.

## Memoization: Caching Recursive Results

Memoization stores the result of each call so we never compute the same value twice.

```ts
function fibMemo(n: number, memo: Map<number, number> = new Map()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;

  const result = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, result);
  return result;
}
// Now O(n) time and O(n) space — each value computed exactly once
```

> [!NOTE]
> Memoization is the bridge between recursion and dynamic programming. If a recursive solution has overlapping subproblems, add a cache and you've written a top-down DP solution.

## The Call Stack

Each function call pushes a **stack frame** onto the call stack, which holds that call's local variables and return address. When the function returns, the frame is popped. Recursion builds a chain of frames that unwind once the base case is reached.

```
Call stack for factorial(3):
┌─────────────────┐  ← top (most recent)
│ factorial(1)    │
├─────────────────┤
│ factorial(2)    │
├─────────────────┤
│ factorial(3)    │
└─────────────────┘  ← bottom (first call)
```

## Tail Recursion

A function is **tail recursive** when the recursive call is the very last operation — no work happens after it returns. Some languages and runtimes optimize tail calls to avoid growing the stack. JavaScript does not reliably perform this optimization, so in JS/TS, prefer iteration for large inputs even when the recursive form is elegant.

> [!TIP]
> Think of recursion as a natural fit for problems with a tree-like structure (file systems, DOM trees, nested data) where the depth is bounded and reasonable. For large linear problems (summing a million items), use a loop.

## Further Learning

Search these terms to go deeper:
- **"Recursion CS50 lecture David Malan"** — intuitive visual explanation with live tracing
- **"The Recurse Book by Eric Roberts"** — gentle introduction focused on problem-solving patterns
- **"Tail call optimization JavaScript MDN"** — details on what JS actually optimizes (and what it doesn't)
- **"Recursion practice problems leetcode easy"** — hands-on problems to build pattern recognition
