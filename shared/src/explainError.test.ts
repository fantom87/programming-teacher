import { describe, expect, it } from "vitest";
import { describeOutputDifference, explainError } from "./explainError.js";

describe("explainError", () => {
  it("names the missing identifier in a Python NameError", () => {
    const e = explainError("NameError: name 'prnt' is not defined", "python");
    expect(e?.subject).toBe("prnt");
    expect(e?.title).toContain("prnt");
  });

  it("distinguishes JS 'not a function' from reading a property of undefined", () => {
    const call = explainError("TypeError: user.getName is not a function", "javascript");
    expect(call?.title).toContain("isn't a function");
    const prop = explainError("TypeError: Cannot read properties of undefined (reading 'name')", "javascript");
    expect(prop?.title).toContain("undefined");
    expect(prop?.subject).toBe("name");
  });

  it("explains a Rust move error by name", () => {
    const e = explainError("error[E0382]: borrow of moved value: `words`", "rust");
    expect(e?.subject).toBe("words");
    expect(e?.lookFor).toContain("&words");
  });

  it("reads SQLite's missing-table message", () => {
    const e = explainError("Error: no such table: bookz", "sql");
    expect(e?.subject).toBe("bookz");
  });

  it("catches timeouts in any language", () => {
    expect(explainError("Timed out after 5s (infinite loop?)", "javascript")?.title).toContain("never finished");
    expect(explainError("Timed out after 10s (infinite loop?)", "python")?.title).toContain("never finished");
  });

  it("stays silent rather than guessing", () => {
    expect(explainError("Segmentation fault (core dumped)", "csharp")).toBeNull();
    expect(explainError("", "python")).toBeNull();
  });

  it("doesn't apply another language's rules", () => {
    // A Python-shaped message under the JS ruleset must not match Python rules.
    expect(explainError("NameError: name 'x' is not defined", "javascript")).toBeNull();
  });
});

describe("describeOutputDifference", () => {
  it("is silent when the outputs match (CRLF-insensitive)", () => {
    expect(describeOutputDifference("hi\n", "hi\n")).toBeNull();
    expect(describeOutputDifference("hi\n", "hi\r\n")).toBeNull();
  });

  it("points at the first differing character", () => {
    const d = describeOutputDifference("Hello, world!\n", "Hello, World!\n");
    expect(d).toContain("Line 1");
    expect(d).toContain("character 8");
  });

  it("makes a trailing space visible", () => {
    const d = describeOutputDifference("hi\n", "hi \n");
    expect(d).toContain("·");
  });

  it("reports missing and extra lines", () => {
    expect(describeOutputDifference("a\nb\n", "a\n")).toContain("missing");
    expect(describeOutputDifference("a\n", "a\nb\n")).toContain("extra");
  });
});
