<script lang="ts">
  import { appData, setNote } from "../lib/store";
  import { lessonKey } from "../lib/progress";

  let { topic, lesson }: { topic: string; lesson: string } = $props();
  const key = lessonKey(topic, lesson);

  // Seed once from the store; saves are debounced back to it.
  let value = $state(appData.get().notes[key] ?? "");
  let saved = $state(true);
  let timer: ReturnType<typeof setTimeout>;

  function onInput(e: Event) {
    value = (e.currentTarget as HTMLTextAreaElement).value;
    saved = false;
    clearTimeout(timer);
    timer = setTimeout(() => {
      setNote(key, value);
      saved = true;
    }, 400);
  }
</script>

<section class="rounded-md border border-line bg-panel p-4">
  <div class="mb-2 flex items-center justify-between">
    <h2 class="font-data text-xs font-semibold tracking-widest text-text-muted uppercase">
      My notes
    </h2>
    <span class="font-data text-xs text-text-muted">{saved ? "Saved" : "Saving…"}</span>
  </div>
  <textarea
    value={value}
    oninput={onInput}
    rows="6"
    placeholder="Jot down your own notes, questions, or links for this lesson…"
    class="w-full resize-y rounded-md border border-line bg-panel-soft p-3 text-sm text-text-primary outline-none focus:border-active focus:ring-2 focus:ring-active/30"
  ></textarea>
</section>
