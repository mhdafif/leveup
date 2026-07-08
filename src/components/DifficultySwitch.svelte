<script lang="ts">
  import { appData, setDifficultyMode } from "../lib/store";
  import type { DifficultyMode } from "../lib/types";

  // Optional hint that the current lesson has no authored easy variant, so the
  // Easy option falls back to the expert content.
  let { hasEasy = true }: { hasEasy?: boolean } = $props();

  const options: { key: DifficultyMode; label: string }[] = [
    { key: "easy", label: "Easy" },
    { key: "expert", label: "Expert" },
  ];

  const mode = $derived($appData.difficultyMode);
</script>

<div class="inline-flex items-center gap-2">
  <div class="inline-flex rounded-md border border-line bg-panel p-0.5" role="radiogroup" aria-label="Explanation difficulty">
    {#each options as opt}
      <button
        type="button"
        role="radio"
        aria-checked={mode === opt.key}
        onclick={() => setDifficultyMode(opt.key)}
        class={`rounded-[5px] px-3 py-1 text-xs font-medium transition ${mode === opt.key ? "bg-active text-ink" : "text-text-muted hover:text-text-primary"}`}
      >
        {opt.label}
      </button>
    {/each}
  </div>
  {#if mode === "easy" && !hasEasy}
    <span class="text-xs text-text-muted">Easy version coming soon — showing expert</span>
  {/if}
</div>
