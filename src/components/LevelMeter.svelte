<script lang="ts">
  import { levelForXp, xpIntoLevel } from "../lib/gamification";

  let { xp = 0, compact = false }: { xp?: number; compact?: boolean } = $props();

  const level = $derived(levelForXp(xp));
  const meter = $derived(xpIntoLevel(xp));
  const fraction = $derived(meter.into / meter.needed);
</script>

<div class="flex items-center gap-2">
  <span
    class="grid h-6 min-w-6 place-items-center rounded-md bg-active-soft px-1.5 font-data text-xs font-semibold text-active"
    title={`${meter.into}/${meter.needed} XP to next level`}
  >
    Lv {level}
  </span>
  {#if !compact}
    <div class="h-1.5 w-16 overflow-hidden rounded-full bg-line">
      <div class="h-full rounded-full bg-active" style={`width:${Math.round(fraction * 100)}%`}></div>
    </div>
  {/if}
</div>
