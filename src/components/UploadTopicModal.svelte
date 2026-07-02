<script lang="ts">
  import { addUserTopic } from "../lib/store";
  import { parseTopic, type ParseResult } from "../lib/parseTopic";
  import { toast } from "../lib/events";

  let { open = false, onClose }: { open?: boolean; onClose: () => void } = $props();

  let text = $state("");
  let result = $state<ParseResult | null>(null);

  function parse() {
    result = text.trim() ? parseTopic(text) : null;
  }

  function onFile(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      text = String(reader.result);
      parse();
    };
    reader.readAsText(file);
    input.value = "";
  }

  function add() {
    if (!result?.topic) return;
    addUserTopic(result.topic);
    toast({ icon: result.topic.icon || "📚", title: "Topic added", message: result.topic.title });
    reset();
    onClose();
  }

  function reset() {
    text = "";
    result = null;
  }

  function close() {
    reset();
    onClose();
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") close();
  }
</script>

<svelte:window on:keydown={onKeydown} />

{#if open}
  <div
    class="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-ink/60 p-4 sm:p-8"
    onclick={close}
    role="presentation"
  >
    <div
      class="w-full max-w-2xl rounded-md border border-line bg-panel p-5 shadow-xl"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label="Add a topic"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-text-primary">Add a topic</h2>
        <button
          type="button"
          onclick={close}
          class="row-hover grid h-8 w-8 place-items-center rounded-md text-text-muted transition hover:bg-panel-soft"
          aria-label="Close"
        >✕</button>
      </div>
      <p class="mt-1 text-sm text-text-muted">
        Upload or paste a topic markdown file. Need the format?
        <a href="/templates/topic-template.md" download class="text-active hover:underline">Download the template</a>.
      </p>

      <div class="mt-4">
        <input
          type="file"
          accept=".md,text/markdown,text/plain"
          onchange={onFile}
          class="block w-full text-sm text-text-muted file:mr-3 file:rounded-md file:border-0 file:bg-active file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink hover:file:bg-amber-500/90"
        />
      </div>

      <textarea
        bind:value={text}
        oninput={parse}
        rows="8"
        placeholder="…or paste your topic markdown here"
        class="mt-3 w-full resize-y rounded-md border border-line bg-panel-soft p-3 font-data text-xs text-text-primary outline-none focus:border-active focus:ring-2 focus:ring-active/30"
      ></textarea>

      {#if result}
        {#if result.errors.length > 0}
          <div class="mt-3 rounded-md border border-urgency bg-panel px-3 py-2 text-sm text-urgency">
            <p class="font-medium">Can't add this topic:</p>
            <ul class="mt-1 list-disc pl-5">
              {#each result.errors as err}<li>{err}</li>{/each}
            </ul>
          </div>
        {:else if result.topic}
          <div class="mt-3 rounded-md border border-line bg-panel-soft px-3 py-3">
            <p class="font-medium text-text-primary">
              {#if result.topic.icon}<span>{result.topic.icon}</span>{/if}
              {result.topic.title}
              <span class="text-sm font-normal text-text-muted">· {result.topic.lessons.length} subtopic{result.topic.lessons.length === 1 ? "" : "s"}</span>
            </p>
            <ul class="mt-2 space-y-1 text-sm text-text-muted">
              {#each result.topic.lessons as l}
                <li class="flex justify-between"><span>{l.title}</span><span class="font-data text-text-muted">{l.checklist.length} items</span></li>
              {/each}
            </ul>
            {#if result.warnings.length > 0}
              <ul class="mt-2 list-disc pl-5 text-xs text-active">
                {#each result.warnings as w}<li>{w}</li>{/each}
              </ul>
            {/if}
          </div>
        {/if}
      {/if}

      <div class="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onclick={close}
          class="rounded-md border border-line px-3 py-1.5 text-sm font-medium text-text-primary hover:bg-panel-soft"
        >Cancel</button>
        <button
          type="button"
          onclick={add}
          disabled={!result?.topic}
          class="rounded-md bg-active px-3 py-1.5 text-sm font-medium text-ink hover:bg-amber-500/90 disabled:cursor-not-allowed disabled:opacity-50"
        >Add to my topics</button>
      </div>
    </div>
  </div>
{/if}
