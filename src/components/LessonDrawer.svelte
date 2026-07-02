<script lang="ts">
  import { appData, toggleItem } from "../lib/store";
  import { lessonKey, lessonFraction } from "../lib/progress";
  import { pct } from "../lib/format";
  import { celebrate, toast } from "../lib/events";
  import { BADGES } from "../data/badges";
  import ChecklistItem from "./ChecklistItem.svelte";

  let {
    open = false,
    topicSlug = "",
    lessonSlug = "",
    lessonTitle = "",
    checklist = [] as string[],
    difficulty = undefined as "easy" | "medium" | "hard" | undefined,
    estMinutes = undefined as number | undefined,
    onClose,
  }: {
    open: boolean;
    topicSlug: string;
    lessonSlug: string;
    lessonTitle: string;
    checklist: string[];
    difficulty?: "easy" | "medium" | "hard";
    estMinutes?: number;
    onClose: () => void;
  } = $props();

  const key = $derived(lessonKey(topicSlug, lessonSlug));
  const state = $derived($appData.progress[key] ?? []);
  const fraction = $derived(lessonFraction(state, checklist.length));
  const doneCount = $derived(checklist.reduce((n, _, i) => n + (state[i] ? 1 : 0), 0));

  const DIFF_LABEL: Record<string, string> = { easy: "Easy", medium: "Medium", hard: "Hard" };
  const DIFF_COLOR: Record<string, string> = {
    easy: "text-info bg-panel-soft",
    medium: "text-active bg-active-soft",
    hard: "text-urgency bg-panel-soft",
  };

  async function handle(i: number, checked: boolean) {
    const result = await toggleItem(key, i, checked);
    if (result.delta.topicCompleted) {
      celebrate({ intensity: "topic" });
      toast({ icon: "🏆", title: "Topic complete!", message: "+20 bonus coins" });
    } else if (result.delta.lessonCompleted) {
      celebrate({ intensity: "lesson" });
      toast({ icon: "✅", title: "Lesson complete!", message: "+5 bonus coins" });
    }
    if (result.goalReached) {
      toast({ icon: "🎯", title: "Daily goal reached!", message: "Nice streak fuel." });
    }
    for (const id of result.newBadges) {
      const badge = BADGES.find((b) => b.id === id);
      if (badge) toast({ icon: badge.icon, title: `Badge: ${badge.label}`, message: badge.description });
    }
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") onClose();
  }
</script>

<svelte:window onkeydown={onKeydown} />

{#if open}
  <!-- backdrop -->
  <div
    class="fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm"
    onclick={onClose}
    role="presentation"
  ></div>

  <!-- drawer panel -->
  <div
    class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-line bg-panel shadow-2xl"
    role="dialog"
    aria-modal="true"
    aria-label={lessonTitle}
  >
    <!-- header -->
    <div class="flex items-start justify-between gap-3 border-b border-line p-5">
      <div class="min-w-0">
        <p class="mb-1 font-data text-xs font-semibold tracking-widest text-text-muted uppercase">
          {topicSlug.replace(/-/g, " ")}
        </p>
        <h2 class="text-lg font-bold leading-snug text-text-primary">{lessonTitle}</h2>
        <div class="mt-1.5 flex flex-wrap items-center gap-2">
          {#if difficulty}
            <span class={`rounded-full px-2 py-0.5 font-data text-xs font-medium ${DIFF_COLOR[difficulty]}`}>
              {DIFF_LABEL[difficulty]}
            </span>
          {/if}
          {#if estMinutes}
            <span class="font-data text-xs text-text-muted">~{estMinutes} min</span>
          {/if}
        </div>
      </div>
      <button
        onclick={onClose}
        class="row-hover mt-0.5 shrink-0 rounded-md p-1.5 text-text-muted transition hover:bg-panel-soft hover:text-text-primary"
        aria-label="Close"
      >
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"/>
        </svg>
      </button>
    </div>

    <!-- progress bar -->
    <div class="border-b border-line px-5 py-3">
      <div class="mb-1.5 flex items-center justify-between font-data text-xs">
        <span class="text-text-muted">Progress</span>
        <span class="font-medium tabular-nums text-active">
          {doneCount}/{checklist.length} · {pct(fraction)}%
        </span>
      </div>
      <div class="h-2 overflow-hidden rounded-full bg-line">
        <div
          class={`h-full rounded-full transition-[width] duration-300 ${pct(fraction) >= 100 ? "bg-complete" : "bg-active"}`}
          style={`width:${pct(fraction)}%`}
        ></div>
      </div>
    </div>

    <!-- checklist -->
    <div class="flex-1 overflow-y-auto px-5 py-4">
      {#if checklist.length > 0}
        <p class="mb-3 font-data text-xs font-semibold tracking-widest text-text-muted uppercase">Checklist</p>
        <ul class="-mx-2 space-y-0.5">
          {#each checklist as item, i (i)}
            <li>
              <ChecklistItem label={item} checked={!!state[i]} onToggle={(c) => handle(i, c)} />
            </li>
          {/each}
        </ul>
      {:else}
        <p class="text-sm text-text-muted">No checklist items for this lesson.</p>
      {/if}
    </div>

    <!-- footer -->
    <div class="border-t border-line p-4">
      <a
        href={`/topics/${topicSlug}/${lessonSlug}`}
        class="flex w-full items-center justify-center gap-2 rounded-md bg-active px-4 py-2.5 text-sm font-semibold text-ink hover:bg-amber-500/90"
      >
        Open full lesson
        <svg class="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
          <path fill-rule="evenodd" d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/>
        </svg>
      </a>
    </div>
  </div>
{/if}
