<script lang="ts">
  let {
    label,
    checked = false,
    onToggle,
  }: {
    label: string;
    checked?: boolean;
    onToggle: (checked: boolean) => void;
  } = $props();

  let justChecked = $state(false);

  function handleChange(e: Event) {
    const next = (e.currentTarget as HTMLInputElement).checked;
    if (next && !checked) {
      justChecked = true;
      setTimeout(() => (justChecked = false), 280);
    }
    onToggle(next);
  }
</script>

<label
  class="row-hover flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 transition hover:bg-panel-soft"
>
  <input
    type="checkbox"
    class="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-line bg-panel accent-complete focus-visible:ring-2 focus-visible:ring-active"
    {checked}
    onchange={handleChange}
  />
  <span
    class:stamp-in={justChecked}
    class:line-through={checked}
    class:text-text-muted={checked}
    class="text-sm leading-6 text-text-primary"
  >
    {label}
  </span>
</label>
