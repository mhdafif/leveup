<script lang="ts">
  let {
    label,
    value,
    sub = "",
    href = "",
  }: { label: string; value: string | number; sub?: string; href?: string } = $props();

  const tag = href ? "a" : "div";
</script>

<svelte:element
  this={tag}
  href={href || undefined}
  class={`rounded-md border border-line bg-panel-soft px-4 py-3 ${href ? "row-hover block transition hover:bg-panel hover:border-active/40" : ""}`}
>
  <p class="text-xs text-text-muted">{label}</p>
  <p class="mt-1 font-data text-2xl font-semibold tabular-nums text-text-primary">{value}</p>
  {#if sub}
    <p class="mt-0.5 truncate text-xs text-text-muted">{sub}</p>
  {/if}
</svelte:element>
