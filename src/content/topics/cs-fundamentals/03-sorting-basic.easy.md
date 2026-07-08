---
title: Bubble, Selection & Insertion Sort
order: 3
estMinutes: 15
difficulty: easy
checklist:
  - Trace through one full pass of bubble sort by hand
  - Explain how selection sort selects and places each element
  - Describe how insertion sort builds the sorted portion incrementally
  - Compare the time and space complexity of all three algorithms
  - Identify which algorithm suits nearly-sorted data
  - Implement insertion sort in TypeScript from memory
---

Before the fast, clever sorting algorithms, it helps to meet three simple ones. They're slow on big lists, but they're easy to picture — and each mirrors a way you'd sort things by hand. All three are **O(n²)** (a loop inside a loop), so they're for learning and small lists.

## Bubble sort — swap neighbors

Walk through the list comparing each pair of neighbors, swapping them if they're in the wrong order. Big values slowly "bubble" to the end. Repeat until no swaps are needed.

```ts
function bubbleSort(arr) {
  const a = [...arr]
  for (let i = 0; i < a.length; i++) {
    let swapped = false
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]]  // swap
        swapped = true
      }
    }
    if (!swapped) break  // already sorted — stop early
  }
  return a
}
```

## Selection sort — find the smallest, place it

Scan the whole unsorted part to find the smallest value, then put it at the front. Repeat with the rest. It's like laying out cards by repeatedly picking the lowest.

```ts
function selectionSort(arr) {
  const a = [...arr]
  for (let i = 0; i < a.length; i++) {
    let min = i
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[min]) min = j
    }
    [a[i], a[min]] = [a[min], a[i]]
  }
  return a
}
```

## Insertion sort — like sorting cards in your hand

This is the one you actually do in real life. Take each new card and slide it left until it's in the right spot among the cards you've already sorted:

```ts
function insertionSort(arr) {
  const a = [...arr]
  for (let i = 1; i < a.length; i++) {
    const key = a[i]
    let j = i - 1
    while (j >= 0 && a[j] > key) {  // slide bigger items right
      a[j + 1] = a[j]
      j--
    }
    a[j + 1] = key  // drop the card into place
  }
  return a
}
```

> [!TIP]
> Insertion sort is genuinely useful for small or nearly-sorted lists — it's fast when the data is already close to sorted. Real sorting libraries even use it for small chunks internally.

## Quick comparison

| Algorithm | Best case | Typical | Good for |
|---|---|---|---|
| Bubble | O(n) | O(n²) | teaching |
| Selection | O(n²) | O(n²) | when writes are costly |
| Insertion | O(n) | O(n²) | small / nearly-sorted lists |

> [!IMPORTANT]
> None of these are good for big, jumbled lists. For those, use merge sort or quicksort — the next two lessons.

## In one sentence

Bubble sort swaps neighbors, selection sort repeatedly grabs the smallest, and insertion sort slides each item into place like sorting cards — all simple, all O(n²), best kept for small or nearly-sorted lists.

## Want to go deeper?

Switch to **Expert** mode above for the full complexity table, the meaning of "stable" sorting, and where each one is used in practice.
