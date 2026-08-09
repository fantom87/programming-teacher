import { describe, expect, it } from "vitest";
import { addCustomLessonToTrackJson, CUSTOM_UNIT_ID } from "./author.js";

const TRACK = `{
  "id": "python",
  "title": "Python",
  "language": "python",
  "philosophy": "The entry track.",
  "units": [
    {
      "id": "01-first-steps",
      "title": "First Steps",
      "tier": "foundations",
      "summary": "What a program is.",
      "lessons": ["01-hello-world"],
      "topics": ["output", "variables", "loops"]
    }
  ]
}
`;

describe("addCustomLessonToTrackJson", () => {
  it("creates the 90-custom unit and preserves the rest of the file byte-for-byte", () => {
    const out = addCustomLessonToTrackJson(TRACK, "my-lesson");
    expect(out).not.toBeNull();
    const json = JSON.parse(out!) as { units: { id: string; lessons?: string[]; topics?: string[] }[] };
    const unit = json.units.find((u) => u.id === CUSTOM_UNIT_ID);
    expect(unit?.lessons).toEqual(["my-lesson"]);
    expect(unit).toMatchObject({ title: "Your custom lessons", tier: "custom" });
    // Surgical: the original hand formatting (inline arrays) is untouched.
    expect(out).toContain(`"topics": ["output", "variables", "loops"]`);
    expect(out).toContain(`"lessons": ["01-hello-world"]`);
    expect(out!.startsWith(TRACK.slice(0, TRACK.indexOf("\n  ]")))).toBe(true);
  });

  it("appends to an existing custom unit", () => {
    const first = addCustomLessonToTrackJson(TRACK, "lesson-a")!;
    const second = addCustomLessonToTrackJson(first, "lesson-b");
    expect(second).not.toBeNull();
    const json = JSON.parse(second!) as { units: { id: string; lessons?: string[] }[] };
    expect(json.units.find((u) => u.id === CUSTOM_UNIT_ID)?.lessons).toEqual(["lesson-a", "lesson-b"]);
    // Other units still untouched.
    expect(second).toContain(`"lessons": ["01-hello-world"]`);
  });

  it("is idempotent for an already-listed lesson", () => {
    const first = addCustomLessonToTrackJson(TRACK, "lesson-a")!;
    expect(addCustomLessonToTrackJson(first, "lesson-a")).toBe(first);
  });

  it("returns null on a file it can't edit surgically", () => {
    expect(addCustomLessonToTrackJson(`{"units": []`, "x")).toBeNull();
  });
});
