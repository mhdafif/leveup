<script lang="ts">
  import { appData, deleteUserTopic } from "../lib/store";
  import { lessonKey, lessonDone } from "../lib/progress";
  import { pct } from "../lib/format";
  import UploadTopicModal from "./UploadTopicModal.svelte";

  let showUpload = $state(false);
  const topics = $derived($appData.userTopics);

  function progressOf(topic: (typeof topics)[number]) {
    let done = 0;
    let total = 0;
    for (const l of topic.lessons) {
      total += l.checklist.length;
      done += lessonDone($appData.progress[lessonKey(topic.id, l.slug)], l.checklist.length);
    }
    return { done, total, frac: total > 0 ? done / total : 0 };
  }

  function remove(id: string, title: string) {
    if (confirm(`Delete "${title}" and its progress? This can't be undone.`)) {
      deleteUserTopic(id);
    }
  }
</script>

<section class="mt-8">
  <div class="mb-3 flex items-center justify-between">
    <h2 class="font-data text-xs font-semibold tracking-widest text-text-muted uppercase">
      My uploaded topics
    </h2>
    <button
      type="button"
      onclick={() => (showUpload = true)}
      class="rounded-md bg-active px-3 py-1.5 text-sm font-medium text-ink hover:bg-amber-500/90"
    >
      + Add topic
    </button>
  </div>

  {#if topics.length === 0}
    <button
      type="button"
      onclick={() => (showUpload = true)}
      class="w-full rounded-md border border-dashed border-line px-4 py-8 text-center text-sm text-text-muted hover:border-active hover:text-active"
    >
      Upload a topic as a markdown file to start your own study set.
    </button>
  {:else}
    <div class="grid gap-4 sm:grid-cols-2">
      {#each topics as topic (topic.id)}
        {@const p = progressOf(topic)}
        <div class="row-hover relative rounded-md border border-line bg-panel p-5 transition hover:bg-panel-soft">
          <!-- full-card link overlay -->
          <a href={`/u?t=${topic.id}`} class="absolute inset-0 rounded-md" aria-label={`Open ${topic.title}`}></a>
          <div class="relative flex items-start justify-between gap-2">
            <div class="flex items-center gap-2">
              {#if topic.icon}<span class="text-xl">{topic.icon}</span>{/if}
              <h3 class="text-lg font-semibold text-text-primary">{topic.title}</h3>
            </div>
            <button
              type="button"
              onclick={() => remove(topic.id, topic.title)}
              class="relative shrink-0 rounded-md px-2 py-1 text-xs text-text-muted hover:bg-panel-soft hover:text-urgency"
              aria-label={`Delete ${topic.title}`}
            >Delete</button>
          </div>
          {#if topic.description}
            <p class="relative mt-1 line-clamp-2 text-sm text-text-muted">{topic.description}</p>
          {/if}
          <div class="relative mt-4">
            <div class="h-2 overflow-hidden rounded-full bg-line">
              <div class={`h-full rounded-full transition-[width] ${pct(p.frac) >= 100 ? "bg-complete" : "bg-active"}`} style={`width:${pct(p.frac)}%`}></div>
            </div>
            <p class="mt-1.5 font-data text-sm text-text-muted">{pct(p.frac)}% · {p.done}/{p.total} done</p>
          </div>
          <p class="relative mt-2 font-data text-xs text-text-muted">{topic.lessons.length} subtopic{topic.lessons.length === 1 ? "" : "s"}</p>
        </div>
      {/each}
    </div>
  {/if}
</section>

<UploadTopicModal open={showUpload} onClose={() => (showUpload = false)} />
