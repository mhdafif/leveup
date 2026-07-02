<script lang="ts">
  import { appData } from "../lib/store";
  import { earnedBadgeIcons } from "../lib/badgeDisplay";
  import LevelMeter from "./LevelMeter.svelte";

  const coins = $derived($appData.coins);
  const xp = $derived($appData.xpTotal);
  const badgeIcons = $derived(earnedBadgeIcons($appData.badges));
</script>

<div class="flex items-center gap-2 sm:gap-3">
  {#if badgeIcons.length > 0}
    <a
      href="/stats"
      class="row-hover hidden max-w-36 items-center gap-1 overflow-hidden rounded-md border border-line bg-panel px-2 py-1.5 transition hover:bg-panel-soft sm:flex"
      title={`${badgeIcons.length} badges earned`}
      aria-label={`${badgeIcons.length} badges earned`}
    >
      {#each badgeIcons as icon, i (`${icon}-${i}`)}
        <span aria-hidden="true" class="text-sm leading-none">{icon}</span>
      {/each}
    </a>
  {/if}
  <a
    href="/rewards"
    class="row-hover flex items-center gap-1.5 rounded-md bg-active-soft px-2.5 py-1.5 font-data text-sm font-semibold text-active transition hover:bg-panel-soft"
    title="Coins — spend them in the reward shop"
  >
    <span aria-hidden="true">🪙</span>
    <span class="tabular-nums">{coins}</span>
  </a>
  <div class="hidden sm:block">
    <LevelMeter {xp} />
  </div>
</div>
