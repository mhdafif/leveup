<script lang="ts">
  import { appData } from "../lib/store";
  import { lessonKey, lessonFraction } from "../lib/progress";
  import ProgressBar from "./ProgressBar.svelte";

  let {
    topic,
    lesson,
    len,
  }: { topic: string; lesson: string; len: number } = $props();

  const fraction = $derived(
    lessonFraction($appData.progress[lessonKey(topic, lesson)], len),
  );
</script>

<div class="flex items-center gap-2">
  <span
    class={`h-2 w-2 shrink-0 rounded-full ${
      fraction >= 1 ? "bg-complete" : fraction > 0 ? "bg-active" : "border border-line"
    }`}
    aria-hidden="true"
  ></span>
  <div class="flex-1">
    <ProgressBar {fraction} showLabel />
  </div>
</div>
