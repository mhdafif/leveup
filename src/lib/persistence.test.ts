import { beforeEach, describe, expect, it } from "vitest";
import {
  createLocalStorageAdapter,
  defaultData,
  migrate,
  DATA_VERSION,
  STORAGE_KEY,
} from "./persistence";

function memoryStorage() {
  const map = new Map<string, string>();
  return {
    store: map,
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
  };
}

describe("defaultData", () => {
  it("starts empty at the current version", () => {
    const d = defaultData();
    expect(d.version).toBe(DATA_VERSION);
    expect(d.coins).toBe(0);
    expect(d.progress).toEqual({});
    expect(d.dailyGoal.target).toBeGreaterThan(0);
  });
});

describe("migrate", () => {
  it("returns defaults for null/garbage", () => {
    expect(migrate(null)).toEqual(defaultData());
    expect(migrate("nope")).toEqual(defaultData());
  });
  it("merges a partial blob and stamps the version", () => {
    const merged = migrate({ coins: 42, progress: { "a/b": [true] } });
    expect(merged.coins).toBe(42);
    expect(merged.progress).toEqual({ "a/b": [true] });
    expect(merged.version).toBe(DATA_VERSION);
    expect(merged.streak).toEqual(defaultData().streak);
  });

  it("upgrades a v1 blob: seeds rewards, empty userTopics", () => {
    const v1 = { version: 1, coins: 10 }; // no rewards/userTopics
    const merged = migrate(v1);
    expect(merged.version).toBe(DATA_VERSION);
    expect(merged.rewards).toEqual(defaultData().rewards);
    expect(merged.rewards.length).toBeGreaterThan(0);
    expect(merged.userTopics).toEqual([]);
    expect(merged.review).toEqual({});
    expect(merged.activity).toEqual([]);
  });

  it("respects an explicitly empty rewards list (no reseed)", () => {
    const merged = migrate({ version: 2, rewards: [] });
    expect(merged.rewards).toEqual([]);
  });

  it("preserves user-uploaded topics", () => {
    const topic = {
      id: "u-arrays-x1",
      title: "Arrays",
      createdAt: "2026-06-27",
      lessons: [{ slug: "intro", title: "Intro", checklist: ["a"], body: "hi" }],
    };
    expect(migrate({ userTopics: [topic] }).userTopics).toEqual([topic]);
  });
});

describe("localStorageAdapter", () => {
  let storage: ReturnType<typeof memoryStorage>;
  beforeEach(() => {
    storage = memoryStorage();
  });

  it("loads defaults when storage is empty", () => {
    const adapter = createLocalStorageAdapter(storage);
    expect(adapter.load()).toEqual(defaultData());
  });

  it("round-trips save and load", () => {
    const adapter = createLocalStorageAdapter(storage);
    const data = defaultData();
    data.coins = 99;
    data.progress["ds/arrays"] = [true, false];
    adapter.save(data);
    expect(storage.store.has(STORAGE_KEY)).toBe(true);
    expect(adapter.load()).toEqual(data);
  });

  it("recovers from corrupt stored JSON", () => {
    storage.setItem(STORAGE_KEY, "{ not json");
    const adapter = createLocalStorageAdapter(storage);
    expect(adapter.load()).toEqual(defaultData());
  });
});
