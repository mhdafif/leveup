---
title: Trees & Binary Search Trees
order: 8
estMinutes: 15
difficulty: easy
checklist:
  - "Define the key tree vocabulary: root, leaf, parent, child, height, depth"
  - State the BST property and verify whether a given tree satisfies it
  - Trace through BST insert and search operations by hand
  - Understand why an unbalanced BST degrades to O(n) operations
  - Implement BST insert and search in TypeScript
  - Explain what makes a tree balanced and name one self-balancing variant
---

A **tree** is a way to organize data like a family tree or a company org chart: one thing at the top, branching down into more. You already use trees constantly — folders inside folders, the HTML of a page, the categories on a shopping site.

## The words you need

- **Root** — the top node (no parent).
- **Child / Parent** — a node below / above another.
- **Leaf** — a node with no children (the ends of the branches).
- **Height** — how many levels deep the tree goes.

## The Binary Search Tree (BST)

A **binary** tree just means each node has at most two children (a left and a right). A **Binary Search Tree** adds one clever rule:

> For every node: everything to its **left** is smaller, everything to its **right** is bigger.

That rule is powerful — to find a value, you compare once and instantly ignore half the tree, then half of that, and so on. It's binary search, but in tree form.

## Insert and search in code

```ts
class Node {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
  }
}

function insert(node, value) {
  if (node === null) return new Node(value)
  if (value < node.value) node.left = insert(node.left, value)
  else if (value > node.value) node.right = insert(node.right, value)
  return node
}

function search(node, value) {
  if (node === null) return false
  if (value === node.value) return true
  return value < node.value
    ? search(node.left, value)   // smaller → go left
    : search(node.right, value)  // bigger → go right
}
```

## The catch: keep it balanced

A BST is only fast if it's **balanced** — bushy and even. Then find/insert is a quick O(log n).

But if you insert already-sorted values (1, 2, 3, 4...), every node hangs off the right, and the "tree" becomes a straight line — basically a slow list, O(n).

```
Balanced (fast)        Unbalanced (slow)
     2                   1
    / \                   \
   1   3                   2
                            \
                             3
```

> [!WARNING]
> Feeding sorted data into a plain BST creates that useless straight line. In real code you'd use a **self-balancing** tree (like an AVL or Red-Black tree) that automatically keeps itself bushy — you rarely build these yourself, but it's good to know they exist.

## In one sentence

A tree branches data from a root down to leaves, and a Binary Search Tree keeps smaller values left and bigger values right so lookups are a fast O(log n) — as long as the tree stays balanced.

## Want to go deeper?

Switch to **Expert** mode above for full tree vocabulary, the three traversal orders, and how AVL/Red-Black trees guarantee balance.
