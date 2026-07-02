<script lang="ts">
  import type { Reward } from "../data/rewards";
  import { rupiah } from "../lib/format";

  let {
    reward,
    coins,
    onRedeem,
  }: {
    reward: Reward;
    coins: number;
    onRedeem: (reward: Reward) => void;
  } = $props();

  const affordable = $derived(coins >= reward.coinCost);
</script>

<div class="flex items-center gap-3 rounded-md border border-line bg-panel p-3">
  <span class="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-panel-soft text-2xl" aria-hidden="true">
    {reward.emoji}
  </span>
  <div class="min-w-0 flex-1">
    <p class="truncate font-medium text-text-primary">{reward.name}</p>
    <p class="font-data text-sm text-text-muted">
      <span class="font-semibold text-active">🪙 {reward.coinCost}</span>
      <span class="mx-1">·</span>
      <span>{rupiah(reward.rupiah)}</span>
    </p>
  </div>
  <button
    type="button"
    onclick={() => onRedeem(reward)}
    disabled={!affordable}
    class="shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed
      {affordable
      ? 'bg-active text-ink hover:bg-amber-500/90'
      : 'bg-panel-soft text-text-muted'}"
    title={affordable ? "Redeem this reward" : `Need ${reward.coinCost - coins} more coins`}
  >
    {affordable ? "Redeem" : "Locked"}
  </button>
</div>
