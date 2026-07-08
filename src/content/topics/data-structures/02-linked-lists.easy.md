---
title: Linked Lists
order: 2
difficulty: easy
estMinutes: 12
checklist:
  - Understand nodes and pointers
  - Compare singly vs doubly linked lists
  - Implement insert at head and traversal
  - Know when a linked list beats an array
---

A **linked list** is like a scavenger hunt: each item holds a clue pointing to the *next* item. The items don't need to sit next to each other in memory — each one just knows where the next one is.

## Nodes and pointers

Each piece is a **node** that holds two things: its value, and a pointer to the next node.

```ts
class Node {
  constructor(value, next = null) {
    this.value = value
    this.next = next   // points to the next node (or null at the end)
  }
}
```

Follow the `next` pointers from the first node ("head") and you can walk the whole list.

## The big advantage: cheap inserts at the front

Adding a new item at the front is instant — you just make it point to the old first item:

```ts
function insertAtHead(head, value) {
  return new Node(value, head)  // point new node at the old head
}
```

> [!IMPORTANT]
> Adding to the front is O(1) because nothing else moves — you just repoint one arrow. Doing the same in an array is slow (O(n)), because every item has to shift over.

## The trade-off

Linked lists give up one thing arrays are great at: **jumping to item #7 instantly**. To reach the 7th node you have to hop through nodes 1→2→3... — that's O(n).

**Use a linked list when** you add/remove from the ends a lot and don't need to jump to items by their position.

## In one sentence

A linked list chains items together with pointers (each node knows the next), making inserts/removals at the ends instant — at the cost of slow "jump to item #n" access.

## Want to go deeper?

Switch to **Expert** mode above for singly vs doubly linked lists and traversal details.
