---
title: BFS & DFS
order: 9
estMinutes: 15
difficulty: easy
checklist:
  - Explain the difference between BFS and DFS traversal order
  - Implement BFS iteratively using a queue in TypeScript
  - Implement DFS recursively and iteratively using a stack in TypeScript
  - State the time and space complexity of both algorithms
  - Choose the right traversal for "shortest path" vs "does a path exist" problems
  - Trace BFS and DFS on a small graph by hand
---

Say you're exploring a maze of connected rooms. There are two natural ways to explore: check all the nearby rooms first and spread outward (**BFS**), or pick one hallway and follow it as far as it goes before backtracking (**DFS**). These are the two fundamental ways to explore any connected structure — a map, a social network, a maze.

## BFS — explore in rings (Breadth-First)

BFS visits everything one step away, then everything two steps away, and so on — like ripples spreading from a stone. It uses a **queue** (first-in, first-out):

```ts
function bfs(graph, start) {
  const visited = new Set([start])
  const queue = [start]
  const order = []
  while (queue.length) {
    const node = queue.shift()   // take from the front
    order.push(node)
    for (const next of graph.get(node) ?? []) {
      if (!visited.has(next)) {
        visited.add(next)
        queue.push(next)         // add to the back
      }
    }
  }
  return order
}
```

> [!TIP]
> Because BFS spreads out evenly, the *first* time it reaches a room is always by the shortest route. So BFS finds the **shortest path** (fewest steps) in an unweighted map.

## DFS — follow one path deep (Depth-First)

DFS dives down one branch as far as it can, then backs up and tries another. It's naturally written with recursion (which uses the call stack):

```ts
function dfs(graph, node, visited = new Set(), order = []) {
  visited.add(node)
  order.push(node)
  for (const next of graph.get(node) ?? []) {
    if (!visited.has(next)) dfs(graph, next, visited, order)
  }
  return order
}
```

In both, the `visited` set is essential — without it you'd loop forever on a map with cycles.

## Which one should I use?

| Use **BFS** when... | Use **DFS** when... |
|---|---|
| You need the **shortest path** (fewest steps) | You just need to know **if a path exists** |
| The target is probably nearby | You want to explore every possibility |
| "Degrees of separation" in a network | Solving a maze by trying paths |

> [!IMPORTANT]
> BFS gives the shortest path when every step counts equally. If steps have different "costs" (like distances on a road map), you need a fancier algorithm called Dijkstra's — but that's built on the same ideas.

## In one sentence

BFS explores outward in rings using a queue (and finds shortest paths), while DFS dives deep down one branch using recursion/a stack (great for "does a path exist?") — both need a `visited` set to avoid loops.

## Want to go deeper?

Switch to **Expert** mode above for iterative DFS with an explicit stack, complexity analysis, and where each traversal powers bigger algorithms.
