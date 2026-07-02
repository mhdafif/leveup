<script lang="ts">
  import type { BadgeDef } from "../data/badges";

  let { badge, earned = false }: { badge: BadgeDef; earned?: boolean } = $props();
</script>

<div
  class="flex flex-col items-center gap-1 rounded-md border p-4 text-center transition
    {earned
    ? 'border-active bg-active-soft'
    : 'border-line bg-panel-soft opacity-50 grayscale'}"
  title={badge.description}
>
  <span class="text-3xl" aria-hidden="true">{badge.icon}</span>
  <span class="text-sm font-semibold text-text-primary">{badge.label}</span>
  <span class="text-xs text-text-muted">{badge.description}</span>
  {#if earned}
    <span class="mt-1 rounded-full bg-active px-2 py-0.5 font-data text-[10px] font-semibold text-ink">
      Earned
    </span>
  {/if}
</div>
