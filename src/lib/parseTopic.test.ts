import { describe, expect, it } from "vitest";
import { parseTopic, slugify } from "./parseTopic";

const VALID = `---
title: My Topic
icon: "📦"
description: A short summary.
---

# First Subtopic

Some theory about arrays.

## Checklist
- [ ] Understand memory
- [x] Big-O of access

# Second Subtopic

More theory.

## Checklist
- [ ] Another item
`;

describe("slugify", () => {
  it("lowercases, hyphenates, trims", () => {
    expect(slugify("Hash Tables!")).toBe("hash-tables");
    expect(slugify("  A B  ")).toBe("a-b");
    expect(slugify("###")).toBe("untitled");
  });
});

describe("parseTopic — valid", () => {
  const { topic, errors, warnings } = parseTopic(VALID);

  it("has no errors and reads frontmatter", () => {
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
    expect(topic!.title).toBe("My Topic");
    expect(topic!.icon).toBe("📦");
    expect(topic!.description).toBe("A short summary.");
  });

  it("generates a prefixed id", () => {
    expect(topic!.id).toMatch(/^u-my-topic-[a-z0-9]+$/);
  });

  it("splits subtopics with slugs and ordered lessons", () => {
    expect(topic!.lessons.map((l) => l.title)).toEqual(["First Subtopic", "Second Subtopic"]);
    expect(topic!.lessons.map((l) => l.slug)).toEqual(["first-subtopic", "second-subtopic"]);
  });

  it("extracts checklist items (checked or not)", () => {
    expect(topic!.lessons[0].checklist).toEqual(["Understand memory", "Big-O of access"]);
    expect(topic!.lessons[1].checklist).toEqual(["Another item"]);
  });

  it("strips the checklist section from the rendered body", () => {
    expect(topic!.lessons[0].body).toContain("Some theory about arrays.");
    expect(topic!.lessons[0].body).not.toContain("Checklist");
    expect(topic!.lessons[0].body).not.toContain("[ ]");
  });
});

describe("parseTopic — errors & warnings", () => {
  it("errors when title is missing", () => {
    const { topic, errors } = parseTopic(`---\nicon: "x"\n---\n\n# A\n\n## Checklist\n- [ ] x`);
    expect(topic).toBeNull();
    expect(errors.join(" ")).toMatch(/title/i);
  });

  it("errors when there are no subtopics", () => {
    const { topic, errors } = parseTopic(`---\ntitle: T\n---\n\nJust prose, no headings.`);
    expect(topic).toBeNull();
    expect(errors.join(" ")).toMatch(/subtopic/i);
  });

  it("warns when a subtopic has no checklist but still parses", () => {
    const { topic, warnings } = parseTopic(`---\ntitle: T\n---\n\n# Lonely\n\nJust theory.`);
    expect(topic!.lessons[0].checklist).toEqual([]);
    expect(topic!.lessons[0].body).toContain("Just theory.");
    expect(warnings.join(" ")).toMatch(/no checklist/i);
  });

  it("deduplicates slugs for repeated titles", () => {
    const { topic } = parseTopic(`---\ntitle: T\n---\n\n# Same\n\n## Checklist\n- [ ] a\n\n# Same\n\n## Checklist\n- [ ] b`);
    expect(topic!.lessons.map((l) => l.slug)).toEqual(["same", "same-2"]);
  });
});

describe("parseTopic — code fences", () => {
  it("does not treat a '#' line inside a code block as a subtopic", () => {
    const md = `---\ntitle: T\n---\n\n# Real Subtopic\n\n\`\`\`bash\n# this is a shell comment\n\`\`\`\n\n## Checklist\n- [ ] x`;
    const { topic } = parseTopic(md);
    expect(topic!.lessons).toHaveLength(1);
    expect(topic!.lessons[0].title).toBe("Real Subtopic");
    expect(topic!.lessons[0].body).toContain("# this is a shell comment");
  });
});
