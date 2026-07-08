---
title: Bonus · CS Fundamentals for Frontend
order: 6
estMinutes: 10
difficulty: easy
checklist:
  - Predict the performance difference between O(n) and O(n²) for an input of 10,000 items
  - Explain why JavaScript's Array.sort() matters and what its time complexity is
  - Trace a recursive function call by hand and identify its base case and recursive case
  - Describe the DOM as a tree and explain how a browser renders it
  - Use BFS or DFS mentally to solve a DOM traversal problem without looking up the algorithm
  - Complete all CS Fundamentals topic lessons and all Data Structures topic lessons
---

## Why bother with CS as a frontend dev?

A lot of people think frontend developers don't need computer science. You *can* build great things without it — but CS fundamentals give you a toolkit for reasoning about your code when things get slow or weird.

Think about these real situations:

- Why does filtering and mapping over 50,000 items make the page stutter? → **Big-O**.
- Why does walking a deeply nested object sometimes crash the tab? → **recursion**.
- Why is the DOM structured the way it is? → it's a **tree**.

These are CS questions wearing frontend clothes. Knowing the basics means you can look at a nested loop and immediately think "uh oh," or treat the DOM as a data structure instead of a black box.

This is a **bonus** phase — do the main ones first. But it's what takes you from "developer who writes React" to "engineer who understands systems."

## What to study in this phase

- [→ **CS Fundamentals** › Big-O Notation](/topics/cs-fundamentals/big-o)
- [→ **CS Fundamentals** › Recursion](/topics/cs-fundamentals/recursion)
- [→ **CS Fundamentals** › Bubble, Selection & Insertion Sort](/topics/cs-fundamentals/sorting-basic)
- [→ **CS Fundamentals** › Merge Sort](/topics/cs-fundamentals/merge-sort)
- [→ **CS Fundamentals** › Quick Sort](/topics/cs-fundamentals/quick-sort)
- [→ **CS Fundamentals** › Stacks & Queues](/topics/cs-fundamentals/stacks-queues)
- [→ **CS Fundamentals** › Trees & Binary Search Trees](/topics/cs-fundamentals/trees-bst)
- [→ **CS Fundamentals** › BFS & DFS](/topics/cs-fundamentals/bfs-dfs)
- [→ **Data Structures** › Arrays](/topics/data-structures/arrays)
- [→ **Data Structures** › Linked Lists](/topics/data-structures/linked-lists)
- [→ **Data Structures** › Hash Tables](/topics/data-structures/hash-tables)

## What you should be able to do by the end

- Glance at a function and estimate whether it'll be slow on big inputs.
- Explain why the DOM is a tree and how that affects rendering.
- Write a recursive function to flatten a nested array.
- Connect a real slowdown in your app to a CS concept.

## Your path

```mermaid
flowchart LR
  A[Big-O & Complexity] --> B[Sorting Algorithms]
  B --> C[Recursion]
  C --> D[Arrays & Hash Tables]
  D --> E[Trees & the DOM]
  E --> F[BFS/DFS Traversal]
```

## Want the full version?

Switch to **Expert** mode above for the deeper case for CS in frontend work, plus great free resources like Harvard's CS50 and Visualgo.
