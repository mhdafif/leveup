---
title: Dynamic Programming
order: 10
estMinutes: 45
difficulty: hard
checklist:
  - Identify the two properties that make a problem suitable for DP
  - Explain the difference between memoization (top-down) and tabulation (bottom-up)
  - Convert the naive recursive Fibonacci to a memoized and then a tabulated solution
  - Solve the climbing stairs problem using both approaches
  - "Recognize the DP pattern: define the state, identify transitions, establish base cases"
  - Trace through a DP table for a small input by hand
---

Dynamic programming (DP) is a technique for solving problems by breaking them into overlapping subproblems, solving each subproblem once, and storing the result to avoid redundant computation. It sounds abstract, but the core insight is practical: if a recursive solution recomputes the same inputs over and over, caching those results can transform exponential time into polynomial time.

## The Two Required Properties

A problem is suitable for DP when it has:

1. **Overlapping subproblems** — the same smaller problem is solved multiple times in a naive recursive approach (unlike divide-and-conquer, where subproblems are independent)
2. **Optimal substructure** — the optimal solution to the whole problem can be built from optimal solutions to its subproblems

> [!NOTE]
> Optimal substructure is why DP works for shortest paths (Dijkstra, Bellman-Ford) but not for longest paths in general graphs — longest paths don't have optimal substructure.

## Top-Down DP: Memoization

Memoization takes a recursive solution and adds a cache. You write the recursion naturally, then save each result before returning it. On future calls with the same input, return the cached value immediately.

### Fibonacci with Memoization

```ts
function fibMemo(n: number, memo: Map<number, number> = new Map()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;

  const result = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, result);
  return result;
}

// Complexity: O(n) time, O(n) space
// Each value from 0 to n is computed exactly once
```

The call tree transforms from an exponential bush into a linear chain of unique computations.

## Bottom-Up DP: Tabulation

Tabulation solves subproblems iteratively, starting from the smallest and building up to the answer. No recursion — you fill a table (array) in a defined order.

### Fibonacci with Tabulation

```ts
function fibTable(n: number): number {
  if (n <= 1) return n;

  const dp: number[] = new Array(n + 1).fill(0);
  dp[0] = 0;
  dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}

// Space optimization: we only need the last two values
function fibOptimized(n: number): number {
  if (n <= 1) return n;
  let prev2 = 0, prev1 = 1;

  for (let i = 2; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }

  return prev1;
}
// O(n) time, O(1) space
```

> [!TIP]
> When you spot that the DP table only depends on the previous 1–2 rows/cells, you can reduce space from O(n) to O(1). This space optimization is a common interview follow-up.

## The Three-Step DP Framework

1. **Define the state** — what does `dp[i]` represent? Be precise. For Fibonacci: `dp[i]` = the i-th Fibonacci number.
2. **Write the recurrence (transition)** — how does `dp[i]` relate to smaller subproblems? `dp[i] = dp[i-1] + dp[i-2]`
3. **Establish base cases** — what are the smallest inputs you can answer directly without recursion? `dp[0] = 0`, `dp[1] = 1`

## Climbing Stairs Problem

**Problem:** You're climbing stairs with n steps. You can climb 1 or 2 steps at a time. How many distinct ways can you reach the top?

This is Fibonacci in disguise.

**State:** `dp[i]` = number of ways to reach step i
**Recurrence:** `dp[i] = dp[i-1] + dp[i-2]` (you got here from step i-1 or step i-2)
**Base cases:** `dp[1] = 1` (one way: one step), `dp[2] = 2` (two ways: 1+1 or 2)

```ts
function climbStairs(n: number): number {
  if (n <= 2) return n;

  const dp: number[] = new Array(n + 1).fill(0);
  dp[1] = 1;
  dp[2] = 2;

  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}

// Tracing for n=5:
// dp[1]=1, dp[2]=2, dp[3]=3, dp[4]=5, dp[5]=8
```

| Step | dp[i] | Reasoning |
|---|---|---|
| 1 | 1 | {1} |
| 2 | 2 | {1,1}, {2} |
| 3 | 3 | {1,1,1}, {1,2}, {2,1} |
| 4 | 5 | 3 ways ending in 1-step + 2 ways ending in 2-step |
| 5 | 8 | 5 ways ending in 1-step + 3 ways ending in 2-step |

> [!IMPORTANT]
> The hardest part of DP is defining the state correctly. Once you have a clean state definition and a correct recurrence, the implementation is almost mechanical. Spend most of your time on the state and recurrence — code comes last.

## Memoization vs Tabulation at a Glance

| | Memoization (top-down) | Tabulation (bottom-up) |
|---|---|---|
| **How** | Recursion + cache | Iterative table fill |
| **Order** | Computed on-demand | Computed in dependency order |
| **Stack** | Uses call stack — can overflow | No stack risk |
| **Space** | Often only computes needed states | Fills entire table |
| **Easier when** | The recurrence is natural as recursion | You know the fill order up front |

> [!CAUTION]
> Memoization with deep recursion (n > ~10,000) will stack overflow in JavaScript. Switch to tabulation for large inputs.

## Further Learning

Search these terms to go deeper:
- **"Dynamic programming patterns competitive programming"** — taxonomy of DP problem types (knapsack, LCS, LIS, etc.)
- **"Leetcode DP explore card"** — structured progression from easy to hard DP problems
- **"0/1 knapsack problem dynamic programming"** — the canonical 2D DP problem that covers most of the core thinking
- **"Longest common subsequence DP table visualization"** — excellent for understanding 2D DP table fills
- **"Atcoder educational DP contest"** — 26 well-categorized DP problems covering all common patterns
