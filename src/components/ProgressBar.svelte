<script lang="ts">
  import { pct } from "../lib/format";

  let {
    fraction = 0,
    showLabel = false,
  }: { fraction?: number; showLabel?: boolean } = $props();

  const percent = $derived(pct(fraction));
</script>

<div class="flex items-center gap-2">
  <div
    class="h-2 flex-1 overflow-hidden rounded-full bg-line"
    role="progressbar"
    aria-valuenow={percent}
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div
      class={`h-full rounded-full transition-[width] duration-300 ${percent >= 100 ? "bg-complete" : "bg-active"}`}
      style={`width:${percent}%`}
    ></div>
  </div>
  {#if showLabel}
    <span class="w-9 text-right font-data text-sm tabular-nums text-text-muted"
      >{percent}%</span
    >
  {/if}
</div>
