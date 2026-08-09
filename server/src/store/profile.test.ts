import { afterEach, describe, expect, it } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { appendProfileNote, getProfile, setProfile } from "./profile.js";

const tmpData = path.join(os.tmpdir(), "teacher-profile-tests");

afterEach(async () => {
  await fs.rm(tmpData, { recursive: true, force: true }).catch(() => {});
});

describe("appendProfileNote", () => {
  it("appends a dated note", async () => {
    const profile = await appendProfileNote(tmpData, "prefers short examples");
    expect(profile).toMatch(/^- \d{4}-\d{2}: prefers short examples\n$/);
  });

  it("replaces only the FIRST line matching the substring", async () => {
    await appendProfileNote(tmpData, "struggles with loops in python");
    await appendProfileNote(tmpData, "mastered loops in javascript");
    const profile = await appendProfileNote(tmpData, "now solid on python loops", "loops");
    expect(profile).not.toContain("struggles with loops in python");
    expect(profile).toContain("mastered loops in javascript");
    expect(profile).toContain("now solid on python loops");
  });

  it("prunes oldest dated notes past the cap but keeps hand-written lines and the newest 5 notes", async () => {
    const header = "# About me\nI'm Brad, learning after work.\n";
    await setProfile(tmpData, header);
    for (let i = 0; i < 30; i++) {
      await appendProfileNote(tmpData, `observation number ${i} ${"x".repeat(80)}`);
    }
    const profile = await getProfile(tmpData);
    // The learner's own header survives pruning.
    expect(profile).toContain("# About me");
    expect(profile).toContain("I'm Brad, learning after work.");
    // The newest notes survive; the oldest were pruned.
    expect(profile).toContain("observation number 29");
    expect(profile).toContain("observation number 25");
    expect(profile).not.toContain("observation number 0 ");
  });

  it("never prunes below the 5 most recent notes even when over the cap", async () => {
    // Five max-length notes exceed 2048 chars on their own.
    for (let i = 0; i < 5; i++) {
      await appendProfileNote(tmpData, `note ${i} ${"y".repeat(190)}`);
    }
    const profile = await appendProfileNote(tmpData, `note 5 ${"y".repeat(190)}`);
    const noteLines = profile.split("\n").filter((l) => /^- \d{4}-\d{2}: /.test(l));
    expect(noteLines.length).toBeGreaterThanOrEqual(5);
    expect(profile).toContain("note 5");
  });

  it("caps direct profile writes at the same single cap", async () => {
    await setProfile(tmpData, "z".repeat(5000));
    const profile = await getProfile(tmpData);
    expect(profile.length).toBe(2048);
  });
});
