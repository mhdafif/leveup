<script lang="ts">
  import { appData } from "../lib/store";
  import { lessonDone, lessonKey } from "../lib/progress";
  import { pct } from "../lib/format";
  import ProgressBar from "./ProgressBar.svelte";
  import type { TopicMeta } from "../lib/types";

  let { topics }: { topics: TopicMeta[] } = $props();

  interface TopicView {
    topic: TopicMeta;
    done: number;
    total: number;
    fraction: number;
  }

  function counts(topic: TopicMeta): TopicView {
    let done = 0;
    let total = 0;
    for (const lesson of topic.lessons) {
      total += lesson.checklistLen;
      done += lessonDone($appData.progress[lessonKey(topic.slug, lesson.slug)], lesson.checklistLen);
    }
    return { topic, done, total, fraction: total > 0 ? done / total : 0 };
  }

  const grouped = $derived.by(() => {
    const views = topics.map(counts);
    return {
      inProgress: views.filter((item) => item.done > 0 && item.done < item.total),
      notStarted: views.filter((item) => item.done === 0),
      completed: views.filter((item) => item.total > 0 && item.done === item.total),
    };
  });

  const sections = $derived([
    {
      key: "in-progress",
      title: "In progress",
      description: "Topics you already started.",
      items: grouped.inProgress,
      open: grouped.inProgress.length > 0,
    },
    {
      key: "not-started",
      title: "Not started",
      description: "Fresh topics waiting for first checklist item.",
      items: grouped.notStarted,
      open: grouped.inProgress.length === 0,
    },
    {
      key: "completed",
      title: "Completed",
      description: "Finished topics ready for review mode.",
      items: grouped.completed,
      open: grouped.inProgress.length === 0 && grouped.notStarted.length === 0,
    },
  ]);
</script>

<div class="space-y-3">
  {#each sections as section (section.key)}
    <details class="rounded-md border border-line bg-panel" open={section.open}>
      <summary class="row-hover flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 hover:bg-panel-soft">
        <span>
          <span class="font-data text-xs font-semibold tracking-widest text-text-muted uppercase">{section.title}</span>
          <span class="ml-2 font-data text-xs text-active">{section.items.length}</span>
          <span class="mt-1 block text-sm text-text-muted">{section.description}</span>
        </span>
        <span class="text-text-muted" aria-hidden="true">▾</span>
      </summary>

      {#if section.items.length === 0}
        <p class="border-t border-line px-4 py-5 text-sm text-text-muted">No topics here.</p>
      {:else}
        <div class="grid gap-3 border-t border-line p-4 sm:grid-cols-2">
          {#each section.items as item (item.topic.slug)}
            <a href={`/topics/${item.topic.slug}`} class="row-hover block rounded-md border border-line bg-ink/40 p-4 transition hover:bg-panel-soft">
              <div class="flex items-center gap-2">
                {#if item.topic.icon}<span class="text-xl">{item.topic.icon}</span>{/if}
                <h3 class="text-base font-semibold text-text-primary">{item.topic.title}</h3>
              </div>
              <p class="mt-1 line-clamp-2 text-sm text-text-muted">{item.topic.description}</p>
              <div class="mt-4 flex items-center gap-2">
                <span
                  class={`h-2.5 w-2.5 shrink-0 rounded-full ${item.fraction >= 1 ? "bg-complete" : item.fraction > 0 ? "bg-active" : "border border-line"}`}
                  aria-hidden="true"
                ></span>
                <div class="flex-1"><ProgressBar fraction={item.fraction} /></div>
              </div>
              <p class="mt-1.5 font-data text-sm text-text-muted">{pct(item.fraction)}% · {item.done}/{item.total} done</p>
              <p class="mt-2 font-data text-xs text-text-muted">{item.topic.lessons.length} subtopic{item.topic.lessons.length === 1 ? "" : "s"}</p>
            </a>
          {/each}
        </div>
      {/if}
    </details>
  {/each}
</div>
