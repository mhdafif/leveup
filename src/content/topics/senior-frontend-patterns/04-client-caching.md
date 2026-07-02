---
title: Client-Side Caching Strategies
order: 4
estMinutes: 30
difficulty: medium
checklist:
  - Implement an in-memory Map cache with a TTL expiry
  - Explain the stale-while-revalidate caching pattern
  - Use a library like TanStack Query or SWR to manage server state
  - Identify which data should be cached and for how long
  - Implement cache invalidation on a mutation
---

Client-side caching reduces repeated network requests, hides latency, and makes screens feel stable when users move back and forth. The hard part is not storing data; it is deciding freshness, scope, invalidation, and what must never be cached.

## TTL Cache

A minimal cache stores the value plus an expiry timestamp. Reads return cached data only while it is fresh.

```ts
type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

export class TtlCache<T> {
  private entries = new Map<string, CacheEntry<T>>();

  get(key: string): T | null {
    const entry = this.entries.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.entries.delete(key);
      return null;
    }
    return entry.data;
  }

  set(key: string, data: T, ttlMs: number): void {
    this.entries.set(key, { data, expiresAt: Date.now() + ttlMs });
  }

  invalidate(key: string): void {
    this.entries.delete(key);
  }
}
```

Use short TTLs for frequently changing data like notifications and longer TTLs for stable reference data like country lists.

## Stale While Revalidate

Stale-while-revalidate returns cached data immediately, then fetches fresh data in the background. The user avoids a blank loading state, and the UI updates when the new response arrives.

```ts
export async function staleWhileRevalidate<T>(
  key: string,
  cache: TtlCache<T>,
  fetchFresh: () => Promise<T>,
  onFresh: (data: T) => void,
) {
  const cached = cache.get(key);
  if (cached) {
    void fetchFresh().then((fresh) => {
      cache.set(key, fresh, 30_000);
      onFresh(fresh);
    });
    return cached;
  }

  const fresh = await fetchFresh();
  cache.set(key, fresh, 30_000);
  return fresh;
}
```

Libraries such as TanStack Query and SWR formalize this pattern with query keys, stale time, background refetching, retries, deduplication, and mutation invalidation. After a mutation, invalidate the exact query keys that became stale instead of clearing the whole cache.

> [!WARNING]
> Never cache user-specific private data in a shared cache layer. Always scope the cache key to the user session.

## Further Learning

Search these terms to go deeper:
- **"stale while revalidate frontend"** — immediate stale reads with background refresh
- **"TanStack Query query keys"** — cache identity and invalidation design
- **"SWR data fetching strategy"** — lightweight server-state caching patterns
- **"frontend cache invalidation mutation"** — keeping cached data correct after writes
