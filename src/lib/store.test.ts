import { beforeEach, describe, expect, it } from "vitest";
import type { UserTopic } from "./types";
import { defaultData } from "./persistence";
import {
  appData,
  addUserTopic,
  deleteUserTopic,
  addReward,
  updateReward,
  deleteReward,
  resetRewards,
} from "./store";

const topic: UserTopic = {
  id: "u-x-aaa",
  title: "X",
  createdAt: "2026-06-27",
  lessons: [{ slug: "intro", title: "Intro", checklist: ["a"], body: "b" }],
};

beforeEach(() => {
  appData.set(defaultData());
});

describe("user topic actions", () => {
  it("adds a user topic", () => {
    addUserTopic(topic);
    expect(appData.get().userTopics).toHaveLength(1);
  });

  it("deletes a user topic and purges its progress + notes keys", () => {
    addUserTopic(topic);
    appData.set({
      ...appData.get(),
      progress: { "u-x-aaa/intro": [true], "ds/arrays": [true] },
      notes: { "u-x-aaa/intro": "note" },
    });
    deleteUserTopic("u-x-aaa");
    const d = appData.get();
    expect(d.userTopics).toHaveLength(0);
    expect(d.progress["u-x-aaa/intro"]).toBeUndefined();
    expect(d.notes["u-x-aaa/intro"]).toBeUndefined();
    expect(d.progress["ds/arrays"]).toEqual([true]); // unrelated key kept
  });
});

describe("reward CRUD", () => {
  const r = { id: "boba", name: "Boba", emoji: "🧋", coinCost: 100, rupiah: 20000 };

  it("adds, updates, and deletes rewards", () => {
    appData.set({ ...appData.get(), rewards: [] });
    addReward(r);
    expect(appData.get().rewards).toHaveLength(1);
    updateReward({ ...r, coinCost: 200 });
    expect(appData.get().rewards[0].coinCost).toBe(200);
    deleteReward("boba");
    expect(appData.get().rewards).toHaveLength(0);
  });

  it("resets to the seeded defaults", () => {
    appData.set({ ...appData.get(), rewards: [] });
    resetRewards();
    expect(appData.get().rewards.length).toBeGreaterThan(0);
  });
});
