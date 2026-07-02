---
title: Big-O Notation
order: 1
estMinutes: 25
difficulty: easy
checklist:
  - Understand what Big-O measures and why it matters
  - "Know the common complexity classes: O(1), O(log n), O(n), O(n log n), O(n²)"
  - Identify the time complexity of a given code snippet
  - Understand space complexity vs time complexity
  - Apply the rules for dropping constants and lower-order terms
  - Solve 3 practice problems classifying algorithm complexity
---

Big-O notation is the standard language engineers use to describe how an algorithm's runtime or memory usage grows as the input size grows. It doesn't tell you how many milliseconds something takes — it tells you the *shape* of growth. An O(n) algorithm that takes 1 ms for 1,000 items will take roughly 1,000 ms for 1,000,000 items. An O(n²) algorithm that takes 1 ms for 1,000 items will take roughly 1,000,000 ms for the same input. That difference is what Big-O captures.

## Why "Big-O"?

The "O" stands for "Order of" — as in, the order of magnitude of growth. We always analyze the **worst case** unless stated otherwise, and we drop constants and lower-order terms because we only care about behavior at large scale.

Rules:
1. **Drop constants** — O(2n) → O(n)
2. **Drop lower-order terms** — O(n² + n) → O(n²)
3. **Different inputs get different variables** — a loop over array A and a loop over array B is O(a + b), not O(n)

> [!NOTE]
> Big-O describes an upper bound on growth. Technically O(n) is also O(n²), but we always use the tightest bound that's accurate.

## Common Complexity Classes

| Complexity | Name | Example |
|---|---|---|
| O(1) | Constant | Array index lookup, hash map get |
| O(log n) | Logarithmic | Binary search, balanced BST lookup |
| O(n) | Linear | Single loop over input |
| O(n log n) | Linearithmic | Merge sort, heap sort |
| O(n²) | Quadratic | Nested loops over same input |
| O(2ⁿ) | Exponential | Recursive Fibonacci (naive) |
| O(n!) | Factorial | Generating all permutations |

## Code Comparison

```ts
// O(1) — constant time, no matter how big `arr` is
function getFirst(arr: number[]): number {
  return arr[0];
}

// O(n) — visits every element once
function linearSearch(arr: number[], target: number): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

// O(n²) — nested loop, each element paired with every other
function hasDuplicate(arr: number[]): boolean {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}

// O(n) — same duplicate check but using a Set
function hasDuplicateFast(arr: number[]): boolean {
  const seen = new Set<number>();
  for (const num of arr) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}
```

> [!TIP]
> When you see a nested loop, your first instinct should be O(n²) — but double check whether the inner loop shrinks based on the outer index. Loops with different bounds (`i` to `n`, `j` to `i`) are still O(n²) on average.

## Space Complexity

Space complexity follows the same notation but measures memory allocation instead of time. The `hasDuplicateFast` function above is O(n) in space (the Set grows with input) whereas `hasDuplicate` is O(1) in space (no extra data structures). There is often a time-space tradeoff: you can speed things up by using more memory, or save memory by doing more work.

> [!IMPORTANT]
> Space complexity counts **extra** space used by your algorithm, not the space for the input itself (which is already given).

## Further Learning

Search these terms to go deeper:
- **"Big-O cheat sheet bigocheatsheet.com"** — quick reference table of common algorithms and data structures
- **"CS50 asymptotic notation lecture"** — Harvard's clear visual walkthrough with growing animations
- **"Big-O notation practice problems geeksforgeeks"** — exercises to classify code snippets
- **"CLRS Introduction to Algorithms chapter 3"** — the definitive textbook treatment of asymptotic notation
- **"Back to Back SWE Big-O YouTube"** — well-paced video covering all the major complexity classes
