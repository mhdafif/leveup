// Renders all <pre class="mermaid"> blocks currently in the document. Mermaid is
// dynamically imported only when at least one diagram is present, so pages
// without diagrams pay nothing. Safe to call repeatedly (e.g. on theme change).
export async function renderMermaidDiagrams(): Promise<void> {
  const nodes = document.querySelectorAll<HTMLElement>("pre.mermaid");
  if (!nodes.length) return;

  const { default: mermaid } = await import("mermaid");
  mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    themeVariables: {
      darkMode: true,
      background: "#0B0F14",
      primaryColor: "#121822",
      primaryTextColor: "#CFD8E3",
      primaryBorderColor: "#232C3A",
      lineColor: "#76869C",
      secondaryColor: "#1A2230",
      tertiaryColor: "#1A2230",
      textColor: "#CFD8E3",
      mainBkg: "#121822",
      nodeBorder: "#232C3A",
      clusterBkg: "#1A2230",
      clusterBorder: "#232C3A",
      edgeLabelBackground: "#0B0F14",
      fontFamily: "Inter, system-ui, sans-serif",
    },
    securityLevel: "loose",
  });

  let i = 0;
  for (const el of nodes) {
    const source = el.getAttribute("data-source") ?? el.textContent ?? "";
    el.setAttribute("data-source", source);
    try {
      const { svg } = await mermaid.render(`mmd-${Date.now()}-${i++}`, source);
      el.innerHTML = svg;
      el.setAttribute("data-rendered", "");
    } catch {
      el.innerHTML = '<span class="text-sm text-red-500">Could not render diagram</span>';
    }
  }
}
