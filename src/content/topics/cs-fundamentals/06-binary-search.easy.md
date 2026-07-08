---
title: Binary Search
order: 6
estMinutes: 12
difficulty: easy
checklist:
  - State the precondition for binary search (sorted input)
  - Explain how the search space halves with each comparison
  - Implement binary search iteratively in TypeScript
  - Implement binary search recursively in TypeScript
  - Identify and fix common off-by-one errors in the loop bounds
  - Solve 2 practice problems applying binary search to a real scenario
---

You're looking for a word in a dictionary. You don't read from page 1 — you flip to the middle, see if your word comes before or after, and throw away half the book. Repeat. That's **binary search**: by halving the search each step, it finds an item among a *billion* in about 30 checks.

## The one rule: the data must be sorted

Binary search only works on **sorted** data. That's the whole catch — on an unsorted list it gives wrong answers silently.

> [!IMPORTANT]
> Always make sure the list is sorted first. If you have to sort it yourself, that sorting costs O(n log n), which may cancel out binary search's speed advantage for a one-off lookup.

## How it works

1. Look at the **middle** item.
2. Is it your target? Done.
3. Is your target **smaller**? Throw away the right half; search the left.
4. Is it **bigger**? Throw away the left half; search the right.
5. Repeat until found (or nothing's left).

Each step deletes half the remaining items — that's why it's so fast.

## The code

```ts
function binarySearch(arr, target) {
  let low = 0
  let high = arr.length - 1

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    if (arr[mid] === target) return mid      // found it
    else if (arr[mid] < target) low = mid + 1  // go right
    else high = mid - 1                        // go left
  }
  return -1  // not found
}
```

## Watch the off-by-one bugs

Binary search is famous for tiny bugs in the boundaries. Two things to get right:

- Use `low <= high` (not `low < high`) so you still check the final single item.
- After checking `mid`, move *past* it: `low = mid + 1` or `high = mid - 1`. If you forget the `+1`/`-1`, you can loop forever.

> [!CAUTION]
> When unsure, test the one-item case in your head: if `low === high`, is there still an item to check? Yes — so the loop condition must be `<=`.

## In one sentence

Binary search finds an item in a **sorted** list by repeatedly checking the middle and throwing away the half that can't contain the target — turning a huge search into a handful of steps.

## Want to go deeper?

Switch to **Expert** mode above for the recursive version, the overflow-safe midpoint, and clever "binary search on the answer" applications.
