<script lang="ts">
  import { onMount } from "svelte";
  import { appData } from "../lib/store";

  // Headless island: toggles which server-rendered [data-variant] article is
  // visible based on the persisted difficulty mode. Falls back to expert when
  // this lesson has no authored easy variant.
  let { hasEasy = true }: { hasEasy?: boolean } = $props();

  onMount(() => {
    const apply = (mode: string) => {
      const useEasy = mode === "easy" && hasEasy;
      document.querySelectorAll<HTMLElement>("[data-variant]").forEach((el) => {
        const isEasy = el.dataset.variant === "easy";
        el.hidden = useEasy ? !isEasy : isEasy;
      });
    };
    apply(appData.get().difficultyMode);
    return appData.subscribe((d) => apply(d.difficultyMode));
  });
</script>
