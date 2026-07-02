<script lang="ts">
  import { appData } from "../lib/store";
  import { DEFAULT_REWARDS } from "../data/rewards";
  import { rupiah, dateID } from "../lib/format";

  const redeemed = $derived($appData.redeemed);
  // Resolve from the live catalog, falling back to defaults for deleted rewards.
  const metaFor = (id: string) =>
    $appData.rewards.find((r) => r.id === id) ?? DEFAULT_REWARDS.find((r) => r.id === id);
</script>

{#if redeemed.length}
  <ul class="space-y-2">
    {#each redeemed as entry, i (i)}
      {@const meta = metaFor(entry.id)}
      <li class="flex items-center gap-3 rounded-md border border-line bg-panel px-3 py-2 text-sm">
        <span class="text-lg" aria-hidden="true">{meta?.emoji ?? "🎁"}</span>
        <span class="flex-1 font-medium text-text-primary">{meta?.name ?? entry.id}</span>
        <span class="font-data text-text-muted">{dateID(entry.date)}</span>
        <span class="font-data tabular-nums text-text-muted">{rupiah(entry.rupiah)}</span>
      </li>
    {/each}
  </ul>
{:else}
  <p class="rounded-md border border-dashed border-line px-4 py-6 text-center text-sm text-text-muted">
    No rewards redeemed yet. Study to earn coins, then treat yourself.
  </p>
{/if}
