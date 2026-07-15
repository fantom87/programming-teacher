import type { CheckResult, CheckSpec, Lesson, RunResult } from "@teacher/shared";
import {
  evaluateDomCheck,
  evaluateStdoutCheck,
  evaluateTestsCheck,
  JS_TEST_HARNESS,
  PY_TEST_HARNESS,
} from "@teacher/shared";
import { runLocal } from "../runner/localRunner.js";
import { evaluateDomAssertions } from "../runner/domCheck.js";

// Canonical check pass. The browser gives instant feedback with the same
// shared engine; this server-side pass is the one that counts.

export type JudgeFn = (lesson: Lesson, rubric: string, files: Record<string, string>, run: RunResult | null) => Promise<CheckResult>;

// M3 replaces this with the real tutor-powered judge.
let judge: JudgeFn = async (_lesson, _rubric, _files, _run) => ({
  checkId: "",
  passed: false,
  message: "AI-graded checks arrive with the tutor (milestone M3).",
});

export function setJudge(fn: JudgeFn): void {
  judge = fn;
}

export interface CheckPassResult {
  run: RunResult | null;
  checks: CheckResult[];
  /** all non-ai-judge checks passed */
  passedRequired: boolean;
}

function testProgram(lesson: Lesson, files: Record<string, string>, spec: Extract<CheckSpec, { type: "tests" }>, testSource: string): { files: Record<string, string>; entry: string } {
  const userCode = files[spec.entry] ?? "";
  if (lesson.language === "python") {
    const combined = `${userCode}\n${PY_TEST_HARNESS}\n${testSource}\n`;
    return { files: { ...files, "__tests__.py": combined }, entry: "__tests__.py" };
  }
  // javascript
  const combined = `${JS_TEST_HARNESS}\n${userCode}\n${testSource}\n`;
  return { files: { ...files, "__tests__.js": combined }, entry: "__tests__.js" };
}

export async function runCheckPass(
  dataDir: string,
  lesson: Lesson,
  files: Record<string, string>,
  testSources: Record<string, string>, // testFile path -> contents (loaded from lesson dir)
): Promise<CheckPassResult> {
  const checks: CheckResult[] = [];
  let baseRun: RunResult | null = null;

  for (const spec of lesson.checks) {
    switch (spec.type) {
      case "stdout": {
        const run = await runLocal(dataDir, {
          language: lesson.language,
          entry: spec.entry,
          files,
          stdin: spec.stdin,
          timeoutMs: lesson.timeoutMs,
        });
        baseRun ??= run;
        checks.push(evaluateStdoutCheck(spec, run));
        break;
      }
      case "tests": {
        const source = testSources[spec.testFile];
        if (source === undefined) {
          checks.push({ checkId: spec.id, passed: false, message: `test file ${spec.testFile} missing` });
          break;
        }
        const prog = testProgram(lesson, files, spec, source);
        const run = await runLocal(dataDir, {
          language: lesson.language,
          entry: prog.entry,
          files: prog.files,
          timeoutMs: lesson.timeoutMs,
        });
        checks.push(evaluateTestsCheck(spec, run));
        break;
      }
      case "dom": {
        const { outcomes, domSnapshot } = evaluateDomAssertions(files, spec.assertions);
        baseRun ??= {
          ok: true,
          exitCode: 0,
          stdout: "",
          stderr: "",
          durationMs: 0,
          timedOut: false,
          domSnapshot,
        };
        checks.push(evaluateDomCheck(spec, outcomes));
        break;
      }
      case "ai-judge": {
        const result = await judge(lesson, spec.rubric, files, baseRun);
        checks.push({ ...result, checkId: spec.id });
        break;
      }
    }
  }

  const passedRequired = checks
    .filter((c) => lesson.checks.find((s) => s.id === c.checkId)?.type !== "ai-judge")
    .every((c) => c.passed);

  return { run: baseRun, checks, passedRequired };
}
