---
title: Binary Search
order: 6
estMinutes: 20
difficulty: easy
checklist:
  - State the precondition for binary search (sorted input)
  - Explain how the search space halves with each comparison
  - Implement binary search iteratively in TypeScript
  - Implement binary search recursively in TypeScript
  - Identify and fix common off-by-one errors in the loop bounds
  - Solve 2 practice problems applying binary search to a real scenario
---

Binary search is one of the most important algorithms to have at your fingertips. It solves a deceptively simple problem — finding a value in a sorted collection — in O(log n) time by halving the search space with each comparison. That's the difference between searching through a billion sorted entries in roughly 30 comparisons vs up to a billion.

## The Precondition: Sorted Input

Binary search only works on **sorted** data. This seems obvious but is the single most common mistake: applying binary search to unsorted data produces wrong answers with no error.

> [!IMPORTANT]
> Always verify the input is sorted before applying binary search. If sorting is required first, the overall complexity becomes O(n log n), not O(log n).

## How It Works

Given a sorted array and a target value:
1. Look at the **middle element**.
2. If it equals the target, return its index.
3. If the target is **less than** the middle, search the **left half**.
4. If the target is **greater than** the middle, search the **right half**.
5. Repeat until found or the search space is empty.

## Iterative Implementation

```ts
function binarySearch(arr: number[], target: number): number {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    // Use Math.floor instead of (low + high) / 2 to avoid integer overflow
    // (in TypeScript/JS this isn't a practical concern, but it's good habit)
    const mid = low + Math.floor((high - low) / 2);

    if (arr[mid] === target) {
      return mid;       // found
    } else if (arr[mid] < target) {
      low = mid + 1;    // search right half
    } else {
      high = mid - 1;   // search left half
    }
  }

  return -1; // not found
}
```

## Recursive Implementation

```ts
function binarySearchRecursive(
  arr: number[],
  target: number,
  low = 0,
  high = arr.length - 1
): number {
  if (low > high) return -1; // base case: not found

  const mid = low + Math.floor((high - low) / 2);

  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return binarySearchRecursive(arr, target, mid + 1, high);
  return binarySearchRecursive(arr, target, low, mid - 1);
}
```

> [!NOTE]
> The iterative version is preferred in practice because it avoids the function call overhead and can't stack overflow. The recursive version is useful for understanding the algorithm's structure.

## Off-By-One Traps

Off-by-one errors are the #1 bug in binary search implementations. Here are the two critical choices:

| Decision | This code | Why |
|---|---|---|
| Loop condition | `low <= high` | We must check when `low === high` (one element left) |
| Left half update | `high = mid - 1` | `mid` is already checked, exclude it |
| Right half update | `low = mid + 1` | `mid` is already checked, exclude it |

If you write `low < high`, you'll miss the last element. If you write `high = mid`, you can get an infinite loop when `low === mid`.

> [!CAUTION]
> `while (low < high)` vs `while (low <= high)` — this single character causes hours of debugging. When in doubt, think through the single-element case: if `low === high`, is there still a valid element to check? Yes. So use `<=`.

## Binary Search in the Real World

Binary search isn't just for "find a number in an array." It generalizes to any problem where:
- You're searching over a **monotonic** space (answers go from false to true at some threshold)
- You can evaluate mid in O(1) or O(log n)

Common applications:
- Finding the first/last occurrence of a value
- Finding the insertion point for a value in sorted data (`Array.prototype` doesn't have this, but it's a classic interview question)
- Searching a sorted matrix
- Binary searching on the answer (e.g., "what's the minimum number of days to complete X?")

## Further Learning

Search these terms to go deeper:
- **"Binary search on the answer technique competitive programming"** — powerful generalization beyond simple array search
- **"Leetcode binary search explore card"** — structured practice problems from simple to advanced
- **"lower_bound upper_bound C++ STL binary search"** — first/last occurrence variants built into standard libraries
- **"Extra, Extra — Read All About It Nearly All Binary Searches Broken"** — classic blog post on the integer overflow trap
