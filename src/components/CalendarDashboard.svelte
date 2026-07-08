<script lang="ts">
  import { onMount } from "svelte";
  import { appData, ensureIndex } from "../lib/store";
  import { activitySummary } from "../lib/activity";
  import LearningCalendar from "./LearningCalendar.svelte";
  import StatCard from "./StatCard.svelte";
  import DailyGoal from "./DailyGoal.svelte";

  const ranges = [
    { key: "90d", label: "90d", days: 90 },
    { key: "60d", label: "60d", days: 60 },
    { key: "30d", label: "30d", days: 30 },
    { key: "7d", label: "7d", days: 7 },
  ] as const;

  // No chip selected by default — stats and the heatmap both show all-time data
  // until the user picks a trailing window.
  let range = $state<(typeof ranges)[number]["key"] | null>(null);
  let topicTitles = $state<Record<string, string>>({});

  onMount(async () => {
    const index = await ensureIndex();
    topicTitles = Object.fromEntries(index.topics.map((t) => [t.slug, t.title]));
  });

  const active = $derived(range ? ranges.find((r) => r.key === range)! : null);
  const summary = $derived(activitySummary($appData.activity, active?.days ?? Infinity));
  const topTopic = $derived(
    summary.topTopicSlug
      ? (topicTitles[summary.topTopicSlug] ?? summary.topTopicSlug.replace(/-/g, " "))
      : "—",
  );
</script>

<section class="rounded-md border border-line bg-panel p-4">
  <div class="mb-4 flex items-center justify-between gap-3">
    <p class="font-data text-xs font-semibold tracking-widest text-text-muted uppercase">Learning calendar</p>
    <div class="flex gap-1" role="tablist" aria-label="Time range">
      {#each ranges as r}
        <button
          type="button"
          role="tab"
          aria-selected={range === r.key}
          onclick={() => (range = range === r.key ? null : r.key)}
          class={`rounded-md px-2.5 py-1 text-xs font-medium transition ${range === r.key ? "bg-active text-ink" : "border border-line text-text-muted hover:bg-panel-soft hover:text-text-primary"}`}
        >
          {r.label}
        </button>
      {/each}
    </div>
  </div>

  <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
    <StatCard label="Current streak" value={`${$appData.streak.current}d`} sub={`Longest ${$appData.streak.longest}d`} />
    <StatCard label="Active days" value={summary.activeDays} />
    <StatCard label="Focus sessions" value={summary.focusSessions} sub={`${summary.focusMinutes} min`} href="/focus" />
    <StatCard label="Checklist items" value={summary.checklistItems} />
    <StatCard label="Reviews" value={summary.reviews} href="/review" />
    <StatCard label="Top topic" value={topTopic} />
  </div>

  <div class="mt-5 grid gap-4 lg:grid-cols-[1fr_16rem]">
    <LearningCalendar highlightDays={active?.days} />
    <DailyGoal />
  </div>

  <p class="mt-3 text-xs text-text-muted">
    Contributions count checklist items, reviews, and completed focus sessions.
  </p>
</section>
