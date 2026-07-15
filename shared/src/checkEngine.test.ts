import { describe, expect, it } from "vitest";
import { evaluateStdoutCheck, evaluateTestsCheck, extractTestEvents } from "./checkEngine.js";
import type { RunResult } from "./types.js";

function run(overrides: Partial<RunResult>): RunResult {
  return { ok: true, exitCode: 0, stdout: "", stderr: "", durationMs: 1, timedOut: false, ...overrides };
}

describe("evaluateStdoutCheck", () => {
  const spec = { id: "c", type: "stdout", entry: "main.py", match: "exact", value: "hi\n" } as const;

  it("passes on exact match", () => {
    expect(evaluateStdoutCheck(spec, run({ stdout: "hi\n" })).passed).toBe(true);
  });

  it("normalizes CRLF from Windows runtimes", () => {
    expect(evaluateStdoutCheck(spec, run({ stdout: "hi\r\n" })).passed).toBe(true);
  });

  it("fails on wrong output and reports actual", () => {
    const r = evaluateStdoutCheck(spec, run({ stdout: "bye\n" }));
    expect(r.passed).toBe(false);
    expect(r.actual).toBe("bye\n");
  });

  it("fails on crash", () => {
    expect(evaluateStdoutCheck(spec, run({ ok: false, exitCode: 1 })).passed).toBe(false);
  });

  it("fails on timeout", () => {
    expect(evaluateStdoutCheck(spec, run({ ok: false, timedOut: true })).passed).toBe(false);
  });

  it("supports contains and regex", () => {
    const contains = { ...spec, match: "contains", value: "world" } as const;
    expect(evaluateStdoutCheck(contains, run({ stdout: "hello world!\n" })).passed).toBe(true);
    const regex = { ...spec, match: "regex", value: "^\\d{4}$" } as const;
    expect(evaluateStdoutCheck(regex, run({ stdout: "2026" })).passed).toBe(true);
    expect(evaluateStdoutCheck(regex, run({ stdout: "20x6" })).passed).toBe(false);
  });
});

describe("evaluateTestsCheck", () => {
  const spec = { id: "t", type: "tests", entry: "main.py", testFile: "tests/t.py" } as const;

  it("passes when all events pass", () => {
    const r = evaluateTestsCheck(spec, run({ events: [{ name: "a", passed: true }] }));
    expect(r.passed).toBe(true);
  });

  it("fails with named failures", () => {
    const r = evaluateTestsCheck(
      spec,
      run({ events: [{ name: "a", passed: true }, { name: "b", passed: false, message: "boom" }] }),
    );
    expect(r.passed).toBe(false);
    expect(r.message).toContain("b (boom)");
  });

  it("fails when no events were produced (crash before tests)", () => {
    expect(evaluateTestsCheck(spec, run({ ok: false, stderr: "SyntaxError" })).passed).toBe(false);
  });
});

describe("extractTestEvents", () => {
  it("separates events from normal output", () => {
    const [clean, events] = extractTestEvents('hello\n__TEST__{"name":"a","passed":true}\nworld');
    expect(clean).toBe("hello\nworld");
    expect(events).toEqual([{ name: "a", passed: true }]);
  });

  it("keeps malformed marker lines as output", () => {
    const [clean, events] = extractTestEvents("__TEST__not-json");
    expect(clean).toBe("__TEST__not-json");
    expect(events).toEqual([]);
  });
});
