---
title: Fuzzy Search & String Matching
order: 2
estMinutes: 30
difficulty: medium
checklist:
  - Explain the difference between substring search and fuzzy matching
  - Implement a subsequence-based fuzzy match function
  - Return matched character indices for result highlighting
  - Score results by match density to rank best matches first
  - Apply fuzzy matching to a live search input with highlighted results
---

Substring search is strict: `"proj"` matches `"Project settings"`, but `"prj"` does not. Real users type partial fragments, skip vowels, and remember words out of habit rather than exact spelling. Fuzzy search makes local filtering feel smarter by treating the query as a sequence of characters that can appear across the target string.

## Subsequence Matching

A simple fuzzy matcher walks the query through the title from left to right. Every query character must be found in order, but other characters can appear between them.

```ts
export function fuzzyMatchIndices(title: string, query: string): number[] | null {
  const normalizedTitle = title.toLowerCase();
  const normalizedQuery = query.trim().toLowerCase();
  const indices: number[] = [];

  if (normalizedQuery.length === 0) return [];

  let titleIndex = 0;
  for (const queryChar of normalizedQuery) {
    const nextIndex = normalizedTitle.indexOf(queryChar, titleIndex);
    if (nextIndex === -1) return null;
    indices.push(nextIndex);
    titleIndex = nextIndex + 1;
  }

  return indices;
}
```

This algorithm is small enough to audit and fast enough for hundreds or thousands of items in memory. It will match `"rct"` against `"React Components"` because the letters appear in order.

## Scoring And Ranking

Matching is only half the experience. Ranking decides what appears first. A compact match is usually more relevant than a match spread across the whole string.

```ts
type SearchResult = {
  title: string;
  indices: number[];
  score: number;
};

export function searchTitles(titles: string[], query: string): SearchResult[] {
  return titles
    .map((title) => {
      const indices = fuzzyMatchIndices(title, query);
      if (!indices) return null;
      const score = indices.length === 0
        ? Number.POSITIVE_INFINITY
        : indices[indices.length - 1] - indices[0];
      return { title, indices, score };
    })
    .filter((result): result is SearchResult => result !== null)
    .sort((a, b) => a.score - b.score || a.title.length - b.title.length);
}
```

## Highlighting Matches

Return indices rather than only `true` so the UI can highlight matched characters. In a component, convert the index list to a `Set`, then render matched characters with a success color and non-matches with muted text.

```ts
export function splitHighlighted(title: string, indices: number[]) {
  const matched = new Set(indices);
  return [...title].map((char, index) => ({
    char,
    matched: matched.has(index),
  }));
}
```

> [!NOTE]
> A score of matchEnd - matchStart gives a simple proximity score — lower is better.

## Further Learning

Search these terms to go deeper:
- **"subsequence fuzzy matching algorithm"** — the core character-walking approach
- **"Fuse.js scoring options"** — production-ready fuzzy ranking strategies
- **"command palette fuzzy search UX"** — how search ranking affects navigation
- **"highlight matched characters accessibility"** — preserving readable labels while styling matches
