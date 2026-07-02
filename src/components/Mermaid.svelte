<script lang="ts">
  import { onMount } from "svelte";
  import { renderMermaidDiagrams } from "../lib/renderMermaid";

  // Renders any <pre class="mermaid"> blocks on the page and re-renders on theme
  // change. The actual mermaid library is lazy-loaded inside the helper.
  onMount(() => {
    renderMermaidDiagrams();
    const observer = new MutationObserver(() => renderMermaidDiagrams());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  });
</script>
