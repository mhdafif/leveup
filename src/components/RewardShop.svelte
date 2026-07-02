<script lang="ts">
  import { appData, redeemReward } from "../lib/store";
  import { WEEKLY_ALLOWANCE_CAP } from "../data/rewards";
  import type { Reward } from "../lib/types";
  import { rupiah } from "../lib/format";
  import { toast } from "../lib/events";
  import RewardRow from "./RewardRow.svelte";
  import RedemptionList from "./RedemptionList.svelte";

  const coins = $derived($appData.coins);
  const rewards = $derived($appData.rewards);

  function within7Days(dateISO: string): boolean {
    const d = new Date(`${dateISO}T00:00:00`);
    const diff = (Date.now() - d.getTime()) / 86_400_000;
    return diff >= 0 && diff < 7;
  }

  const spentThisWeek = $derived(
    $appData.redeemed.filter((r) => within7Days(r.date)).reduce((s, r) => s + r.rupiah, 0),
  );
  const overCap = $derived(spentThisWeek > WEEKLY_ALLOWANCE_CAP);

  function handleRedeem(reward: Reward) {
    const ok = redeemReward({
      id: reward.id,
      coinCost: reward.coinCost,
      rupiah: reward.rupiah,
    });
    if (ok) {
      toast({
        icon: reward.emoji,
        title: `Redeemed: ${reward.name}`,
        message: `Treat yourself — ${rupiah(reward.rupiah)}`,
      });
    }
  }
</script>

<div class="space-y-6">
  <div class="flex flex-wrap items-center justify-between gap-3 rounded-md border border-line bg-panel px-4 py-3">
    <span class="flex items-center gap-2 font-data text-lg font-semibold text-active">
      <span aria-hidden="true">🪙</span>
      <span class="tabular-nums">{coins}</span>
      <span class="text-sm font-normal text-text-muted">coins available</span>
    </span>
    <span class="font-data text-sm text-text-muted">
      This week: <span class="font-medium" class:text-urgency={overCap}>{rupiah(spentThisWeek)}</span>
      / {rupiah(WEEKLY_ALLOWANCE_CAP)}
    </span>
  </div>

  {#if overCap}
    <p class="rounded-md border border-urgency bg-panel px-4 py-2 text-sm text-urgency">
      Heads up — you're over your weekly allowance. Maybe save the next treat for next week.
    </p>
  {/if}

  {#if rewards.length === 0}
    <p class="rounded-md border border-dashed border-line px-4 py-6 text-center text-sm text-text-muted">
      No rewards yet. Add some below, or reset to the defaults.
    </p>
  {:else}
    <div class="grid gap-3 sm:grid-cols-2">
      {#each rewards as reward (reward.id)}
        <RewardRow {reward} {coins} onRedeem={handleRedeem} />
      {/each}
    </div>
  {/if}

  <section>
    <h2 class="mb-3 font-data text-xs font-semibold tracking-widest text-text-muted uppercase">
      Redemption history
    </h2>
    <RedemptionList />
  </section>
</div>
