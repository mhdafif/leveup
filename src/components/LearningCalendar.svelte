<script lang="ts">
  import { appData } from "../lib/store";
  import { calendarDays, isoDaysAgo } from "../lib/activity";
  import CalendarDayCell from "./CalendarDayCell.svelte";

  // Pure contribution heatmap. Stat cards + range chips live in CalendarDashboard.
  // The week count is not a prop — it's derived from the measured container width
  // so the fixed 12px cells always fill exactly the remaining space with no
  // horizontal scroll, on any screen size.
  // `highlightDays`, when set, dims cells older than that trailing window instead
  // of hiding them, so the selected range reads as a fade, not a resize.
  let { highlightDays }: { highlightDays?: number } = $props();

  const CELL = 12;
  const GAP = 4; // gap-1
  const LABEL_COL = 32 + 8; // weekday label column (2rem) + its gap (gap-2)

  let containerWidth = $state(0);
  // Fallback before the first width measurement lands (avoids rendering 0 columns).
  const weeks = $derived(
    containerWidth > 0
      ? Math.max(1, Math.floor((containerWidth - LABEL_COL + GAP) / (CELL + GAP)))
      : 12,
  );

  const days = $derived(calendarDays($appData.activity, undefined, weeks));
  const highlightCutoff = $derived(highlightDays != null ? isoDaysAgo(highlightDays) : null);
  const columns = $derived(Array.from({ length: weeks }, (_, i) => days.slice(i * 7, i * 7 + 7)));
  const monthLabels = $derived(
    columns.map((week, index) => {
      const first = week[0]?.date;
      if (!first) return "";
      const current = new Date(`${first}T00:00:00`).toLocaleString("en", { month: "short" });
      const prevFirst = columns[index - 1]?.[0]?.date;
      const prev = prevFirst ? new Date(`${prevFirst}T00:00:00`).toLocaleString("en", { month: "short" }) : "";
      return index === 0 || current !== prev ? current : "";
    }),
  );
  const swatches = ["bg-slate-850", "bg-emerald-950", "bg-emerald-900", "bg-emerald-700", "bg-emerald-400"];
</script>

<div class="w-full min-w-0" bind:clientWidth={containerWidth}>
  <div class="ml-9 grid gap-1 text-xs text-text-muted" style={`grid-template-columns:repeat(${weeks},12px)`}>
    {#each monthLabels as label, i (`month-${i}`)}
      <span class="h-5">{label}</span>
    {/each}
  </div>
  <div class="grid grid-cols-[2rem_1fr] gap-2">
    <div class="grid grid-rows-7 gap-1 text-xs text-text-muted">
      <span></span>
      <span>Mon</span>
      <span></span>
      <span>Wed</span>
      <span></span>
      <span>Fri</span>
      <span></span>
    </div>
    <div class="grid gap-1" style={`grid-template-columns:repeat(${weeks},12px)`}>
      {#each columns as week, weekIndex (`week-${weekIndex}`)}
        <div class="grid grid-rows-7 gap-1">
          {#each week as day (day.date)}
            <CalendarDayCell {day} dimmed={highlightCutoff !== null && day.date < highlightCutoff} />
          {/each}
        </div>
      {/each}
    </div>
  </div>
  <div class="mt-3 flex items-center justify-end gap-1 text-xs text-text-muted">
    <span>Less</span>
    {#each swatches as swatch}
      <span class={`h-3.5 w-3.5 rounded-[3px] border border-line/70 ${swatch}`}></span>
    {/each}
    <span>More</span>
  </div>
</div>

{#if $appData.activity.length === 0}
  <p class="mt-4 rounded-md border border-dashed border-line px-4 py-6 text-center text-sm text-text-muted">
    No activity yet. Complete checklist items, reviews, or focus sessions to fill this calendar.
  </p>
{/if}
