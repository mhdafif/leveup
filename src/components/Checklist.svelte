<script lang="ts">
  import { appData, toggleItem } from "../lib/store";
  import { lessonKey, lessonFraction } from "../lib/progress";
  import { pct } from "../lib/format";
  import { celebrate, toast } from "../lib/events";
  import { BADGES } from "../data/badges";
  import ChecklistItem from "./ChecklistItem.svelte";

  let {
    topic,
    lesson,
    items,
  }: { topic: string; lesson: string; items: string[] } = $props();

  const key = lessonKey(topic, lesson);
  const state = $derived($appData.progress[key] ?? []);
  const doneCount = $derived(items.reduce((n, _, i) => n + (state[i] ? 1 : 0), 0));
  const fraction = $derived(lessonFraction(state, items.length));

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
</script>

<section class="rounded-md border border-line bg-panel p-4">
  <div class="mb-2 flex items-center justify-between">
    <h2 class="font-data text-xs font-semibold tracking-widest text-text-muted uppercase">
      Checklist
    </h2>
    <span class="font-data text-sm font-medium tabular-nums text-active">
      {doneCount}/{items.length} · {pct(fraction)}%
    </span>
  </div>

  <div class="mb-3 h-2 overflow-hidden rounded-full bg-line">
    <div
      class={`h-full rounded-full transition-[width] duration-300 ${pct(fraction) >= 100 ? "bg-complete" : "bg-active"}`}
      style={`width:${pct(fraction)}%`}
    ></div>
  </div>

  <ul class="-mx-2">
    {#each items as item, i (i)}
      <li>
        <ChecklistItem label={item} checked={!!state[i]} onToggle={(c) => handle(i, c)} />
      </li>
    {/each}
  </ul>
</section>
