---
title: Infinite Scroll & Pagination
order: 8
estMinutes: 30
difficulty: medium
checklist:
  - Explain the difference between offset-based and cursor-based pagination
  - Implement cursor pagination to avoid the duplicate-item problem
  - Use an IntersectionObserver sentinel element to trigger the next page fetch
  - Show a loading skeleton while the next page loads
  - Handle the end-of-list state to stop further fetch attempts
---

Pagination controls how a large collection is divided into manageable pages. Infinite scroll removes explicit page controls and loads more content as the user approaches the end. The implementation quality depends heavily on the pagination model behind it.

## Offset Versus Cursor

Offset pagination asks for `limit=20&offset=40`. It is simple, but it can duplicate or skip items when new rows are inserted before the current offset. Cursor pagination asks for items after a stable value such as the last item ID or creation timestamp.

```ts
type Page<T> = {
  items: T[];
  nextCursor: string | null;
};

type FeedItem = {
  id: string;
  createdAt: string;
  title: string;
};

export async function fetchFeedPage(cursor: string | null): Promise<Page<FeedItem>> {
  const params = new URLSearchParams({ limit: "20" });
  if (cursor) params.set("after", cursor);

  const response = await fetch(`/api/feed?${params}`);
  if (!response.ok) throw new Error("Failed to load feed");
  return response.json() as Promise<Page<FeedItem>>;
}
```

The server returns `nextCursor` from the last item in the page. When it returns `null`, there is no next page.

## Sentinel Fetching

Place a sentinel element after the list. When it intersects, fetch the next page unless a request is already in flight or the list has ended.

```ts
export function observeInfiniteScroll(
  sentinel: Element,
  loadNextPage: () => void,
) {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) loadNextPage();
  }, { rootMargin: "400px" });

  observer.observe(sentinel);
  return () => observer.disconnect();
}
```

Use skeleton rows during the next-page fetch so layout remains stable. Spinners communicate waiting, but skeletons preserve the rhythm of the list and reduce perceived jank.

> [!TIP]
> Prefer cursor pagination for any list that can be updated in real time. Offset pagination is fine for static, rarely-changed datasets.

## Further Learning

Search these terms to go deeper:
- **"cursor pagination stable ordering"** — avoiding duplicate and skipped items
- **"IntersectionObserver infinite scroll sentinel"** — loading pages near the viewport
- **"infinite scroll accessibility"** — preserving navigation and announcing new content
- **"pagination skeleton loading states"** — perceived performance for incremental lists
