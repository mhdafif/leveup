<script lang="ts">
  import { onMount } from "svelte";
  import { fuzzyMatchIndices } from "../lib/fuzzy";
  import { appData } from "../lib/store";
  import { buildSearchResults, type SearchResult } from "../lib/search";

  interface TitlePart {
    char: string;
    matched: boolean;
  }

  interface ContentLesson {
    slug: string;
    title: string;
    checklist: string[];
  }
  interface ContentTopic {
    slug: string;
    title: string;
    lessons: ContentLesson[];
  }

  let open = $state(false);
  let query = $state("");
  let loading = $state(false);
  let contentIndex = $state<ContentTopic[]>([]);

  const topicResults = $derived.by<SearchResult[]>(() =>
    buildSearchResults({ topics: contentIndex, userTopics: $appData.userTopics, query }),
  );

  function runSearch(q: string) {
    loading = q.trim().length >= 3 && contentIndex.length === 0;
  }

  $effect(() => {
    if (contentIndex.length > 0) loading = false;
  });

  let timer: ReturnType<typeof setTimeout>;
  $effect(() => {
    const q = query;
    clearTimeout(timer);
    timer = setTimeout(() => runSearch(q), 200);
  });

  function openModal() {
    open = true;
    setTimeout(() => document.getElementById("search-input")?.focus(), 0);
  }
  function closeModal() {
    open = false;
    query = "";
  }

  function titleParts(title: string): TitlePart[] {
    const matched = new Set(fuzzyMatchIndices(title, query));
    return Array.from(title).map((char, index) => ({
      char,
      matched: matched.has(index),
    }));
  }

  function onKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      open ? closeModal() : openModal();
    } else if (e.key === "Escape" && open) {
      closeModal();
    }
  }

  onMount(() => {
    window.addEventListener("keydown", onKeydown);
    window.addEventListener("levelup:open-search", openModal);
    void (async () => {
      try {
        const res = await fetch("/content-index.json");
        if (res.ok) {
          const json = await res.json();
          contentIndex = json.topics ?? [];
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      window.removeEventListener("keydown", onKeydown);
      window.removeEventListener("levelup:open-search", openModal);
    };
  });

  const hasResults = $derived(
    topicResults.length > 0,
  );
</script>

{#if open}
  <div
    class="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-ink/60 p-4 pt-[10vh]"
    onclick={closeModal}
    role="presentation"
  >
    <div
      class="w-full max-w-xl rounded-md border border-line bg-panel shadow-xl"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div class="flex items-center gap-2 border-b border-line px-4">
        <span class="text-text-muted" aria-hidden="true">🔍</span>
        <input
          id="search-input"
          bind:value={query}
          placeholder="Search lessons…"
          class="w-full bg-transparent py-3 text-sm text-text-primary outline-none border-none! outline-none!"
          autocomplete="off"
        />
        <kbd
          class="rounded border border-line px-1.5 font-data text-xs text-text-muted"
          >Esc</kbd
        >
      </div>

      <div class="max-h-[60vh] overflow-y-auto p-2">
        {#if !hasResults && !loading}
          <p class="px-3 py-6 text-center text-sm text-text-muted">
            {query.trim().length < 3 ? "Type at least 3 characters." : `No results for "${query}".`}
          </p>
        {:else}
          {#if topicResults.length > 0}
            <p
              class="px-3 pt-2 pb-1 font-data text-xs font-semibold tracking-widest text-text-muted uppercase"
            >
              Topics and lessons
            </p>
            {#each topicResults as r (r.url)}
              <a
                href={r.url}
                class="row-hover block rounded-md px-3 py-2 transition hover:bg-panel-soft"
              >
                <span class="text-sm font-medium" aria-label={r.title}>
                  {#each titleParts(r.title) as part}
                    <span
                      aria-hidden="true"
                      class={part.matched ? "text-complete" : "text-text-muted"}
                      >{part.char}</span
                    >
                  {/each}
                </span>
                <span class="ml-2 font-data text-[10px] uppercase text-text-muted">
                  {r.source === "user" ? "My" : "Built-in"} {r.kind}
                </span>
              </a>
            {/each}
          {/if}
          {#if query.trim().length >= 3 && loading}
            <p class='px-3 py-3 text-center text-xs text-text-muted'>Searching…</p>
          {/if}
        {/if}
      </div>
    </div>
  </div>
{/if}
