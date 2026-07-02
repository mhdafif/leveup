<script lang="ts">
  import { appData } from "../lib/store";
  import DailyGoal from "./DailyGoal.svelte";

  const reviews = $derived(
    $appData.activity.filter((a) => a.type === "review").reduce((sum, a) => sum + a.count, 0),
  );
  const focusMinutes = $derived(
    Math.round(
      $appData.activity
        .filter((a) => a.type === "focus")
        .reduce((sum, a) => sum + (a.seconds ?? 0), 0) / 60,
    ),
  );
</script>

<div class="space-y-3">
  <DailyGoal />
  <div class="grid grid-cols-2 gap-3">
    <a href="/review" class="row-hover rounded-md border border-line bg-panel p-4 transition hover:bg-panel-soft">
      <p class="font-data text-xs tracking-widest text-text-muted uppercase">Reviews</p>
      <p class="mt-2 font-data text-2xl font-semibold tabular-nums text-active">{reviews}</p>
      <p class="mt-1 text-xs text-text-muted">completed</p>
    </a>
    <a href="/focus" class="row-hover rounded-md border border-line bg-panel p-4 transition hover:bg-panel-soft">
      <p class="font-data text-xs tracking-widest text-text-muted uppercase">Focus</p>
      <p class="mt-2 font-data text-2xl font-semibold tabular-nums text-active">{focusMinutes}</p>
      <p class="mt-1 text-xs text-text-muted">minutes</p>
    </a>
  </div>
</div>
