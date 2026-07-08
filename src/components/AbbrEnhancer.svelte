<script lang="ts">
  import { onMount } from "svelte";
  import { appData } from "../lib/store";
  import { GLOSSARY } from "../data/glossary";

  // Headless island. Scans lesson prose ([data-lesson-body]) and wraps the first
  // occurrence of each known abbreviation with a hover/click tooltip. In Easy
  // mode it also reveals an inline "(meaning)" after each abbreviation.
  // Works on server-rendered markdown (built-in) and any prose container.

  const SKIP = new Set(["CODE", "PRE", "A", "SCRIPT", "STYLE", "H1", "BUTTON"]);

  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  onMount(() => {
    // Longest terms first so HTTPS wins over HTTP, etc.
    const terms = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
    const bodies = Array.from(document.querySelectorAll<HTMLElement>("[data-lesson-body]"));
    for (const body of bodies) {
      for (const term of terms) wrapFirst(body, term);
    }

    const tip = createTooltip();
    document.body.appendChild(tip.el);

    const onOver = (e: Event) => {
      const t = (e.target as HTMLElement)?.closest?.(".lu-abbr") as HTMLElement | null;
      if (t) tip.show(t);
    };
    const onOut = (e: Event) => {
      if ((e.target as HTMLElement)?.closest?.(".lu-abbr")) tip.hide();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") tip.hide();
    };
    const onScroll = () => tip.hide();

    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("focusin", onOver);
    document.addEventListener("focusout", onOut);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);

    const applyMode = (mode: string) => {
      document.querySelectorAll<HTMLElement>(".lu-abbr-inline").forEach((el) => {
        el.hidden = mode !== "easy";
      });
    };
    applyMode(appData.get().difficultyMode);
    const unsub = appData.subscribe((d) => applyMode(d.difficultyMode));

    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("focusin", onOver);
      document.removeEventListener("focusout", onOut);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      unsub();
      tip.el.remove();
    };
  });

  function wrapFirst(root: HTMLElement, term: string) {
    const re = new RegExp(`\\b${escapeRegExp(term)}\\b`);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !re.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
        let p = node.parentElement;
        while (p && p !== root) {
          if (SKIP.has(p.tagName) || p.classList.contains("lu-abbr")) return NodeFilter.FILTER_REJECT;
          p = p.parentElement;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const node = walker.nextNode() as Text | null;
    if (!node || !node.nodeValue) return;
    const entry = GLOSSARY[term];
    const idx = node.nodeValue.search(re);
    if (idx < 0) return;

    const before = node.nodeValue.slice(0, idx);
    const after = node.nodeValue.slice(idx + term.length);
    const alreadyExplained = /^\s*\(/.test(after); // author wrote "API (…)" — skip inline

    const frag = document.createDocumentFragment();
    if (before) frag.appendChild(document.createTextNode(before));

    const span = document.createElement("span");
    span.className = "lu-abbr";
    span.textContent = term;
    span.tabIndex = 0;
    span.setAttribute("role", "button");
    span.dataset.full = entry.full;
    span.dataset.meaning = entry.meaning;
    span.setAttribute("aria-label", `${term}: ${entry.full} — ${entry.meaning}`);
    span.style.borderBottom = "1px dotted currentColor";
    span.style.cursor = "help";
    frag.appendChild(span);

    if (!alreadyExplained) {
      const inline = document.createElement("span");
      inline.className = "lu-abbr-inline";
      inline.textContent = ` (${entry.meaning})`;
      inline.style.color = "var(--color-text-muted)";
      inline.hidden = true;
      frag.appendChild(inline);
    }

    if (after) frag.appendChild(document.createTextNode(after));
    node.parentNode?.replaceChild(frag, node);
  }

  function createTooltip() {
    const el = document.createElement("div");
    el.setAttribute("role", "tooltip");
    el.style.cssText =
      "position:fixed;z-index:100;max-width:16rem;pointer-events:none;border-radius:6px;" +
      "padding:8px 10px;font-size:12px;line-height:1.4;border:1px solid var(--color-line);" +
      "background:var(--color-panel);color:var(--color-text-primary);" +
      "box-shadow:0 8px 24px rgba(0,0,0,.4);opacity:0;visibility:hidden;transition:opacity .1s;";
    return {
      el,
      show(target: HTMLElement) {
        el.textContent = "";
        const full = document.createElement("div");
        full.style.fontWeight = "600";
        full.textContent = target.dataset.full ?? "";
        const meaning = document.createElement("div");
        meaning.style.color = "var(--color-text-muted)";
        meaning.style.marginTop = "2px";
        meaning.textContent = target.dataset.meaning ?? "";
        el.appendChild(full);
        el.appendChild(meaning);

        const rect = target.getBoundingClientRect();
        const tw = el.offsetWidth || 200;
        const th = el.offsetHeight || 48;
        let left = rect.left + rect.width / 2 - tw / 2;
        left = Math.min(Math.max(left, 8), window.innerWidth - tw - 8);
        let top = rect.top - th - 8;
        if (top < 8) top = rect.bottom + 8;
        el.style.left = `${left}px`;
        el.style.top = `${top}px`;
        el.style.visibility = "visible";
        el.style.opacity = "1";
      },
      hide() {
        el.style.opacity = "0";
        el.style.visibility = "hidden";
      },
    };
  }
</script>
