<script lang="ts">
  import { appData } from "../lib/store";
  import { lessonDone, lessonKey, totalChecked } from "../lib/progress";
  import { levelForXp } from "../lib/gamification";
  import { pct } from "../lib/format";

  let {
    topics,
  }: {
    topics: { slug: string; lessons: { slug: string; checklistLen: number }[] }[];
  } = $props();

  const counts = $derived.by(() => {
    let done = 0;
    let total = 0;
    for (const t of topics) {
      for (const l of t.lessons) {
        total += l.checklistLen;
        done += lessonDone($appData.progress[lessonKey(t.slug, l.slug)], l.checklistLen);
      }
    }
    return { done, total };
  });

  const overall = $derived(counts.total > 0 ? counts.done / counts.total : 0);
  const metrics = $derived([
    { label: "Overall", value: `${pct(overall)}%` },
    { label: "Items done", value: `${counts.done}/${counts.total}` },
    { label: "Coins", value: `${$appData.coins}` },
    { label: "Level", value: `${levelForXp($appData.xpTotal)}` },
    { label: "Current streak", value: `${$appData.streak.current}d` },
    { label: "Longest streak", value: `${$appData.streak.longest}d` },
    { label: "Total checked", value: `${totalChecked($appData.progress)}` },
    { label: "Badges", value: `${$appData.badges.length}` },
    { label: "Reviews", value: `${$appData.activity.filter((a) => a.type === "review").reduce((sum, a) => sum + a.count, 0)}` },
    { label: "Focus", value: `${Math.round($appData.activity.filter((a) => a.type === "focus").reduce((sum, a) => sum + (a.seconds ?? 0), 0) / 60)}m` },
    { label: "Active days", value: `${new Set($appData.activity.map((a) => a.date)).size}` },
  ]);
</script>

<div class="space-y-6">
  <div class="h-2.5 overflow-hidden rounded-full bg-line">
    <div
      class={`h-full rounded-full transition-[width] duration-300 ${pct(overall) >= 100 ? "bg-complete" : "bg-active"}`}
      style={`width:${pct(overall)}%`}
    ></div>
  </div>
  <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
    {#each metrics as m (m.label)}
      <div class="rounded-md border border-line bg-panel p-3">
        <p class="font-data text-xs tracking-wide text-text-muted uppercase">{m.label}</p>
        <p class="font-data text-xl font-semibold tabular-nums text-active">{m.value}</p>
      </div>
    {/each}
  </div>
</div>
