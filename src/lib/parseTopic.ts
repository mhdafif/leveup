import type { UserLesson, UserTopic } from "./types";

// Parses an uploaded topic markdown file (one file = one topic). See the
// authoring format: frontmatter = topic meta, each `# H1` = a subtopic, a
// `## Checklist` task list = that subtopic's checklist (stripped from the body).

export interface ParseResult {
  topic: UserTopic | null;
  errors: string[];
  warnings: string[];
}

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "untitled"
  );
}

function parseFrontmatter(md: string): { meta: Record<string, string>; body: string } {
  const match = md.match(/^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { meta: {}, body: md };
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z][\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    meta[kv[1].toLowerCase()] = value;
  }
  return { meta, body: md.slice(match[0].length) };
}

// Split the body into subtopics by `# ` H1 headings, ignoring headings that
// appear inside fenced code blocks.
function splitSubtopics(body: string): { title: string; content: string }[] {
  const sections: { title: string; content: string[] }[] = [];
  let current: { title: string; content: string[] } | null = null;
  let fence: string | null = null;

  for (const line of body.split(/\r?\n/)) {
    const fenceMatch = line.match(/^\s*(```|~~~)/);
    if (fenceMatch && !fence) fence = fenceMatch[1];
    else if (fence && line.trimStart().startsWith(fence)) fence = null;

    if (!fence) {
      const h1 = line.match(/^#\s+(.+?)\s*$/);
      if (h1) {
        current = { title: h1[1].trim(), content: [] };
        sections.push(current);
        continue;
      }
    }
    if (current) current.content.push(line);
  }

  return sections.map((s) => ({ title: s.title, content: s.content.join("\n").trim() }));
}

// From one subtopic's content, pull out the `## Checklist` task list and return
// the body with that section removed.
function extractChecklist(content: string): { checklist: string[]; body: string } {
  const checklist: string[] = [];
  const bodyLines: string[] = [];
  let inChecklist = false;
  let fence: string | null = null;

  for (const line of content.split(/\r?\n/)) {
    const fenceMatch = line.match(/^\s*(```|~~~)/);
    if (fenceMatch && !fence) fence = fenceMatch[1];
    else if (fence && line.trimStart().startsWith(fence)) fence = null;

    if (!fence) {
      const heading = line.match(/^#{2,6}\s+(.+?)\s*$/);
      if (heading) {
        inChecklist = /^checklist$/i.test(heading[1].trim());
        if (inChecklist) continue; // drop the "## Checklist" heading itself
        bodyLines.push(line);
        continue;
      }
      if (inChecklist) {
        const task = line.match(/^\s*[-*]\s+\[[ xX]\]\s+(.+?)\s*$/);
        if (task) {
          checklist.push(task[1].trim());
          continue;
        }
        if (line.trim() === "") continue; // tolerate blank lines in the list
        inChecklist = false; // anything else ends the checklist section
      }
    }
    bodyLines.push(line);
  }

  return { checklist, body: bodyLines.join("\n").trim() };
}

export function parseTopic(markdown: string): ParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const { meta, body } = parseFrontmatter(markdown);
  const title = (meta.title ?? "").trim();
  if (!title) errors.push("Missing `title` in frontmatter.");

  const rawSections = splitSubtopics(body);
  if (rawSections.length === 0) {
    errors.push("No subtopics found — add at least one `# Subtopic` heading.");
  }

  const usedSlugs = new Set<string>();
  const lessons: UserLesson[] = rawSections.map((section) => {
    const { checklist, body: lessonBody } = extractChecklist(section.content);
    if (checklist.length === 0) {
      warnings.push(`Subtopic "${section.title}" has no checklist items.`);
    }
    let slug = slugify(section.title);
    let unique = slug;
    let n = 2;
    while (usedSlugs.has(unique)) unique = `${slug}-${n++}`;
    usedSlugs.add(unique);
    return { slug: unique, title: section.title, checklist, body: lessonBody };
  });

  if (errors.length) return { topic: null, errors, warnings };

  const topic: UserTopic = {
    id: `u-${slugify(title)}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    icon: meta.icon || undefined,
    description: meta.description || undefined,
    createdAt: new Date().toISOString(),
    lessons,
  };
  return { topic, errors, warnings };
}
