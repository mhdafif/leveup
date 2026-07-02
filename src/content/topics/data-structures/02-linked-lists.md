---
title: Linked Lists
order: 2
estMinutes: 25
difficulty: medium
checklist:
  - Understand nodes and pointers
  - Compare singly vs doubly linked lists
  - Implement insert at head and traversal
  - Know when a linked list beats an array
---

A **linked list** stores each element in its own node, and every node holds a
reference to the next one. Nodes can live anywhere in memory — the pointers are
what hold the sequence together.

```ts
class Node<T> {
  constructor(
    public value: T,
    public next: Node<T> | null = null,
  ) {}
}

function insertAtHead<T>(head: Node<T> | null, value: T): Node<T> {
  return new Node(value, head); // O(1): no shifting required
}
```

> [!IMPORTANT]
> Inserting at the head is `O(1)` because nothing moves — you just repoint a
> reference. The same insert in an array is `O(n)` because every element shifts.

## When to reach for one

- You insert and remove from the ends constantly.
- You don't need random access by index (that's `O(n)` here).
- You want stable references to elements that survive insertions elsewhere.
