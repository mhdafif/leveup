import { describe, expect, it } from "vitest";
import type { UserTopic } from "./types";
import { userTopicsAsIndex } from "./userTopics";

const topics: UserTopic[] = [
  {
    id: "u-arrays-ab12",
    title: "Arrays",
    icon: "📦",
    description: "About arrays",
    createdAt: "2026-06-27",
    lessons: [
      { slug: "intro", title: "Intro", checklist: ["a", "b"], body: "x" },
      { slug: "ops", title: "Operations", checklist: [], body: "y" },
    ],
  },
];

describe("userTopicsAsIndex", () => {
  const index = userTopicsAsIndex(topics);

  it("maps a topic to TopicMeta using its id as slug", () => {
    expect(index[0].slug).toBe("u-arrays-ab12");
    expect(index[0].title).toBe("Arrays");
    expect(index[0].icon).toBe("📦");
    expect(index[0].order).toBe(1000);
  });

  it("maps lessons with correct checklist lengths", () => {
    expect(index[0].lessons.map((l) => [l.slug, l.checklistLen])).toEqual([
      ["intro", 2],
      ["ops", 0],
    ]);
  });

  it("returns an empty array for no topics", () => {
    expect(userTopicsAsIndex([])).toEqual([]);
  });
});
