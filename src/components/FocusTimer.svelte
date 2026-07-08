<script lang="ts">
  import { onMount } from "svelte";
  import { completeFocusSession } from "../lib/store";
  import {
    timerState,
    computeRemaining,
    startTimer,
    pauseTimer,
    resetTimer,
    setDuration,
  } from "../lib/timerStore";

  const presets = [
    { label: "5 min", seconds: 300 },
    { label: "25 min", seconds: 1500 },
    { label: "50 min", seconds: 3000 },
  ];

  let result = $state<{ coins: number; xp: number; seconds: number } | null>(null);
  let now = $state(Date.now());

  onMount(() => {
    const id = setInterval(() => (now = Date.now()), 1000);
    return () => clearInterval(id);
  });

  const selected = $derived($timerState.selectedSeconds);
  const running = $derived($timerState.running);
  const remaining = $derived(computeRemaining($timerState, now));
  const elapsed = $derived(selected - remaining);
  const minutes = $derived(Math.floor(remaining / 60));
  const seconds = $derived(remaining % 60);

  // Auto-settle a running timer that reaches zero.
  $effect(() => {
    if ($timerState.running && remaining <= 0) pauseTimer();
  });

  function start() {
    result = null;
    startTimer();
  }

  function complete() {
    const done = elapsed;
    pauseTimer();
    result = completeFocusSession(done);
    resetTimer(selected);
  }
</script>

<section class="rounded-md border border-line bg-panel p-5">
  <div class="flex flex-wrap gap-2">
    {#each presets as preset}
      <button
        type="button"
        onclick={() => setDuration(preset.seconds)}
        class={`rounded-md px-3 py-1.5 text-sm font-medium ${selected === preset.seconds ? "bg-active text-ink" : "border border-line text-text-primary hover:bg-panel-soft"}`}
      >
        {preset.label}
      </button>
    {/each}
  </div>

  <div class="my-8 text-center font-data text-6xl font-semibold tabular-nums text-active">
    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
  </div>

  <div class="h-2 overflow-hidden rounded-full bg-line">
    <div class="h-full rounded-full bg-active transition-[width]" style={`width:${Math.round((elapsed / selected) * 100)}%`}></div>
  </div>

  <div class="mt-5 flex flex-wrap justify-center gap-2">
    <button type="button" onclick={start} disabled={running} class="rounded-md bg-active px-4 py-2 text-sm font-medium text-ink disabled:opacity-50">Start</button>
    <button type="button" onclick={pauseTimer} disabled={!running} class="rounded-md border border-line px-4 py-2 text-sm font-medium text-text-primary hover:bg-panel-soft disabled:opacity-50">Pause</button>
    <button type="button" onclick={() => resetTimer()} class="rounded-md border border-line px-4 py-2 text-sm font-medium text-text-primary hover:bg-panel-soft">Reset</button>
    <button type="button" onclick={complete} disabled={elapsed <= 0} class="rounded-md border border-complete px-4 py-2 text-sm font-medium text-complete hover:bg-panel-soft disabled:opacity-50">Complete</button>
  </div>

  {#if result}
    <p class="mt-4 rounded-md border border-line bg-panel-soft px-4 py-3 text-center text-sm text-text-primary">
      Session saved: {Math.round(result.seconds / 60)} min · +{result.coins} coins · +{result.xp} XP
    </p>
  {/if}
</section>
