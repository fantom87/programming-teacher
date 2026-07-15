import { afterAll, describe, expect, it } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { runLocal } from "./localRunner.js";
import { loadCurriculum } from "../curriculum/loader.js";

const tmpData = path.join(os.tmpdir(), "teacher-runner-tests");

afterAll(async () => {
  await fs.rm(tmpData, { recursive: true, force: true }).catch(() => {});
});

describe("localRunner (python)", () => {
  it("captures stdout and exit code", async () => {
    const r = await runLocal(tmpData, {
      language: "python",
      entry: "main.py",
      files: { "main.py": 'print("hello")\n' },
    });
    expect(r.ok).toBe(true);
    expect(r.stdout).toContain("hello");
    expect(r.exitCode).toBe(0);
  });

  it("captures stderr on crash", async () => {
    const r = await runLocal(tmpData, {
      language: "python",
      entry: "main.py",
      files: { "main.py": "boom\n" },
    });
    expect(r.ok).toBe(false);
    expect(r.stderr).toContain("NameError");
  });

  it("handles UTF-8 output on Windows", async () => {
    const r = await runLocal(tmpData, {
      language: "python",
      entry: "main.py",
      files: { "main.py": 'print("héllo → 世界")\n' },
    });
    expect(r.stdout).toContain("héllo → 世界");
  });

  it("kills infinite loops (and their process) at the timeout", async () => {
    const r = await runLocal(tmpData, {
      language: "python",
      entry: "main.py",
      files: { "main.py": "while True:\n    pass\n" },
      timeoutMs: 3000,
    });
    expect(r.timedOut).toBe(true);
    expect(r.ok).toBe(false);
  }, 15_000);

  it("feeds stdin", async () => {
    const r = await runLocal(tmpData, {
      language: "python",
      entry: "main.py",
      files: { "main.py": "name = input()\nprint('hi ' + name)\n" },
      stdin: "bradley\n",
    });
    expect(r.stdout).toContain("hi bradley");
  });

  it("rejects path escapes in file names", async () => {
    await expect(
      runLocal(tmpData, {
        language: "python",
        entry: "main.py",
        files: { "..\\..\\evil.py": "x" },
      }),
    ).rejects.toThrow(/illegal file path/);
  });
});

describe("curriculum loader", () => {
  it("loads the real content tree without errors", async () => {
    const contentDir = path.resolve(__dirname, "..", "..", "..", "content");
    const cur = await loadCurriculum(contentDir);
    expect(cur.errors).toEqual([]);
    expect(cur.tracks.length).toBe(4);
    expect(cur.lessons.size).toBeGreaterThanOrEqual(8);
    // Solutions are loaded for the tutor but never included in Lesson objects.
    for (const lesson of cur.lessons.values()) {
      expect(Object.keys(lesson.starterFiles).length).toBeGreaterThan(0);
      expect((lesson as unknown as Record<string, unknown>).solutionFiles).toBeUndefined();
    }
  });

  it("reports missing lesson folders with actionable errors", async () => {
    const dir = path.join(tmpData, "content-fixture");
    await fs.mkdir(path.join(dir, "tracks", "python"), { recursive: true });
    await fs.writeFile(path.join(dir, "tracks.json"), JSON.stringify({ order: ["python"] }));
    await fs.writeFile(
      path.join(dir, "tracks", "python", "track.json"),
      JSON.stringify({
        id: "python",
        title: "Python",
        language: "python",
        philosophy: "x",
        units: [{ id: "01-u", title: "U", tier: "foundations", summary: "s", lessons: ["01-missing"] }],
      }),
    );
    const cur = await loadCurriculum(dir);
    expect(cur.errors.length).toBe(1);
    expect(cur.errors[0].message).toContain("01-missing");
  });
});
