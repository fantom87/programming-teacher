// Content lint: validates the whole curriculum, then proves every lesson's
// own solution passes its non-AI checks. Run with: npm run lint-content
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadCurriculum } from "../server/src/curriculum/loader.js";
import { runLocal } from "../server/src/runner/localRunner.js";
import { evaluateDomAssertions } from "../server/src/runner/domCheck.js";
import {
  evaluateDomCheck,
  evaluateStdoutCheck,
  evaluateTestsCheck,
  JS_TEST_HARNESS,
  PY_TEST_HARNESS,
  type CheckResult,
  type Lesson,
} from "../shared/src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT = path.join(ROOT, "content");
const DATA = path.join(ROOT, "data");

async function checkLesson(key: string, lesson: Lesson, solution: Record<string, string>): Promise<CheckResult[]> {
  // Solutions may cover only some files (e.g. just styles.css) — starters fill the rest.
  const files = { ...lesson.starterFiles, ...solution };
  const results: CheckResult[] = [];

  for (const spec of lesson.checks) {
    if (spec.type === "ai-judge") continue; // costs tutor tokens; judged live instead
    if (spec.type === "dom") {
      const { outcomes } = evaluateDomAssertions(files, spec.assertions);
      results.push(evaluateDomCheck(spec, outcomes));
    } else if (spec.type === "stdout") {
      const run = await runLocal(DATA, {
        language: lesson.language,
        entry: spec.entry,
        files,
        stdin: spec.stdin,
        timeoutMs: lesson.timeoutMs,
      });
      results.push(evaluateStdoutCheck(spec, run));
    } else if (spec.type === "tests") {
      const source = lesson.testFiles[spec.testFile];
      const userCode = files[spec.entry] ?? "";
      const combined =
        lesson.language === "python"
          ? `${userCode}\n${PY_TEST_HARNESS}\n${source}\n`
          : `${JS_TEST_HARNESS}\n${userCode}\n${source}\n`;
      const entry = lesson.language === "python" ? "__tests__.py" : "__tests__.js";
      const run = await runLocal(DATA, {
        language: lesson.language,
        entry,
        files: { ...files, [entry]: combined },
        timeoutMs: lesson.timeoutMs,
      });
      results.push(evaluateTestsCheck(spec, run));
    }
  }
  return results;
}

const cur = await loadCurriculum(CONTENT);
let failures = 0;

if (cur.errors.length > 0) {
  console.error(`✗ ${cur.errors.length} validation error(s):`);
  for (const e of cur.errors) console.error(`  ${e.file}: ${e.message}`);
  failures += cur.errors.length;
}

const runtimeless = new Set<string>();
for (const [key, lesson] of cur.lessons) {
  const solution = cur.solutions.get(key);
  if (!solution) {
    console.error(`✗ ${key}: no solution/ folder`);
    failures++;
    continue;
  }
  if (lesson.language === "csharp") {
    runtimeless.add(key); // dotnet not installed on this machine — structural checks only
    continue;
  }
  const results = await checkLesson(key, lesson, solution);
  const bad = results.filter((r) => !r.passed);
  if (bad.length > 0) {
    failures += bad.length;
    console.error(`✗ ${key}:`);
    for (const b of bad) console.error(`    [${b.checkId}] ${b.message}${b.actual ? ` — actual: ${JSON.stringify(b.actual).slice(0, 120)}` : ""}`);
  } else {
    console.log(`✓ ${key} (${results.length} checks)`);
  }
}

if (runtimeless.size > 0) {
  console.log(`… skipped runtime checks for ${runtimeless.size} C# lesson(s) (dotnet not installed)`);
}

console.log(failures === 0 ? `\nAll content checks passed (${cur.lessons.size} lessons).` : `\n${failures} failure(s).`);
process.exit(failures === 0 ? 0 : 1);
