---
title: Greedy Algorithms
order: 11
estMinutes: 30
difficulty: medium
checklist:
  - Define the greedy choice property in your own words
  - Explain the difference between greedy and dynamic programming approaches
  - Solve the coin change problem for "canonical" coin systems using a greedy algorithm
  - Explain why greedy coin change fails for non-standard coin sets
  - Trace through the activity selection problem by hand
  - Identify whether a given problem has optimal substructure + greedy choice
---

A greedy algorithm makes the locally optimal choice at each step, never looking back or reconsidering previous decisions. When it works, it's elegant and efficient — often O(n log n) with a sort step. The challenge is knowing *when* it works, because a greedy approach that looks right can produce subtly wrong answers.

## The Greedy Choice Property

A problem has the **greedy choice property** if a globally optimal solution can always be built by making the locally optimal (greedy) choice at each step. This is the key property you need to verify before committing to a greedy approach.

Combined with **optimal substructure** (same requirement as DP), a greedy algorithm is correct and usually faster than DP.

> [!NOTE]
> The difference between greedy and DP: greedy makes one irrevocable choice at each step. DP considers all choices and picks the best. Greedy is faster but only works on a subset of problems where the local choice is provably safe.

## Coin Change — When Greedy Works (and When It Doesn't)

**Problem:** Given coin denominations and a target amount, find the minimum number of coins.

### When greedy works: standard denominations (1, 5, 10, 25)

```ts
function coinChangeGreedy(coins: number[], amount: number): number {
  // Requires coins to be sorted descending
  const sorted = [...coins].sort((a, b) => b - a);
  let count = 0;
  let remaining = amount;

  for (const coin of sorted) {
    count += Math.floor(remaining / coin);
    remaining %= coin;
  }

  return remaining === 0 ? count : -1;
}

coinChangeGreedy([25, 10, 5, 1], 41);
// 25 + 10 + 5 + 1 = 41 → 4 coins ✓
```

### When greedy fails: non-standard denominations

```ts
// Coins: [1, 3, 4], target: 6
// Greedy: 4 + 1 + 1 = 3 coins
// Optimal: 3 + 3   = 2 coins ✗
```

> [!WARNING]
> Greedy coin change **only** works for coin systems where every larger denomination is a multiple of smaller ones (like US coins). For arbitrary denominations, you must use dynamic programming. This is one of the most common "trap" problems in interviews — make sure you know which approach to use.

## Activity Selection — A Classic Greedy Win

**Problem:** Given n activities with start and end times, select the maximum number of non-overlapping activities.

**Greedy strategy:** Always pick the activity that finishes earliest (among those compatible with already-chosen activities).

```ts
interface Activity {
  start: number;
  end: number;
  name: string;
}

function activitySelection(activities: Activity[]): Activity[] {
  // Sort by end time
  const sorted = [...activities].sort((a, b) => a.end - b.end);
  const selected: Activity[] = [];
  let lastEnd = -Infinity;

  for (const activity of sorted) {
    if (activity.start >= lastEnd) {
      selected.push(activity);
      lastEnd = activity.end;
    }
  }

  return selected;
}

const activities: Activity[] = [
  { start: 1,  end: 4,  name: "A" },
  { start: 3,  end: 5,  name: "B" },
  { start: 0,  end: 6,  name: "C" },
  { start: 5,  end: 7,  name: "D" },
  { start: 8,  end: 9,  name: "E" },
  { start: 5,  end: 9,  name: "F" },
];

activitySelection(activities);
// → [A, D, E]: finish at 4, 7, 9 — 3 activities (optimal)
```

**Why does "earliest end time" work?** Finishing earlier leaves the most remaining time for future activities. Any other selection of the first activity either uses the same or more future time, so it can never be better.

> [!TIP]
> To prove a greedy strategy is correct, use an **exchange argument**: assume an optimal solution doesn't make the greedy choice. Show that you can swap in the greedy choice without making the solution worse. This is the standard technique for greedy correctness proofs.

## More Greedy Algorithms You'll Encounter

| Problem | Greedy Strategy |
|---|---|
| Huffman encoding | Always merge the two lowest-frequency nodes |
| Minimum spanning tree (Kruskal's) | Always pick the cheapest edge that doesn't create a cycle |
| Dijkstra's shortest path | Always process the unvisited node with smallest known distance |
| Fractional knapsack | Always take the highest value-per-weight item first |
| Task scheduling (minimize lateness) | Sort tasks by deadline |

> [!IMPORTANT]
> The 0/1 knapsack (where you can't take fractions) is **not** solvable with greedy — it requires dynamic programming. The fractional knapsack (where you can take partial items) **is** solvable with greedy. This distinction is a classic interview question.

## Greedy vs DP Decision Guide

Ask these questions in order:
1. Can I prove the greedy choice property? (exchange argument)
2. Does the problem have optimal substructure?
3. If both: use greedy — simpler and faster
4. If only optimal substructure: use DP
5. If neither: try brute force, backtracking, or problem reformulation

## Further Learning

Search these terms to go deeper:
- **"Greedy algorithm correctness proof exchange argument"** — how to rigorously verify a greedy strategy
- **"Huffman coding greedy algorithm compression"** — real application of greedy in data compression
- **"Kruskal Prim minimum spanning tree"** — two greedy approaches to a famous graph problem
- **"Interval scheduling greedy problems leetcode"** — practice set for activity-selection-style problems
- **"Fractional vs 0/1 knapsack comparison"** — the canonical example of when greedy works vs when it doesn't
