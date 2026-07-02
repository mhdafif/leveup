<script lang="ts">
  import { onMount } from "svelte";
  import { onToast, type ToastDetail } from "../lib/events";

  interface Item extends ToastDetail {
    id: number;
  }

  let items = $state<Item[]>([]);
  let nextId = 0;

  function push(detail: ToastDetail) {
    const id = nextId++;
    items = [...items, { ...detail, id }];
    setTimeout(() => {
      items = items.filter((i) => i.id !== id);
    }, 3500);
  }

  onMount(() => onToast(push));
</script>

<div class="pointer-events-none fixed inset-x-0 top-20 z-[70] flex flex-col items-center gap-2 px-4">
  {#each items as item (item.id)}
    <div
      class="pointer-events-auto flex items-center gap-3 rounded-md border border-line bg-panel px-4 py-2.5 shadow-lg"
    >
      {#if item.icon}<span class="text-xl">{item.icon}</span>{/if}
      <div>
        <p class="text-sm font-semibold text-text-primary">{item.title}</p>
        {#if item.message}
          <p class="text-xs text-text-muted">{item.message}</p>
        {/if}
      </div>
    </div>
  {/each}
</div>
