---
title: Fuzzy Search & String Matching
order: 2
estMinutes: 15
difficulty: easy
checklist:
  - Explain the difference between substring search and fuzzy matching
  - Implement a subsequence-based fuzzy match function
  - Return matched character indices for result highlighting
  - Score results by match density to rank best matches first
  - Apply fuzzy matching to a live search input with highlighted results
---

Ever notice how in tools like VS Code you can type `rct` and it finds "**R**ea**c**t Componen**t**s"? That's **fuzzy search** — it matches the letters *in order* even when they're not next to each other. It feels smart because it forgives typos and partial memory.

## Plain search vs. fuzzy search

- **Substring search** is strict: `"proj"` matches "Project" but `"prj"` finds nothing.
- **Fuzzy search** is forgiving: `"prj"` matches "Project" because p, r, j all appear in order.

## How it works: walk the letters in order

The core idea is simple. Go through the search letters one by one, and check each appears somewhere *after* the previous one in the target:

```ts
function fuzzyMatch(text, query) {
  text = text.toLowerCase()
  query = query.toLowerCase()
  let pos = 0
  for (const char of query) {
    pos = text.indexOf(char, pos)   // find this letter after the last one
    if (pos === -1) return false    // a letter's missing → no match
    pos++
  }
  return true   // found all letters in order → match!
}
```

That's the whole trick — every query letter must appear, in order, somewhere in the text.

## Ranking the results

Matching is only half of it — you also want the *best* matches on top. A simple rule: matches where the letters are **close together** are usually more relevant than ones spread far apart. So you can score by "how spread out was the match" and sort by that (tighter = better).

> [!NOTE]
> A quick score is `lastMatchedIndex - firstMatchedIndex` — smaller means the match was more compact, so it ranks higher.

## Highlighting

If your match function returns *which* letters matched (their positions), the UI can bold or color just those letters — that satisfying highlight you see in command palettes.

## In one sentence

Fuzzy search matches your letters *in order* even with gaps (so `rct` finds "React"), by walking each query letter through the text — then ranks tighter matches higher and can highlight the matched letters.

## Want to go deeper?

Switch to **Expert** mode above for the full scoring/ranking function, returning match indices, and libraries like Fuse.js.
