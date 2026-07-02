<script lang="ts">
  import { exportData, importData, resetAll } from "../lib/store";
  import { toast } from "../lib/events";

  let fileInput: HTMLInputElement;

  function doExport() {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `levelup-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ icon: "💾", title: "Backup downloaded" });
  }

  function onFile(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importData(String(reader.result));
      toast(
        ok
          ? { icon: "✅", title: "Data imported", message: "Your progress is back." }
          : { icon: "⚠️", title: "Import failed", message: "That file isn't valid." },
      );
    };
    reader.readAsText(file);
    input.value = "";
  }

  function doReset() {
    if (confirm("Reset ALL progress, coins, notes, and badges? This cannot be undone.")) {
      resetAll();
      toast({ icon: "🧹", title: "Everything reset" });
    }
  }
</script>

<div class="rounded-md border border-line bg-panel p-4">
  <h2 class="font-data text-xs font-semibold tracking-widest text-text-muted uppercase">
    Your data
  </h2>
  <p class="mt-1 text-sm text-text-muted">
    Progress lives in this browser. Export a backup to move it to another device.
  </p>
  <div class="mt-3 flex flex-wrap gap-2">
    <button
      type="button"
      onclick={doExport}
      class="rounded-md bg-active px-3 py-1.5 text-sm font-medium text-ink hover:bg-amber-500/90"
    >
      Export backup
    </button>
    <button
      type="button"
      onclick={() => fileInput.click()}
      class="rounded-md border border-line px-3 py-1.5 text-sm font-medium text-text-primary hover:bg-panel-soft"
    >
      Import backup
    </button>
    <button
      type="button"
      onclick={doReset}
      class="rounded-md border border-urgency px-3 py-1.5 text-sm font-medium text-urgency hover:bg-panel-soft"
    >
      Reset all
    </button>
    <input
      bind:this={fileInput}
      type="file"
      accept="application/json"
      class="hidden"
      onchange={onFile}
    />
  </div>
</div>
