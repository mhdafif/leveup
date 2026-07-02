import { visit } from "unist-util-visit";

const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Replace ```mermaid fenced code blocks with a <pre class="mermaid"> node so the
// Mermaid island can render them client-side. This runs before Shiki, so the
// diagram source is never syntax-highlighted as code.
export function remarkMermaid() {
  return (tree) => {
    visit(tree, "code", (node, index, parent) => {
      if (node.lang !== "mermaid" || !parent || index === undefined) return;
      parent.children[index] = {
        type: "html",
        value: `<pre class="mermaid" data-mermaid>${escapeHtml(node.value)}</pre>`,
      };
    });
  };
}
