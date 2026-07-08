---
title: Big-O Notation
order: 1
estMinutes: 15
difficulty: easy
checklist:
  - Understand what Big-O measures and why it matters
  - "Know the common complexity classes: O(1), O(log n), O(n), O(n log n), O(n²)"
  - Identify the time complexity of a given code snippet
  - Understand space complexity vs time complexity
  - Apply the rules for dropping constants and lower-order terms
  - Solve 3 practice problems classifying algorithm complexity
---

Imagine two ways to find a friend's name in a phone book. One: read every name from the start. Two: flip to the middle, decide which half to keep, repeat. For a 10-name book both feel instant — but for a million names, one takes forever and the other takes ~20 flips. **Big-O** is how we describe that difference: not how *fast* code is, but how its work *grows* as the input gets bigger.

## What Big-O is really saying

Big-O answers: "If I give this code 10× more data, how much more work does it do?" That's what matters — code that's fine with 100 items can freeze with 100,000 if it grows badly.

## The classes you'll actually meet

From best to worst:

| Big-O | Nickname | Feels like | Example |
|---|---|---|---|
| O(1) | Constant | Instant, always | Grabbing `arr[0]` |
| O(log n) | Logarithmic | Barely grows | Binary search (halving) |
| O(n) | Linear | Grows steadily | Looping through a list once |
| O(n log n) | — | A bit worse than linear | Good sorting algorithms |
| O(n²) | Quadratic | Grows painfully | A loop inside a loop |

Rough intuition: **O(1)** never cares about size, **O(n)** doubles when the data doubles, and **O(n²)** *quadruples* when the data doubles — that's the danger zone.

## Reading it in code

```ts
// O(1) — one step, no matter the size
function first(arr) { return arr[0] }

// O(n) — looks at each item once
function search(arr, target) {
  for (const x of arr) if (x === target) return true
  return false
}

// O(n²) — a loop inside a loop → work explodes
function hasDuplicate(arr) {
  for (let i = 0; i < arr.length; i++)
    for (let j = i + 1; j < arr.length; j++)
      if (arr[i] === arr[j]) return true
  return false
}
```

> [!TIP]
> See a loop inside a loop over the same data? That's almost always O(n²) — a red flag for large inputs. There's often a faster O(n) way (like using a `Set` to spot duplicates).

## Time vs. space

Big-O also describes **memory** (space complexity), not just speed. Sometimes you can trade one for the other: use extra memory (a lookup table) to go faster, or use less memory by doing more work.

## The two simplification rules

1. **Ignore constants:** O(2n) is just O(n). We care about the shape, not exact counts.
2. **Keep only the biggest term:** O(n² + n) is just O(n²), because at large sizes the n² dwarfs everything.

## In one sentence

Big-O describes how an algorithm's work grows with input size — aim for O(1), O(log n), or O(n), and be suspicious of nested loops that make it O(n²).

## Want to go deeper?

Switch to **Expert** mode above for the full complexity table (including O(2ⁿ) and O(n!)), worst-case analysis, and more code comparisons.
