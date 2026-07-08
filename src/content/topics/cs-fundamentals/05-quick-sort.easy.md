---
title: Quick Sort
order: 5
estMinutes: 15
difficulty: easy
checklist:
  - Explain what a pivot is and what partitioning does
  - Trace through one partition step for a small array
  - Understand why average case is O(n log n) but worst case is O(n²)
  - Describe strategies for choosing a good pivot
  - Implement quick sort in TypeScript
  - Compare quick sort and merge sort across time, space, and stability
---

**Quick sort** is one of the fastest sorts in real life. Its trick: pick one item (the **pivot**), then shove everything smaller to its left and everything bigger to its right. Now the pivot is in its final spot, and you repeat the same trick on each side.

## The core move: partitioning

"Partitioning" just means splitting around the pivot:

- Everything **smaller** than the pivot goes left.
- Everything **bigger** goes right.
- The pivot lands exactly where it belongs.

Then quick sort does the same thing to the left group and the right group, again and again, until everything's sorted.

## The code

```ts
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const p = partition(arr, low, high)  // pivot's final spot
    quickSort(arr, low, p - 1)           // sort the left group
    quickSort(arr, p + 1, high)          // sort the right group
  }
  return arr
}

function partition(arr, low, high) {
  const pivot = arr[high]  // use the last item as pivot
  let i = low - 1
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++
      [arr[i], arr[j]] = [arr[j], arr[i]]  // move smaller items left
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]  // drop pivot in place
  return i + 1
}
```

## The catch: pick a good pivot

Usually quick sort splits things roughly in half each time → fast **O(n log n)**. But if you keep picking a bad pivot (like always the biggest item), the split is lopsided and it degrades to slow **O(n²)**.

> [!WARNING]
> Always picking the last item as pivot is terrible on already-sorted data — it hits the O(n²) worst case. Real implementations pick a **random** pivot (or the median of a few) to avoid this.

## Quick sort vs merge sort

| | Quick sort | Merge sort |
|---|---|---|
| Usual speed | O(n log n) | O(n log n) |
| Worst case | O(n²) | O(n log n) |
| Extra memory | Very little | Needs O(n) extra |
| Stable? | No | Yes |

> [!TIP]
> Quick sort usually wins in practice because it sorts in place (barely any extra memory) and plays nicely with the CPU. Reach for merge sort when you need guaranteed speed or stable ordering.

## In one sentence

Quick sort picks a pivot, pushes smaller items left and bigger ones right, and repeats on each side — very fast on average, but pick a random pivot to avoid the O(n²) worst case.

## Want to go deeper?

Switch to **Expert** mode above for a full partition trace, pivot strategies (median-of-three), and the detailed quick-vs-merge comparison.
