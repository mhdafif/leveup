---
title: Quick Sort
order: 5
estMinutes: 30
difficulty: medium
checklist:
  - Explain what a pivot is and what partitioning does
  - Trace through one partition step for a small array
  - Understand why average case is O(n log n) but worst case is O(n²)
  - Describe strategies for choosing a good pivot
  - Implement quick sort in TypeScript
  - Compare quick sort and merge sort across time, space, and stability
---

Quick sort is one of the fastest sorting algorithms in practice, despite having the same O(n log n) average case as merge sort. Its advantage is that it sorts **in-place** (O(log n) stack space vs merge sort's O(n)), which means better cache performance and lower memory overhead. It's the algorithm behind most standard library sort implementations, including C's `qsort`.

## The Core Idea: Partitioning

Quick sort works by selecting a **pivot** element and **partitioning** the array so that:
- All elements less than the pivot are to its left
- All elements greater than the pivot are to its right
- The pivot is now in its final sorted position

Then quick sort recursively applies the same process to the left and right sub-arrays.

```ts
function quickSort(arr: number[], low = 0, high = arr.length - 1): number[] {
  if (low < high) {
    const pivotIdx = partition(arr, low, high);
    quickSort(arr, low, pivotIdx - 1);   // sort left of pivot
    quickSort(arr, pivotIdx + 1, high);  // sort right of pivot
  }
  return arr;
}

function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high]; // choose last element as pivot
  let i = low - 1;         // index of the smaller element boundary

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]]; // swap into the left partition
    }
  }

  // Place pivot in its final position
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}
```

> [!NOTE]
> The `partition` function above is the **Lomuto partition scheme** — straightforward to understand. The **Hoare partition scheme** is an older, slightly faster alternative that uses two pointers moving toward each other.

## Tracing a Partition

Given `[3, 6, 8, 10, 1, 2, 1]` with pivot = `1` (last element):

```
Initial:   [3, 6, 8, 10, 1, 2, | 1]  pivot=1, i=-1
j=0: 3>1, skip
j=1: 6>1, skip
j=2: 8>1, skip
j=3: 10>1, skip
j=4: 1≤1, swap → [1, 6, 8, 10, 3, 2, | 1]  i=0
j=5: 2>1, skip
Place pivot: [1, 1, 8, 10, 3, 2, 6]
Pivot index: 1 ✓  (1 is in its final position)
```

## Average vs Worst Case

| Case | When it happens | Time |
|---|---|---|
| Best | Pivot always splits exactly in half | O(n log n) |
| Average | Random pivot on random data | O(n log n) |
| Worst | Pivot is always the min or max element | O(n²) |

The worst case happens when the array is already sorted and you always pick the last (or first) element as the pivot — the partition produces one sub-array of size n−1 and one of size 0 every time.

> [!WARNING]
> Never use a naive quick sort (last-element pivot) on data that might already be sorted. You'll get O(n²) behavior. Use random pivot selection or the median-of-three strategy.

## Pivot Selection Strategies

1. **Last element** — simple, terrible on sorted input
2. **Random element** — avoids worst case on sorted input, O(n log n) expected
3. **Median of three** — take the median of first, middle, and last elements; excellent in practice

```ts
function randomizedPartition(arr: number[], low: number, high: number): number {
  const randIdx = low + Math.floor(Math.random() * (high - low + 1));
  [arr[randIdx], arr[high]] = [arr[high], arr[randIdx]]; // swap to end
  return partition(arr, low, high);
}
```

## Quick Sort vs Merge Sort

| Dimension | Quick Sort | Merge Sort |
|---|---|---|
| Average Time | O(n log n) | O(n log n) |
| Worst Time | O(n²) | O(n log n) |
| Space | O(log n) stack | O(n) auxiliary |
| Stable | No | Yes |
| Cache behavior | Excellent | Good |
| In-place | Yes | No (standard) |

> [!TIP]
> For general-purpose sorting, quick sort wins in practice due to cache locality and in-place operation. When you need guaranteed worst-case performance or stability (sorting already-meaningful records), choose merge sort.

## Further Learning

Search these terms to go deeper:
- **"Lomuto vs Hoare partition scheme"** — detailed comparison of the two main partition approaches
- **"Randomized quicksort expected time analysis"** — probability argument for O(n log n) expected runtime
- **"Introsort hybrid sort C++ STL"** — how C++ combines quicksort, heapsort, and insertion sort for best-of-all-worlds performance
- **"Back to Back SWE quicksort YouTube"** — visual walkthrough with partition tracing
- **"CLRS chapter 7 quicksort"** — full formal analysis including average-case expected time
