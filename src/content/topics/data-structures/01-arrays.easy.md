---
title: Arrays
order: 1
estMinutes: 10
difficulty: easy
checklist:
  - Understand contiguous memory layout
  - Know the Big-O of access, search, insert, and delete
  - Implement a dynamic array (resize on push)
  - Solve 3 practice problems
---

An **array** is an ordered list of items stored right next to each other in memory — like numbered lockers in a row. Because they're all the same size and side by side, the computer can jump straight to locker #7 instantly.

## Why arrays are fast (and where they're slow)

Since everything's in a neat row:

- **Grabbing item by its number is instant** — O(1). The computer does simple math to find its spot.
- **Adding/removing at the *end* is cheap** — you're not disturbing anything else.
- **Adding/removing at the *front* is slow** — O(n). Everything after it has to shuffle over to make room (or close the gap).

| Operation | Speed |
|---|---|
| Get item #i | O(1) — instant |
| Search for a value | O(n) — check each |
| Add/remove at end | O(1) — cheap |
| Add/remove at front | O(n) — everything shifts |

## Arrays that grow

Most languages (including JavaScript) give you arrays that grow automatically as you `push`. Under the hood, when they run out of room they quietly allocate a bigger chunk and copy everything over.

> [!NOTE]
> That copy is occasionally slow, but it happens rarely (the array usually *doubles* its size), so on average each `push` is still cheap — this is called "amortized O(1)."

> [!TIP]
> If you know how many items you'll have, create the array at that size up front to skip the resizing.

## In one sentence

An array stores items in a neat numbered row, so reading any item by index is instant and adding to the end is cheap — but adding/removing at the front is slow because everything has to shift.

## Want to go deeper?

Switch to **Expert** mode above for the memory-address math and a hand-built dynamic array that doubles its capacity.
