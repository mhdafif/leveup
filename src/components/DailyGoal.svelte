<script lang="ts">
  import { appData } from "../lib/store";
  import { todayISO } from "../lib/gamification";

  const goal = $derived($appData.dailyGoal);
  const today = todayISO();
  const done = $derived(goal.date === today ? goal.doneToday : 0);
  const target = $derived(goal.target);
  const fraction = $derived(target > 0 ? Math.min(1, done / target) : 0);
  const reached = $derived(done >= target && target > 0);
</script>

<div class="rounded-md border border-line bg-panel-soft p-4 space-y-6">
  <div class="flex items-center justify-between">
    <span class="flex items-center gap-2 text-sm font-medium text-text-primary">
      <span aria-hidden="true">🎯</span> Daily goal
    </span>
    <span class="font-data text-sm tabular-nums text-text-muted">{done}/{target} items</span>
  </div>
  <div class="mt-3 h-2 overflow-hidden rounded-full bg-line">
    <div
      class="h-full rounded-full transition-[width] duration-300"
      class:bg-active={!reached}
      class:bg-complete={reached}
      style={`width:${Math.round(fraction * 100)}%`}
    ></div>
  </div>
  {#if reached}
    <p class="mt-2 font-data text-xs font-medium text-complete">
      Goal reached for today — keep the streak alive! 🔥
    </p>
  {/if}
</div>
