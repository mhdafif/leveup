<script lang="ts">
  import { onMount, tick } from "svelte";
  import { appData } from "../lib/store";
  import { renderMarkdown } from "../lib/renderMarkdown";
  import { renderMermaidDiagrams } from "../lib/renderMermaid";
  import { lessonKey, lessonFraction } from "../lib/progress";
  import { pct } from "../lib/format";
  import Checklist from "./Checklist.svelte";
  import Notes from "./Notes.svelte";

  let topicId = $state("");
  let lessonSlug = $state("");

  function readQuery() {
    const p = new URLSearchParams(location.search);
    topicId = p.get("t") ?? "";
    lessonSlug = p.get("l") ?? "";
  }

  onMount(() => {
    readQuery();
    window.addEventListener("popstate", readQuery);
    return () => window.removeEventListener("popstate", readQuery);
  });

  const topic = $derived($appData.userTopics.find((t) => t.id === topicId) ?? null);
  const lesson = $derived(
    topic && lessonSlug ? (topic.lessons.find((l) => l.slug === lessonSlug) ?? null) : null,
  );

  let html = $state("");
  $effect(() => {
    const body = lesson?.body ?? "";
    if (!body) {
      html = "";
      return;
    }
    let cancelled = false;
    renderMarkdown(body).then(async (out) => {
      if (cancelled) return;
      html = out;
      await tick();
      renderMermaidDiagrams();
    });
    return () => {
      cancelled = true;
    };
  });


</script>

{#if !topic}
  <div class="py-16 text-center">
    <p class="text-lg font-medium text-text-primary">Topic not found</p>
    <p class="mt-1 text-sm text-text-muted">It may have been deleted from this browser.</p>
    <a href="/" class="mt-4 inline-block text-sm font-medium text-active">
      ← Back to topics
    </a>
  </div>
{:else if lesson}
  <a href={`/u?t=${topic.id}`} class="text-sm font-medium text-active hover:underline">
    ← Back to topic
  </a>
  <div class="mt-4 grid gap-8 lg:grid-cols-[1fr_20rem]">
    <article class="prose prose-invert max-w-none">
      <h1 class="mb-2">{lesson.title}</h1>
      {@html html}
    </article>
    <aside class="space-y-4 lg:sticky lg:top-24 lg:self-start">
      {#if lesson.checklist.length > 0}
        <Checklist topic={topic.id} lesson={lesson.slug} items={lesson.checklist} />
      {/if}
      <Notes topic={topic.id} lesson={lesson.slug} />
    </aside>
  </div>
{:else}
  <a href="/" class="text-sm font-medium text-active hover:underline">
    ← All topics
  </a>
  <h1 class="mt-3 flex items-center gap-2 text-2xl font-semibold text-text-primary">
    {#if topic.icon}<span>{topic.icon}</span>{/if}
    {topic.title}
  </h1>
  {#if topic.description}
    <p class="mt-1 text-text-muted">{topic.description}</p>
  {/if}
  <ul class="mt-6 space-y-2">
    {#each topic.lessons as l (l.slug)}
      {@const frac = lessonFraction($appData.progress[lessonKey(topic.id, l.slug)], l.checklist.length)}
      <li>
        <a
          href={`/u?t=${topic.id}&l=${l.slug}`}
          class="row-hover block rounded-md border border-line bg-panel px-4 py-3 transition hover:bg-panel-soft"
        >
          <div class="flex items-center justify-between gap-3">
            <span class="font-medium text-text-primary">{l.title}</span>
            <span class="font-data text-xs text-text-muted">{pct(frac)}% · {l.checklist.length} items</span>
          </div>
          <div class="mt-2 h-2 overflow-hidden rounded-full bg-line">
            <div class={`h-full rounded-full ${pct(frac) >= 100 ? "bg-complete" : "bg-active"}`} style={`width:${pct(frac)}%`}></div>
          </div>
        </a>
      </li>
    {/each}
  </ul>
{/if}
