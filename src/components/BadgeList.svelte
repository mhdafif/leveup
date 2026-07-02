<script lang="ts">
  import { appData } from "../lib/store";
  import { BADGES } from "../data/badges";
  import BadgeTile from "./BadgeTile.svelte";

  const earned = $derived(new Set($appData.badges));
  const earnedCount = $derived(earned.size);
</script>

<div>
  <div class="mb-3 flex items-center justify-between">
    <h2 class="font-data text-xs font-semibold tracking-widest text-text-muted uppercase">
      Badges
    </h2>
    <span class="font-data text-sm text-text-muted">{earnedCount}/{BADGES.length}</span>
  </div>
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
    {#each BADGES as badge (badge.id)}
      <BadgeTile {badge} earned={earned.has(badge.id)} />
    {/each}
  </div>
</div>
