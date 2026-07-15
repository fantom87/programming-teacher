import type { CheckResult, CheckSpec, DomAssertion, RunResult } from "./types.js";

// Runner-agnostic goal checking. Both the browser (instant feedback) and the
// server (canonical verdict) feed RunResults through these functions, so the
// pass/fail logic exists exactly once.
//
// - stdout / tests checks are evaluated here from a RunResult.
// - dom checks need a live DOM; the runner evaluates assertions (browser
//   bridge or server jsdom) into DomAssertionOutcome[] and passes them in.
// - ai-judge checks are server-only (the tutor grades them) and are skipped
//   here with passed=false, message explaining they need the server.

export interface DomAssertionOutcome {
  assertion: DomAssertion;
  passed: boolean;
  detail?: string;
}

export function describeAssertion(a: DomAssertion): string {
  if ("exists" in a) return `${a.selector} exists`;
  if ("textContains" in a) return `${a.selector} contains "${a.textContains}"`;
  if ("count" in a) return `exactly ${a.count} × ${a.selector}`;
  if ("attr" in a) return `${a.selector}[${a.attr}] = "${a.equals}"`;
  return `${a.selector} has ${a.cssRule.property}: ${a.cssRule.equals}`;
}

function normalizeNewlines(s: string): string {
  return s.replace(/\r\n/g, "\n");
}

export function evaluateStdoutCheck(
  spec: Extract<CheckSpec, { type: "stdout" }>,
  run: RunResult,
): CheckResult {
  const actual = normalizeNewlines(run.stdout);
  const expected = normalizeNewlines(spec.value);
  if (run.timedOut) {
    return { checkId: spec.id, passed: false, message: "The program never finished (timed out)." };
  }
  if (!run.ok) {
    return { checkId: spec.id, passed: false, message: "The program crashed before it could produce the expected output." };
  }
  let passed: boolean;
  switch (spec.match) {
    case "exact":
      passed = actual === expected;
      break;
    case "contains":
      passed = actual.includes(expected);
      break;
    case "regex":
      passed = new RegExp(expected).test(actual);
      break;
  }
  return {
    checkId: spec.id,
    passed,
    message: passed ? "Output looks right." : "The output doesn't match what's expected yet.",
    expected: spec.match === "exact" ? expected : undefined,
    actual: passed ? undefined : actual.slice(0, 500),
  };
}

export function evaluateTestsCheck(
  spec: Extract<CheckSpec, { type: "tests" }>,
  run: RunResult,
): CheckResult {
  if (run.timedOut) {
    return { checkId: spec.id, passed: false, message: "Tests never finished (timed out)." };
  }
  const events = run.events ?? [];
  if (events.length === 0) {
    return {
      checkId: spec.id,
      passed: false,
      message: run.ok ? "No test results were produced." : "The code crashed before the tests could run.",
      actual: run.stderr.slice(0, 500) || undefined,
    };
  }
  const failed = events.filter((e) => !e.passed);
  return {
    checkId: spec.id,
    passed: failed.length === 0,
    message:
      failed.length === 0
        ? `All ${events.length} test(s) passed.`
        : `${failed.length}/${events.length} test(s) failed: ${failed.map((f) => f.name + (f.message ? ` (${f.message})` : "")).join("; ")}`,
  };
}

export function evaluateDomCheck(
  spec: Extract<CheckSpec, { type: "dom" }>,
  outcomes: DomAssertionOutcome[],
): CheckResult {
  const failed = outcomes.filter((o) => !o.passed);
  return {
    checkId: spec.id,
    passed: failed.length === 0 && outcomes.length === spec.assertions.length,
    message:
      failed.length === 0
        ? "The page structure looks right."
        : `Not there yet: ${failed.map((f) => f.detail ?? describeAssertion(f.assertion)).join("; ")}`,
  };
}

// ---------- Test harnesses (injected around user code by the runners) ----------

/** JS: prepended before user entry + test file. Emits __TEST__ lines parsed from stdout. */
export const JS_TEST_HARNESS = `
function expect(actual) {
  return {
    toBe(expected) { __assert(Object.is(actual, expected), "expected " + JSON.stringify(expected) + ", got " + JSON.stringify(actual)); },
    toEqual(expected) { __assert(JSON.stringify(actual) === JSON.stringify(expected), "expected " + JSON.stringify(expected) + ", got " + JSON.stringify(actual)); },
    toContain(item) { __assert(actual.includes(item), JSON.stringify(actual) + " does not contain " + JSON.stringify(item)); },
    toBeTruthy() { __assert(!!actual, JSON.stringify(actual) + " is not truthy"); },
  };
}
let __currentTest = null;
function __assert(ok, msg) { if (!ok) throw new Error(msg); }
function test(name, fn) {
  __currentTest = name;
  try { fn(); console.log("__TEST__" + JSON.stringify({ name, passed: true })); }
  catch (e) { console.log("__TEST__" + JSON.stringify({ name, passed: false, message: e.message })); }
}
`;

/** Python: appended after user code, before the test file body. */
export const PY_TEST_HARNESS = `
import json as __json

def test(name, fn):
    try:
        fn()
        print("__TEST__" + __json.dumps({"name": name, "passed": True}))
    except AssertionError as e:
        print("__TEST__" + __json.dumps({"name": name, "passed": False, "message": str(e) or "assertion failed"}))
    except Exception as e:
        print("__TEST__" + __json.dumps({"name": name, "passed": False, "message": type(e).__name__ + ": " + str(e)}))
`;

/** Parse __TEST__ events out of stdout; returns [cleanStdout, events]. */
export function extractTestEvents(stdout: string): [string, { name: string; passed: boolean; message?: string }[]] {
  const events: { name: string; passed: boolean; message?: string }[] = [];
  const clean: string[] = [];
  for (const line of stdout.split("\n")) {
    if (line.startsWith("__TEST__")) {
      try {
        events.push(JSON.parse(line.slice("__TEST__".length)));
        continue;
      } catch {
        // fall through: treat as normal output
      }
    }
    clean.push(line);
  }
  return [clean.join("\n"), events];
}
