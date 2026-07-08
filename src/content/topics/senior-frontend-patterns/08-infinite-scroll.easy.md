---
title: Infinite Scroll & Pagination
order: 8
estMinutes: 12
difficulty: easy
checklist:
  - Explain the difference between offset-based and cursor-based pagination
  - Implement cursor pagination to avoid the duplicate-item problem
  - Use an IntersectionObserver sentinel element to trigger the next page fetch
  - Show a loading skeleton while the next page loads
  - Handle the end-of-list state to stop further fetch attempts
---

You can't load 10,000 posts at once — so you load them in chunks. **Pagination** is splitting a big list into pages. **Infinite scroll** is loading the next chunk automatically as the user scrolls near the bottom (like a social feed).

## Two ways to ask for "the next chunk"

- **Offset** — "give me 20 items, skipping the first 40." Simple, but it has a bug: if new items get added at the top while you scroll, items shift and you can see **duplicates or skips**.
- **Cursor** — "give me 20 items *after this one*" (using the last item's id or timestamp). This stays stable even when new items appear.

```ts
// cursor-based: ask for items after the last one we have
const res = await fetch(`/api/feed?limit=20&after=${lastId}`)
const { items, nextCursor } = await res.json()
// when nextCursor is null, there are no more pages
```

> [!TIP]
> Use **cursor** pagination for anything that updates in real time (feeds, chats). Offset is fine for static lists that rarely change.

## Loading the next page automatically

Put an invisible marker element ("sentinel") at the bottom of your list. When the user scrolls it into view, load the next page. The browser's `IntersectionObserver` makes this easy:

```ts
const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) loadNextPage()
}, { rootMargin: '400px' })   // start loading a bit early
observer.observe(sentinel)
```

The `400px` means "start loading before they actually reach the bottom," so new content is ready by the time they get there.

## Polish

- Show **skeleton rows** (gray placeholders) while the next page loads — smoother than a spinner.
- **Stop fetching** once you've reached the end, or you'll keep firing pointless requests.

## In one sentence

Infinite scroll loads more items as the user nears the bottom — use **cursor** pagination (ask for items *after* the last one) to avoid duplicates, trigger the next fetch with an `IntersectionObserver` sentinel, and stop when the list ends.

## Want to go deeper?

Switch to **Expert** mode above for the full cursor implementation, sentinel setup, and skeleton loading states.
