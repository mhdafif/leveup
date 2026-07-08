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
    { label: "5m", seconds: 300 },
    { label: "25m", seconds: 1500 },
    { label: "50m", seconds: 3000 },
  ];

  let open = $state(false);
  let result = $state<{ coins: number; xp: number; seconds: number } | null>(null);
  let customMinutes = $state(25);
  let root: HTMLDivElement;
  let now = $state(Date.now());

  onMount(() => {
    const id = setInterval(() => (now = Date.now()), 1000);
    return () => clearInterval(id);
  });

  const selected = $derived($timerState.selectedSeconds);
  const running = $derived($timerState.running);
  const remaining = $derived(computeRemaining($timerState, now));
  const elapsed = $derived(selected - remaining);
  const label = $derived(`${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`);

  // Auto-settle a running timer that reaches zero.
  $effect(() => {
    if ($timerState.running && remaining <= 0) pauseTimer();
  });

  function start() {
    result = null;
    startTimer();
  }

  function applyCustomTime() {
    const minutes = Math.max(1, Math.min(180, Math.round(customMinutes) || 1));
    customMinutes = minutes;
    setDuration(minutes * 60);
  }

  function complete() {
    const done = elapsed;
    pauseTimer();
    result = completeFocusSession(done);
    resetTimer(selected);
  }

  function onWindowPointerdown(event: PointerEvent) {
    if (open && root && !root.contains(event.target as Node)) open = false;
  }
</script>

<svelte:window on:pointerdown={onWindowPointerdown} />

<div class="relative" bind:this={root}>
  <button
    type="button"
    onclick={() => (open = !open)}
    class={`row-hover flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-data text-sm font-semibold transition ${running ? "border-complete bg-complete/10 text-complete" : "border-line bg-panel text-text-muted hover:bg-panel-soft hover:text-text-primary"}`}
    aria-expanded={open}
    aria-label="Focus timer"
  >
    <span aria-hidden="true">⏱</span>
    <span class="tabular-nums">{label}</span>
  </button>

  {#if open}
    <div class="absolute right-0 top-10 z-[70] w-72 rounded-md border border-line bg-panel p-3 shadow-xl">
      <div class="flex items-center justify-between gap-3">
        <p class="font-data text-xs font-semibold tracking-widest text-text-muted uppercase">Focus timer</p>
        <span class="text-xs text-text-muted">1 coin / 5m</span>
      </div>

      <div class="mt-3 flex gap-1.5">
        {#each presets as preset}
          <button
            type="button"
            onclick={() => setDuration(preset.seconds)}
            class={`rounded-md px-2.5 py-1 text-xs font-medium ${selected === preset.seconds ? "bg-active text-ink" : "border border-line text-text-primary hover:bg-panel-soft"}`}
          >
            {preset.label}
          </button>
        {/each}
      </div>

      <div class="mt-3 flex items-end gap-2">
        <label class="flex-1 text-xs text-text-muted">
          Custom minutes
          <input
            type="number"
            min="1"
            max="180"
            bind:value={customMinutes}
            class="mt-1 w-full rounded-md border border-line bg-panel-soft px-2 py-1.5 font-data text-sm text-text-primary outline-none focus:border-active"
          />
        </label>
        <button type="button" onclick={applyCustomTime} class="rounded-md border border-line px-3 py-1.5 text-sm font-medium text-text-primary hover:bg-panel-soft">Set</button>
      </div>

      <div class="my-4 text-center font-data text-4xl font-semibold tabular-nums text-active">{label}</div>

      <div class="h-1.5 overflow-hidden rounded-full bg-line">
        <div class="h-full rounded-full bg-active transition-[width]" style={`width:${Math.round((elapsed / selected) * 100)}%`}></div>
      </div>

      <div class="mt-3 flex gap-2">
        <button type="button" onclick={start} disabled={running} class="flex-1 rounded-md bg-active px-3 py-1.5 text-sm font-medium text-ink disabled:opacity-50">Start</button>
        <button type="button" onclick={pauseTimer} disabled={!running} class="flex-1 rounded-md border border-line px-3 py-1.5 text-sm font-medium text-text-primary hover:bg-panel-soft disabled:opacity-50">Pause</button>
        <button type="button" onclick={complete} disabled={elapsed <= 0} class="flex-1 rounded-md border border-complete px-3 py-1.5 text-sm font-medium text-complete hover:bg-panel-soft disabled:opacity-50">Save</button>
      </div>

      {#if result}
        <p class="mt-3 rounded-md bg-panel-soft px-3 py-2 text-xs text-text-primary">
          Saved {Math.round(result.seconds / 60)} min · +{result.coins} coins · +{result.xp} XP
        </p>
      {/if}
    </div>
  {/if}
</div>
