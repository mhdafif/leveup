<script lang="ts">
  import { appData } from "../lib/store";
  import { calendarDays } from "../lib/activity";
  import CalendarDayCell from "./CalendarDayCell.svelte";

  let { compact = false }: { compact?: boolean } = $props();

  const days = $derived(calendarDays($appData.activity, undefined, 12));
  const weeks = $derived(Array.from({ length: 12 }, (_, i) => days.slice(i * 7, i * 7 + 7)));
  const monthLabels = $derived(
    weeks.map((week, index) => {
      const first = week[0]?.date;
      if (!first) return "";
      const current = new Date(`${first}T00:00:00`).toLocaleString("en", { month: "short" });
      const prevFirst = weeks[index - 1]?.[0]?.date;
      const prev = prevFirst ? new Date(`${prevFirst}T00:00:00`).toLocaleString("en", { month: "short" }) : "";
      return index === 0 || current !== prev ? current : "";
    }),
  );
  const totals = $derived({
    checklist: $appData.activity.filter((a) => a.type === "checklist").reduce((sum, a) => sum + a.count, 0),
    reviews: $appData.activity.filter((a) => a.type === "review").reduce((sum, a) => sum + a.count, 0),
    focusMinutes: Math.round($appData.activity.filter((a) => a.type === "focus").reduce((sum, a) => sum + (a.seconds ?? 0), 0) / 60),
    focusSessions: $appData.activity.filter((a) => a.type === "focus").reduce((sum, a) => sum + a.count, 0),
  });
  const contributionTotal = $derived(totals.checklist + totals.reviews + totals.focusSessions);
  const swatches = ["bg-slate-850", "bg-emerald-950", "bg-emerald-900", "bg-emerald-700", "bg-emerald-400"];
</script>

<section class="rounded-md border border-line bg-panel p-4">
  {#if compact}
    <div class="mb-3 flex items-center justify-between gap-3">
      <div>
        <p class="font-data text-xs font-semibold tracking-widest text-text-muted uppercase">Learning calendar</p>
        <p class="mt-1 text-sm text-text-muted">{contributionTotal} contributions in the last 12 weeks</p>
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-3 gap-3 text-center">
      <div><p class="font-data text-xl text-active">{totals.checklist}</p><p class="text-xs text-text-muted">Checklist</p></div>
      <div><p class="font-data text-xl text-active">{totals.reviews}</p><p class="text-xs text-text-muted">Reviews</p></div>
      <div><p class="font-data text-xl text-active">{totals.focusMinutes}</p><p class="text-xs text-text-muted">Focus min</p></div>
    </div>
  {/if}

  <div class="mt-5 overflow-x-auto pb-2">
    <div class="w-max min-w-full">
      <div class="ml-9 grid grid-cols-12 gap-1 text-xs text-text-muted">
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
        <div class="grid grid-cols-12 gap-1">
          {#each weeks as week, weekIndex (`week-${weekIndex}`)}
            <div class="grid grid-rows-7 gap-1">
              {#each week as day (day.date)}
                <CalendarDayCell {day} />
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
  </div>

  {#if !compact}
    <p class="mt-2 text-xs text-text-muted">
      Contributions count checklist items, reviews, and completed focus sessions.
    </p>
  {/if}

  {#if $appData.activity.length === 0 && !compact}
    <p class="mt-4 rounded-md border border-dashed border-line px-4 py-6 text-center text-sm text-text-muted">
      No activity yet. Complete checklist items, reviews, or focus sessions to fill this calendar.
    </p>
  {/if}
</section>
