<script lang="ts">
  import type { DayActivity } from "../lib/activity";

  let { day }: { day: DayActivity } = $props();
  const classes = ["bg-slate-850", "bg-emerald-950", "bg-emerald-900", "bg-emerald-700", "bg-emerald-400"];
  const minutes = $derived(Math.round(day.focusSeconds / 60));
  const contributionCount = $derived(day.checklistCount + day.reviewCount + day.focusCount);
  const formattedDate = $derived(
    new Date(`${day.date}T00:00:00`).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  );
  const tooltip = $derived(`${contributionCount} contributions on ${formattedDate}`);

  let showTooltip = $state(false);
  let tooltipLeft = $state(0);
  let tooltipTop = $state(0);

  function positionTooltip(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return;
    const rect = target.getBoundingClientRect();
    tooltipLeft = Math.min(Math.max(rect.left + rect.width / 2, 128), window.innerWidth - 128);
    tooltipTop = Math.max(rect.top - 12, 72);
    showTooltip = true;
  }
</script>

<span class="inline-block">
  <button
    type="button"
    class={`h-3.5 w-3.5 rounded-[3px] border border-line/70 ${classes[day.intensity]}`}
    aria-label={`${contributionCount} contributions on ${formattedDate}: ${day.checklistCount} checklist items, ${day.reviewCount} reviews, ${day.focusCount} focus sessions, ${minutes} focus minutes`}
    onpointerenter={(event) => positionTooltip(event.currentTarget)}
    onpointerleave={() => (showTooltip = false)}
    onfocus={(event) => positionTooltip(event.currentTarget)}
    onblur={() => (showTooltip = false)}
  >
  </button>
  {#if showTooltip}
    <span
      class="pointer-events-none fixed z-[100] w-64 -translate-x-1/2 -translate-y-full rounded-md border border-line bg-ink px-3 py-2 text-left text-xs text-text-primary shadow-xl"
      style={`left:${tooltipLeft}px;top:${tooltipTop}px`}
      role="tooltip"
    >
      <span class="block font-medium">{tooltip}</span>
      <span class="mt-1 block text-text-muted">
        {day.checklistCount} checklist · {day.reviewCount} reviews · {day.focusCount} focus sessions · {minutes} focus min
      </span>
    </span>
  {/if}
</span>
