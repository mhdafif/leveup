<script lang="ts">
  import { appData, addReward, updateReward, deleteReward, resetRewards } from "../lib/store";
  import type { Reward } from "../lib/types";

  const rewards = $derived($appData.rewards);
  let open = $state(false);

  let draft = $state({ emoji: "🎁", name: "", coinCost: 100, rupiah: 10000 });

  function commit(r: Reward, patch: Partial<Reward>) {
    updateReward({ ...r, ...patch });
  }

  function addNew() {
    if (!draft.name.trim()) return;
    addReward({
      id: `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
      emoji: draft.emoji.trim() || "🎁",
      name: draft.name.trim(),
      coinCost: Math.max(1, Math.round(draft.coinCost) || 1),
      rupiah: Math.max(0, Math.round(draft.rupiah) || 0),
    });
    draft = { emoji: "🎁", name: "", coinCost: 100, rupiah: 10000 };
  }

  function reset() {
    if (confirm("Reset rewards to the defaults? Your custom rewards will be removed.")) {
      resetRewards();
    }
  }
</script>

<section class="rounded-md border border-line bg-panel p-4">
  <button
    type="button"
    onclick={() => (open = !open)}
    class="flex w-full items-center justify-between text-left"
  >
    <span class="font-data text-xs font-semibold tracking-widest text-text-muted uppercase">
      Manage rewards
    </span>
    <span class="text-text-muted">{open ? "▲" : "▼"}</span>
  </button>

  {#if open}
    <div class="mt-4 space-y-2">
      {#each rewards as r (r.id)}
        <div class="flex flex-wrap items-center gap-2 rounded-md border border-line p-2">
          <input
            value={r.emoji}
            onchange={(e) => commit(r, { emoji: e.currentTarget.value || "🎁" })}
            class="w-12 rounded border border-line bg-panel-soft px-2 py-1 text-center text-text-primary focus-visible:border-active"
            aria-label="Emoji"
          />
          <input
            value={r.name}
            onchange={(e) => commit(r, { name: e.currentTarget.value })}
            class="min-w-32 flex-1 rounded border border-line bg-panel-soft px-2 py-1 text-sm text-text-primary focus-visible:border-active"
            aria-label="Name"
          />
          <label class="flex items-center gap-1 text-xs text-text-muted">
            🪙
            <input
              type="number" min="1"
              value={r.coinCost}
              onchange={(e) => commit(r, { coinCost: Math.max(1, Math.round(+e.currentTarget.value) || 1) })}
              class="w-20 rounded border border-line bg-panel-soft px-2 py-1 text-sm text-text-primary focus-visible:border-active"
              aria-label="Coin cost"
            />
          </label>
          <label class="flex items-center gap-1 text-xs text-text-muted">
            Rp
            <input
              type="number" min="0" step="1000"
              value={r.rupiah}
              onchange={(e) => commit(r, { rupiah: Math.max(0, Math.round(+e.currentTarget.value) || 0) })}
              class="w-24 rounded border border-line bg-panel-soft px-2 py-1 text-sm text-text-primary focus-visible:border-active"
              aria-label="Rupiah value"
            />
          </label>
          <button
            type="button"
            onclick={() => deleteReward(r.id)}
            class="rounded-md px-2 py-1 text-xs text-text-muted hover:bg-panel-soft hover:text-urgency"
          >Delete</button>
        </div>
      {/each}

      <div class="flex flex-wrap items-end gap-2 rounded-md border border-dashed border-line p-2">
        <input bind:value={draft.emoji} class="w-12 rounded border border-line bg-panel-soft px-2 py-1 text-center text-text-primary focus-visible:border-active" aria-label="New emoji" />
        <input bind:value={draft.name} placeholder="New reward name" class="min-w-32 flex-1 rounded border border-line bg-panel-soft px-2 py-1 text-sm text-text-primary focus-visible:border-active" aria-label="New name" />
        <input type="number" min="1" bind:value={draft.coinCost} class="w-20 rounded border border-line bg-panel-soft px-2 py-1 text-sm text-text-primary focus-visible:border-active" aria-label="New coin cost" />
        <input type="number" min="0" step="1000" bind:value={draft.rupiah} class="w-24 rounded border border-line bg-panel-soft px-2 py-1 text-sm text-text-primary focus-visible:border-active" aria-label="New rupiah" />
        <button
          type="button"
          onclick={addNew}
          class="rounded-md bg-active px-3 py-1.5 text-sm font-medium text-ink hover:bg-amber-500/90"
        >Add</button>
      </div>

      <div class="pt-1">
        <button
          type="button"
          onclick={reset}
          class="text-xs font-medium text-text-muted underline hover:text-text-primary"
        >Reset to defaults</button>
      </div>
    </div>
  {/if}
</section>
