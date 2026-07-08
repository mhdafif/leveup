---
title: Merge Sort
order: 4
estMinutes: 15
difficulty: easy
checklist:
  - Explain the divide-and-conquer strategy in your own words
  - Trace through the split and merge steps for a small array
  - Understand why merge sort is O(n log n) intuitively
  - Implement merge sort in TypeScript
  - Explain what "stable sort" means and why merge sort qualifies
  - Compare merge sort to the O(n²) sorts from the previous lesson
---

**Merge sort** is the first *fast* sort you learn, and its idea is lovely: a big messy pile is hard to sort, but two *already-sorted* small piles are trivial to combine. So merge sort keeps splitting the list in half until each piece has one item (already "sorted"), then merges pieces back together in order.

## The strategy: divide and conquer

Three steps, repeated:

1. **Divide** — cut the list in half.
2. **Conquer** — sort each half (by splitting *them* in half, and so on).
3. **Combine** — merge two sorted halves into one sorted list.

The clever part is that merging two sorted lists is easy: just keep taking the smaller front item from the two.

## Seeing it work

```
[38, 27, 43, 3]
split → [38, 27]      [43, 3]
split → [38] [27]     [43] [3]
merge → [27, 38]      [3, 43]
merge → [3, 27, 38, 43]  ✅
```

## The code

```ts
function mergeSort(arr) {
  if (arr.length <= 1) return arr          // one item = already sorted
  const mid = Math.floor(arr.length / 2)
  const left = mergeSort(arr.slice(0, mid))
  const right = mergeSort(arr.slice(mid))
  return merge(left, right)
}

function merge(left, right) {
  const result = []
  let i = 0, j = 0
  while (i < left.length && j < right.length) {
    // take the smaller front item
    if (left[i] <= right[j]) result.push(left[i++])
    else result.push(right[j++])
  }
  return result.concat(left.slice(i)).concat(right.slice(j))
}
```

## Why it's fast: O(n log n)

Splitting in half repeatedly gives about **log n** levels (you can only halve a million ~20 times). Each level does about **n** work to merge everything. Multiply them: **n × log n**. That's dramatically better than the O(n²) sorts from the last lesson.

> [!TIP]
> O(n log n) is the best a general comparison sort can do — merge sort hits that sweet spot.

## Bonus: it's "stable"

Merge sort is **stable**: if two items are equal, they keep their original order. That matters when sorting records — e.g., sort people by first name, then by last name, and the first-name order survives among people who share a last name.

## In one sentence

Merge sort splits a list in half over and over until pieces are trivially sorted, then merges them back in order — giving fast, stable O(n log n) sorting.

## Want to go deeper?

Switch to **Expert** mode above for the full merge diagram, the O(n log n) proof, and merge sort's O(n) memory cost vs quicksort.
