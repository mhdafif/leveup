---
title: Arrays
order: 1
estMinutes: 20
difficulty: easy
checklist:
  - Understand contiguous memory layout
  - Know the Big-O of access, search, insert, and delete
  - Implement a dynamic array (resize on push)
  - Solve 3 practice problems
---

An **array** stores elements in a single contiguous block of memory. Because
every element is the same size and sits next to the previous one, the address of
index `i` is just `base + i * elementSize` — a constant-time calculation.

## Complexity

| Operation | Time |
| --------- | ---- |
| Access by index | `O(1)` |
| Search (unsorted) | `O(n)` |
| Insert / delete at end | `O(1)` amortized |
| Insert / delete at front | `O(n)` |

> [!NOTE]
> "Amortized `O(1)`" for append means most pushes are cheap, but occasionally
> the array doubles its capacity and copies everything — that rare `O(n)` cost
> spreads out across all the cheap pushes.

## A dynamic array

```ts
class DynamicArray<T> {
  private data: (T | undefined)[] = new Array(1);
  private size = 0;

  push(value: T): void {
    if (this.size === this.data.length) {
      // Grow by doubling — keeps append amortized O(1).
      const grown = new Array(this.data.length * 2);
      for (let i = 0; i < this.size; i++) grown[i] = this.data[i];
      this.data = grown;
    }
    this.data[this.size++] = value;
  }

  get(index: number): T | undefined {
    return this.data[index];
  }
}
```

> [!TIP]
> When you know the final size ahead of time, pre-allocate. You skip every
> resize-and-copy cycle.
