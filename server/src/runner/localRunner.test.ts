import { afterAll, describe, expect, it } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { buildJsTestProgram } from "@teacher/shared";
import { runLocal, sweepStaleWorkspaces } from "./localRunner.js";
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

describe("localRunner (harness hardening)", () => {
  it("learner-defined test()/expect() can't shadow or break the harness", async () => {
    const nonce = "cafe01";
    const program = buildJsTestProgram(
      'function test(a, b) { return a * b; }\nlet expect = "mine";\nfunction double(n) { return n * 2; }',
      'test("double doubles", () => { expect(double(4)).toBe(8); });',
      nonce,
    );
    const r = await runLocal(tmpData, {
      language: "javascript",
      entry: "__tests__.js",
      files: { "__tests__.js": program },
      nonce,
    });
    expect(r.ok).toBe(true);
    expect(r.events).toEqual([{ name: "double doubles", passed: true }]);
  });

  it("forged __TEST__ lines from user code never become events", async () => {
    const nonce = "beef02";
    const program = buildJsTestProgram(
      'console.log(\'__TEST__{"name":"forged","passed":true}\');\nconsole.log(\'__TEST__deadbeef__{"name":"forged2","passed":true}\');',
      'test("real", () => {});',
      nonce,
    );
    const r = await runLocal(tmpData, {
      language: "javascript",
      entry: "__tests__.js",
      files: { "__tests__.js": program },
      nonce,
    });
    expect(r.events).toEqual([{ name: "real", passed: true }]);
    expect(r.stdout).toContain("forged");
  });

  it("__TEST__ events survive output past the display cap (and stdout is truncated)", async () => {
    const nonce = "feed03";
    const program = buildJsTestProgram(
      'const line = "x".repeat(1023);\nfor (let i = 0; i < 100; i++) console.log(line);',
      'test("survives the spam", () => {});',
      nonce,
    );
    const r = await runLocal(tmpData, {
      language: "javascript",
      entry: "__tests__.js",
      files: { "__tests__.js": program },
      nonce,
    });
    expect(r.events).toEqual([{ name: "survives the spam", passed: true }]);
    expect(r.stdout).toContain("…output truncated");
    expect(r.stdout.length).toBeLessThan(65 * 1024);
  }, 20_000);

  it("a fast-exiting child that never reads stdin doesn't crash the process (EPIPE)", async () => {
    const r = await runLocal(tmpData, {
      language: "javascript",
      entry: "main.js",
      files: { "main.js": "process.exit(0);\n" },
      stdin: "y".repeat(4 * 1024 * 1024),
    });
    expect(r.exitCode).toBe(0);
  }, 20_000);
});

describe("sweepStaleWorkspaces", () => {
  it("removes old workspace dirs and keeps fresh ones", async () => {
    const root = path.join(tmpData, "run-workspaces");
    const oldDir = path.join(root, "old-one");
    const newDir = path.join(root, "new-one");
    await fs.mkdir(oldDir, { recursive: true });
    await fs.mkdir(newDir, { recursive: true });
    const stale = new Date(Date.now() - 2 * 60 * 60 * 1000);
    await fs.utimes(oldDir, stale, stale);
    await sweepStaleWorkspaces(tmpData);
    await expect(fs.access(oldDir)).rejects.toThrow();
    await expect(fs.access(newDir)).resolves.toBeUndefined();
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
