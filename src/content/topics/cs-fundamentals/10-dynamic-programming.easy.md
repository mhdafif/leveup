---
title: Dynamic Programming
order: 10
estMinutes: 15
difficulty: easy
checklist:
  - Identify the two properties that make a problem suitable for DP
  - Explain the difference between memoization (top-down) and tabulation (bottom-up)
  - Convert the naive recursive Fibonacci to a memoized and then a tabulated solution
  - Solve the climbing stairs problem using both approaches
  - "Recognize the DP pattern: define the state, identify transitions, establish base cases"
  - Trace through a DP table for a small input by hand
---

**Dynamic programming** (DP) sounds scary but the idea is simple: if you keep solving the same little problem over and over, solve it *once* and write the answer down. It's the "don't do the same homework twice" technique. It turns some painfully slow solutions into fast ones.

## When DP applies

Look for two signs:

1. **Repeated subproblems** — a naive solution keeps recalculating the same things.
2. **Answers build on smaller answers** — the big answer is made from smaller answers.

Fibonacci is the poster child: `fib(5)` needs `fib(4)` and `fib(3)`, `fib(4)` needs `fib(3)` again... the same values get recomputed endlessly.

## Approach 1: remember as you go (memoization)

Write the natural recursion, but cache each answer the first time:

```ts
function fib(n, memo = new Map()) {
  if (n <= 1) return n
  if (memo.has(n)) return memo.get(n)   // already solved? reuse it
  const result = fib(n - 1, memo) + fib(n - 2, memo)
  memo.set(n, result)
  return result
}
```

This is "top-down": start at the big problem, cache along the way.

## Approach 2: build up a table (tabulation)

Or go "bottom-up": start from the smallest answers and fill a table forward:

```ts
function fib(n) {
  if (n <= 1) return n
  const dp = [0, 1]
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]   // each answer uses earlier ones
  }
  return dp[n]
}
```

Both turn the slow version into a fast O(n) one.

## A real example: climbing stairs

*You can climb 1 or 2 steps at a time. How many ways to reach step n?* It turns out to be Fibonacci in disguise — the ways to reach step `i` = ways to reach `i-1` plus ways to reach `i-2` (your last move was 1 step or 2 steps):

```ts
function climbStairs(n) {
  if (n <= 2) return n
  const dp = [0, 1, 2]
  for (let i = 3; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2]
  return dp[n]
}
```

## The recipe

Whenever you tackle a DP problem, answer three questions:

1. **What does each entry mean?** (e.g. `dp[i]` = ways to reach step i)
2. **How does it build on smaller entries?** (`dp[i] = dp[i-1] + dp[i-2]`)
3. **What are the starting values?** (`dp[1] = 1`, `dp[2] = 2`)

> [!IMPORTANT]
> The hard part is figuring out what each entry means and how it relates to smaller ones. Once you nail that, the code writes itself.

## In one sentence

Dynamic programming avoids redoing work by caching answers to repeated subproblems — either "top-down" with memoization or "bottom-up" by filling a table — turning slow recursive solutions fast.

## Want to go deeper?

Switch to **Expert** mode above for the space-optimized versions, memoization-vs-tabulation trade-offs, and the full DP framework.
