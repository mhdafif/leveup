import { Marked, type Tokens } from "marked";

// Renders user-uploaded markdown to HTML on the client, matching the built-in
// pipeline as closely as possible: mermaid fences become <pre class="mermaid">
// (rendered by the Mermaid island), GitHub-style callouts reuse the existing
// .markdown-alert styles, and code blocks are highlighted with Shiki
// (lazy-loaded, single dark theme, emitting .astro-code so global CSS applies).

const ALERT_TITLES: Record<string, string> = {
  note: "Note",
  tip: "Tip",
  important: "Important",
  warning: "Warning",
  caution: "Caution",
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

type ShikiHighlighter = {
  codeToHtml: (code: string, opts: Record<string, unknown>) => string;
  getLoadedLanguages: () => string[];
};

let highlighterPromise: Promise<ShikiHighlighter> | null = null;
function getHighlighter(): Promise<ShikiHighlighter> {
  if (!highlighterPromise) {
    highlighterPromise = import("shiki").then(({ createHighlighter }) =>
      createHighlighter({
        themes: ["github-dark-default"],
        langs: [
          "javascript", "typescript", "tsx", "jsx", "json", "bash", "shell",
          "python", "html", "css", "markdown", "sql", "rust", "go", "yaml",
          "c", "cpp", "java", "php", "ruby", "diff",
        ],
      }),
    ) as Promise<ShikiHighlighter>;
  }
  return highlighterPromise;
}

const calloutExtension = {
  name: "callout",
  level: "block" as const,
  start(src: string) {
    return src.match(/^> ?\[!/m)?.index;
  },
  tokenizer(this: { lexer: { blockTokens: (s: string, t?: unknown[]) => unknown[] } }, src: string) {
    const rule = /^(?:> ?\[!(note|tip|important|warning|caution)\][^\n]*\n?)((?:> ?[^\n]*(?:\n|$))*)/i;
    const m = rule.exec(src);
    if (!m) return undefined;
    const variant = m[1].toLowerCase();
    const body = m[2].replace(/^> ?/gm, "").trim();
    return {
      type: "callout",
      raw: m[0],
      variant,
      tokens: this.lexer.blockTokens(body, []),
    };
  },
  renderer(this: { parser: { parse: (t: unknown[]) => string } }, token: { variant: string; tokens: unknown[] }) {
    const inner = this.parser.parse(token.tokens);
    const title = ALERT_TITLES[token.variant] ?? "Note";
    return `<div class="markdown-alert markdown-alert-${token.variant}"><p class="markdown-alert-title">${title}</p>${inner}</div>`;
  },
};

export async function renderMarkdown(md: string): Promise<string> {
  const marked = new Marked({ gfm: true });

  marked.use({
    async: true,
    extensions: [calloutExtension as never],
    walkTokens: async (token) => {
      if (token.type === "code") {
        const lang = ((token as Tokens.Code).lang || "").trim().split(/\s+/)[0];
        if (lang === "mermaid") return;
        const hl = await getHighlighter();
        const useLang = hl.getLoadedLanguages().includes(lang) ? lang : "text";
        (token as Record<string, unknown>).highlighted = hl.codeToHtml((token as Tokens.Code).text, {
          lang: useLang,
          theme: "github-dark-default",
        });
      }
    },
    renderer: {
      code(token: Tokens.Code) {
        const lang = (token.lang || "").trim().split(/\s+/)[0];
        if (lang === "mermaid") {
          return `<pre class="mermaid" data-mermaid>${escapeHtml(token.text)}</pre>`;
        }
        const highlighted = (token as Record<string, unknown>).highlighted as string | undefined;
        if (highlighted) {
          return highlighted.replace('class="shiki', 'class="astro-code shiki');
        }
        return `<pre><code>${escapeHtml(token.text)}</code></pre>`;
      },
    },
  });

  return marked.parse(md) as Promise<string>;
}
