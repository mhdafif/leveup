---
title: Greedy Algorithms
order: 11
estMinutes: 15
difficulty: easy
checklist:
  - Define the greedy choice property in your own words
  - Explain the difference between greedy and dynamic programming approaches
  - Solve the coin change problem for "canonical" coin systems using a greedy algorithm
  - Explain why greedy coin change fails for non-standard coin sets
  - Trace through the activity selection problem by hand
  - Identify whether a given problem has optimal substructure + greedy choice
---

A **greedy algorithm** always grabs the best-looking option *right now*, without worrying about the future. It's how you make change: reach for the biggest coin that fits, repeat. When this "best-for-now" strategy happens to give the best overall answer, greedy is wonderfully simple and fast. The catch is knowing *when* it actually works.

## Making change: greedy in action

To make 41¢ with coins [25, 10, 5, 1], grab the biggest that fits each time:

```ts
function coinChange(coins, amount) {
  const sorted = [...coins].sort((a, b) => b - a)  // biggest first
  let count = 0, left = amount
  for (const coin of sorted) {
    count += Math.floor(left / coin)   // take as many as fit
    left %= coin
  }
  return left === 0 ? count : -1
}
// 25 + 10 + 5 + 1 = 41 → 4 coins ✅
```

## Where greedy goes wrong

Greedy doesn't always win. With weird coins [1, 3, 4] making 6:

- Greedy grabs 4, then 1, then 1 → **3 coins**.
- But 3 + 3 → **2 coins** is better!

Greedy took the shiny 4 and missed the smarter combo.

> [!WARNING]
> Greedy coin change only works for "nice" coin systems (like real money, where each coin is a clean multiple of smaller ones). For arbitrary coins, you need dynamic programming instead. This is a classic interview trap.

## When greedy shines: picking activities

*Given events with start/end times, how many non-overlapping ones can you attend?* Greedy nails this: **always pick the event that ends earliest**, then the next one that starts after it, and so on.

```ts
function selectActivities(activities) {
  const sorted = [...activities].sort((a, b) => a.end - b.end)  // earliest finish first
  const chosen = []
  let lastEnd = -Infinity
  for (const a of sorted) {
    if (a.start >= lastEnd) {   // doesn't overlap
      chosen.push(a)
      lastEnd = a.end
    }
  }
  return chosen
}
```

Why does "finish earliest" work? Ending sooner leaves the most time for more events — a locally smart choice that also happens to be globally best.

## Greedy vs dynamic programming

- **Greedy** commits to one choice at each step and never reconsiders. Fast, but only correct for certain problems.
- **DP** considers all the options and picks the best. Slower, but works on more problems.

The skill is recognizing which one a problem needs. When in doubt (like weird coin sets), reach for DP.

## In one sentence

A greedy algorithm always takes the best immediate option — fast and elegant when the local choice is provably safe (like picking earliest-finishing events), but wrong for cases like odd coin systems, where dynamic programming is needed.

## Want to go deeper?

Switch to **Expert** mode above for the greedy-choice property, exchange-argument proofs, and famous greedy algorithms (Huffman, Dijkstra, Kruskal).
