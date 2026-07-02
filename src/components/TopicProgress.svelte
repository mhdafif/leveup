<script lang="ts">
  import { appData } from "../lib/store";
  import { lessonDone, lessonKey } from "../lib/progress";
  import { pct } from "../lib/format";
  import ProgressBar from "./ProgressBar.svelte";

  // Lesson metadata is passed from the page so this island needs no fetch.
  let {
    topic,
    lessons,
  }: { topic: string; lessons: { slug: string; checklistLen: number }[] } = $props();

  const counts = $derived.by(() => {
    let done = 0;
    let total = 0;
    for (const l of lessons) {
      total += l.checklistLen;
      done += lessonDone($appData.progress[lessonKey(topic, l.slug)], l.checklistLen);
    }
    return { done, total };
  });

  const fraction = $derived(counts.total > 0 ? counts.done / counts.total : 0);
</script>

<div class="flex items-center gap-2">
  <span
    class={`h-2.5 w-2.5 shrink-0 rounded-full ${
      fraction >= 1 ? "bg-complete" : fraction > 0 ? "bg-active" : "border border-line"
    }`}
    aria-hidden="true"
  ></span>
  <div class="flex-1">
    <ProgressBar {fraction} />
  </div>
</div>
<div class="mt-1.5 font-data text-sm text-text-muted">
  {pct(fraction)}% · {counts.done}/{counts.total} done
</div>
