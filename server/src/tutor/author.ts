import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import {
  DEFAULT_SETTINGS,
  lessonFrontmatterSchema,
  type CheckResult,
  type Language,
  type Lesson,
  type LessonFrontmatter,
  type RunnerKind,
  type Settings,
  type Track,
} from "@teacher/shared";
import { getCurriculum, reloadCurriculum, type Curriculum } from "../curriculum/loader.js";
import { runCheckPass } from "../checks/run.js";
import { readJson, withFileLock, writeTextInLock } from "../store/jsonStore.js";
import { getProfile } from "../store/profile.js";
import { allDocSlugs } from "../routes/docs.js";
import { resolvePaths } from "../paths.js";
import { detectRuntimes } from "../preflight.js";
import { missingRuntimeHint } from "../runtimeHints.js";
import { tutorOfflineReason } from "./service.js";
import { oneShot } from "./judge.js";

// Custom lesson generator ("teach me to do X", plan §17.2): a one-shot SDK
// query authors a full lesson bundle, the zod gate validates it, and the
// reference solution is EXECUTED against the lesson's own checks — only a
// proven lesson ever reaches the preview modal. One retry with the failure
// details fed back; after that the job fails with the detail.

export type Difficulty = "beginner" | "intermediate" | "advanced";
export const DIFFICULTIES: readonly Difficulty[] = ["beginner", "intermediate", "advanced"];
export const CUSTOM_UNIT_ID = "90-custom";
export const CUSTOM_UNIT_TITLE = "Your custom lessons";

const RUNNER_FOR: Record<Language, RunnerKind> = {
  python: "browser",
  javascript: "browser",
  "html-css": "browser",
  sql: "browser",
  csharp: "local",
  powershell: "local",
  bash: "local",
  go: "local",
  rust: "local",
};

const DOCS_SECTION: Record<Language, string> = {
  python: "python",
  javascript: "javascript",
  "html-css": "html-css",
  csharp: "csharp",
  sql: "sql",
  powershell: "shell",
  bash: "shell",
  go: "go",
  rust: "rust",
};

export interface LessonBundle extends LessonFrontmatter {
  body: string;
  starterFiles: Record<string, string>;
  solutionFiles: Record<string, string>;
  testFiles: Record<string, string>;
}

export interface GeneratedLesson {
  bundle: LessonBundle;
  /** the synthetic Lesson exactly as the loader would shape it */
  lesson: Lesson;
  /** executed results proving the solution passes (ai-judge checks excluded) */
  checks: CheckResult[];
  warnings: string[];
}

export interface CustomLessonRequest {
  trackId: string;
  prompt: string;
  difficulty: Difficulty;
}

// ---------- prompt ----------

const AUTHOR_SYSTEM = `You are the lesson author inside "Rubberduck", a local programming-learning app. You write complete, self-contained practice lessons whose reference solutions provably pass their own goal checks. Respond with ONLY one JSON object — no markdown fences, no commentary before or after it.`;

const DIFFICULTY_GUIDE: Record<Difficulty, string> = {
  beginner:
    "assume the learner is early in this track — introduce the concept from scratch, small steps, generous starter scaffolding, warm encouraging body text",
  intermediate:
    "assume working fluency with the language basics — focus on applying the concept to a concrete task, moderate scaffolding",
  advanced:
    "assume strong fluency — a meaty, realistic exercise with minimal scaffolding and hints that nudge rather than reveal",
};

const LANGUAGE_NOTES: Record<Language, string> = {
  python: `Python lessons run in the browser via Pyodide AND on the server via real CPython. NEVER call input() (the browser runner has no stdin), never read or write files, never import third-party packages — standard library only. Output via print().`,
  javascript: `JavaScript lessons run in a browser worker AND on the server via Node. Plain modern JS only: no require/import of npm packages, no fs, no network. Output via console.log.`,
  "html-css": `HTML/CSS lessons have no program output — verification is DOM assertions (plus at most one ai-judge rubric). Reference stylesheets with <link rel="stylesheet" href="styles.css">. The checker (jsdom) does no layout, so never assert layout properties.`,
  csharp: `C# lessons run via 'dotnet run' (net8.0, ImplicitUsings enabled). One Program.cs with top-level statements is the norm. Console.WriteLine(bool) prints True/False capitalized; invariant culture is forced (9.75 prints "9.75"). Include "timeoutMs": 90000 — the first build is slow.`,
  sql: `SQL lessons run on SQLite (sql.js). The entry .sql file holds the learner's queries; OTHER .sql files in files[] are seed scripts that execute first (CREATE TABLE / INSERT). Each SELECT's result set prints as an ASCII table — prefer stdout checks with match "contains" on distinctive cell values rather than exact table art.`,
  powershell: `PowerShell lessons run in a non-interactive host — powershell.exe -NoProfile on Windows, pwsh -NoProfile on Linux/macOS — so stick to cross-edition cmdlets (no Windows-only modules, no COM, no registry). Keep output deterministic: Write-Output of plain strings/numbers, no timestamps, no filesystem or network side effects.`,
  bash: `Bash lessons run under bash — Git Bash on Windows, the system bash on Linux/macOS. Portable POSIX constructs only, deterministic echo/printf output, no filesystem or network side effects.`,
  go: `Go lessons run via 'go run' — package main with func main(). Standard library only. Include "timeoutMs": 30000 (the first compile is slower).`,
  rust: `Rust lessons compile with rustc (edition 2021) and then run — fn main(), standard library only. Compiler warnings surface to the learner, so keep both starter intent and solution warning-free.`,
};

function checkRules(language: Language, runner: RunnerKind): string {
  const rules: string[] = [
    `Every check needs a unique kebab-case "id". At least ONE check must be deterministic (not ai-judge).`,
  ];
  if (language !== "html-css") {
    rules.push(
      `"stdout" check: {"id","type":"stdout","entry":"<a files[] path>","match":"exact"|"contains"|"regex","value":"..."} — "exact" compares the WHOLE stdout byte-for-byte (after newline normalization), so include the trailing "\\n". Output must be fully deterministic: no timestamps, no randomness, no machine-specific paths. Use "contains" or "regex" when only part of the output matters.` +
        (runner === "browser"
          ? ` Never use "stdin" — browser-runner lessons can't feed standard input.`
          : ` Optional "stdin" feeds the program's standard input.`),
    );
  }
  if (language === "python" || language === "javascript") {
    rules.push(
      `"tests" check: {"id","type":"tests","entry":"<a files[] path>","testFile":"tests/<name>"} — testFile must be a key of testFiles. The test file runs in the SAME program as the learner's code (after it), so the learner's top-level names are visible. Write tests as test("description", fn):` +
        (language === "python"
          ? ` define a plain function using assert with a helpful message, e.g. def t_total(): assert total == 6, f"total is {total}, expected 6"  then  test("total adds up", t_total).`
          : ` use expect(actual).toBe(x) / .toEqual(x) / .toContain(x) / .toBeTruthy(), e.g. test("doubles a number", () => expect(double(2)).toBe(4)).`) +
        ` The entry file must run cleanly on its own (no prompts, no crashes).`,
    );
  } else {
    rules.push(`"tests" checks are NOT available for ${language} — do not use them.`);
  }
  if (language === "html-css") {
    rules.push(
      `"dom" check: {"id","type":"dom","assertions":[...]} with assertions shaped {"selector","exists":true} | {"selector","textContains":"..."} | {"selector","count":N} | {"selector","attr":"...","equals":"..."} | {"selector","cssRule":{"property":"...","equals":"..."}}. NEVER assert layout properties (display, position, float, top, left, right, bottom) — the checker does no layout; use ai-judge for visual/layout goals.`,
    );
  } else {
    rules.push(`"dom" checks are only for html-css lessons — do not use them.`);
  }
  rules.push(
    `"ai-judge" check: {"id","type":"ai-judge","rubric":"..."} (rubric at least 10 chars) — graded live by the AI tutor. Use AT MOST one, and only for qualities deterministic checks can't capture.`,
  );
  return rules.map((r) => `- ${r}`).join("\n");
}

interface Exemplar {
  key: string;
  lesson: Lesson;
  solution: Record<string, string>;
}

function checkMix(lesson: Lesson): string {
  return [...new Set(lesson.checks.map((c) => c.type))].sort().join("+");
}

/** Two real lessons as few-shot exemplars: ideally one browser + one local of
 *  the target language; else two same-language lessons with different check
 *  mixes; else any language — the bundle SHAPE matters more than the syntax. */
export function pickExemplars(cur: Curriculum, language: Language): Exemplar[] {
  const all: Exemplar[] = [...cur.lessons.entries()]
    .filter(([key]) => cur.solutions.has(key))
    .map(([key, lesson]) => ({ key, lesson, solution: cur.solutions.get(key)! }));
  const sameLang = all.filter((e) => e.lesson.language === language);
  const picks: Exemplar[] = [];
  const add = (e: Exemplar | undefined) => {
    if (e && picks.length < 2 && !picks.some((p) => p.key === e.key)) picks.push(e);
  };
  add(sameLang.find((e) => e.lesson.runner === "browser"));
  add(sameLang.find((e) => e.lesson.runner === "local"));
  add(sameLang.find((e) => picks.length > 0 && checkMix(e.lesson) !== checkMix(picks[0].lesson)));
  for (const e of sameLang) add(e);
  add(all.find((e) => e.lesson.runner === "browser" && e.lesson.checks.some((c) => c.type === "tests")));
  add(all.find((e) => e.lesson.runner === "local"));
  for (const e of all) add(e);
  return picks;
}

function exemplarJson(e: Exemplar): string {
  const l = e.lesson;
  return JSON.stringify(
    {
      id: l.id,
      title: l.title,
      estMinutes: l.estMinutes,
      files: l.files,
      goal: l.goal,
      docs: l.docs ?? [],
      checks: l.checks,
      hints: l.hints ?? [],
      ...(l.timeoutMs !== undefined ? { timeoutMs: l.timeoutMs } : {}),
      body: l.body,
      starterFiles: l.starterFiles,
      solutionFiles: e.solution,
      testFiles: l.testFiles,
    },
    null,
    2,
  );
}

function authorPrompt(opts: {
  track: Track;
  request: string;
  difficulty: Difficulty;
  profile: string;
  docSlugs: string[];
  exemplars: Exemplar[];
}): string {
  const { track, request, difficulty, profile, docSlugs, exemplars } = opts;
  const language = track.language;
  const runner = RUNNER_FOR[language];
  const section = DOCS_SECTION[language];
  const relevant = docSlugs.filter((s) => s.startsWith("concepts/") || s.startsWith(`${section}/`));
  const entryExample =
    language === "python" ? "main.py" : language === "javascript" ? "main.js" : language === "html-css" ? "index.html" : language === "csharp" ? "Program.cs" : language === "sql" ? "query.sql" : language === "powershell" ? "script.ps1" : language === "bash" ? "script.sh" : language === "go" ? "main.go" : "main.rs";

  return `Write ONE practice lesson for the "${track.title}" track of a programming-learning app.

## The learner's request
"${request}"

Difficulty: ${difficulty} — ${DIFFICULTY_GUIDE[difficulty]}.

## What the tutor knows about this learner
${profile.trim() || "(nothing yet)"}

## Output: ONE JSON object with EXACTLY these fields
{
  "id": "kebab-case-slug",                     // short + descriptive; a-z, 0-9, hyphens only
  "title": "Human Title",
  "estMinutes": 12,                            // realistic, 5-25
  "files": [{"path": "${entryExample}", "starter": "starter/${entryExample}"}],
  "goal": "One imperative sentence saying exactly what done means.",
  "docs": [],                                  // 0-3 slugs, ONLY from the list below
  "checks": [],                                // see check rules below
  "hints": ["...", "...", "..."],              // 2-4, escalating: concept -> location -> near-answer
  "body": "## Markdown teaching text...",      // teach the concept first; END with a "### Your goal" section restating the task concretely
  "starterFiles": {"${entryExample}": "..."},  // one entry per files[] path — scaffolding + TODO comments; must NOT already pass the checks
  "solutionFiles": {"${entryExample}": "..."}, // the complete reference solution — it is EXECUTED against your checks and must pass ALL of them
  "testFiles": {}                              // {"tests/<name>": "..."} for every "tests" check; {} otherwise
}
Include "timeoutMs" (a number) only if the language notes below say so. The lesson's language is "${language}" and its runner is "${runner}" — both fixed by the track; do NOT include them, the server sets them.

## ${language} notes
${LANGUAGE_NOTES[language]}

## Check rules
${checkRules(language, runner)}

## Available doc slugs (use ONLY these in "docs")
${relevant.join(", ") || "(none available — use an empty docs array)"}

${exemplars
  .map(
    (e, i) => `## Example ${i + 1} — a real lesson from this app (same JSON shape; match its tone and rigor)
${exemplarJson(e)}`,
  )
  .join("\n\n")}

Now write the learner's lesson. Body voice: warm, concrete, second person; teach before you ask. Remember: respond with ONLY the JSON object.`;
}

// ---------- parsing & validation ----------

function parseBundle(text: string): unknown | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1)) as unknown;
  } catch {
    return null;
  }
}

// Paths we will later write inside the lesson folder — conservative charset,
// no absolute paths, no "..", no hidden/dot segments.
const SAFE_PATH = /^[a-zA-Z0-9_][a-zA-Z0-9._-]*(\/[a-zA-Z0-9_][a-zA-Z0-9._-]*)*$/;

interface ValidationOutcome {
  bundle?: LessonBundle;
  lesson?: Lesson;
  checks?: CheckResult[];
  failures: string[];
  warnings: string[];
}

async function validateAndExecute(
  dataDir: string,
  track: Track,
  raw: unknown,
  docSlugs: string[],
  lenientDocs: boolean,
): Promise<ValidationOutcome> {
  const failures: string[] = [];
  const warnings: string[] = [];
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return { failures: ["the response was not a JSON object"], warnings };
  }
  const r = raw as Record<string, unknown>;

  const strMap = (v: unknown, name: string): Record<string, string> => {
    if (v === undefined) return {};
    if (typeof v !== "object" || v === null || Array.isArray(v)) {
      failures.push(`${name} must be an object of {"path": "contents"}`);
      return {};
    }
    const out: Record<string, string> = {};
    for (const [k, val] of Object.entries(v)) {
      if (typeof val !== "string") {
        failures.push(`${name}["${k}"] must be a string`);
        continue;
      }
      out[k] = val;
    }
    return out;
  };

  const starterFiles = strMap(r.starterFiles, "starterFiles");
  const solutionFiles = strMap(r.solutionFiles, "solutionFiles");
  const testFiles = strMap(r.testFiles, "testFiles");
  const body = typeof r.body === "string" ? r.body.trim() : "";
  if (!body) failures.push("body must be non-empty markdown");
  if (Object.keys(starterFiles).length === 0) failures.push("starterFiles is empty");
  if (Object.keys(solutionFiles).length === 0) {
    failures.push("solutionFiles is empty — the reference solution is required");
  }
  for (const p of new Set([...Object.keys(starterFiles), ...Object.keys(solutionFiles), ...Object.keys(testFiles)])) {
    if (!SAFE_PATH.test(p)) failures.push(`illegal file path "${p}"`);
  }

  // files[]: honor the model's ordering (the entry file comes first) but
  // derive the starter locations ourselves and keep only real starter paths.
  const ordered: string[] = [];
  if (Array.isArray(r.files)) {
    for (const f of r.files) {
      const p = (f as { path?: unknown } | null)?.path;
      if (typeof p === "string" && p in starterFiles && !ordered.includes(p)) ordered.push(p);
    }
  }
  for (const p of Object.keys(starterFiles)) if (!ordered.includes(p)) ordered.push(p);
  const files = ordered.map((p) => ({ path: p, starter: `starter/${p}` }));

  const parsed = lessonFrontmatterSchema.safeParse({
    id: r.id,
    title: r.title,
    language: track.language,
    runner: RUNNER_FOR[track.language],
    ...(r.estMinutes !== undefined ? { estMinutes: r.estMinutes } : {}),
    files,
    goal: r.goal,
    ...(Array.isArray(r.docs) && r.docs.length > 0 ? { docs: r.docs } : {}),
    checks: r.checks,
    ...(Array.isArray(r.hints) && r.hints.length > 0 ? { hints: r.hints } : {}),
    ...(typeof r.timeoutMs === "number" ? { timeoutMs: r.timeoutMs } : {}),
  });
  if (!parsed.success) {
    failures.push(...parsed.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`));
  }
  if (!parsed.success || failures.length > 0) return { failures, warnings };
  const meta = parsed.data;

  // docs slugs must exist. First attempt: a failure the retry can fix (with
  // the valid list in the prompt). Retry attempt: drop strays rather than
  // failing an otherwise-proven lesson over a cosmetic reference.
  if (meta.docs) {
    const known = new Set(docSlugs);
    const unknown = meta.docs.filter((d) => !known.has(d));
    if (unknown.length > 0) {
      if (lenientDocs) {
        meta.docs = meta.docs.filter((d) => known.has(d));
        if (meta.docs.length === 0) delete meta.docs;
        warnings.push(`dropped unknown doc slug(s): ${unknown.join(", ")}`);
      } else {
        failures.push(`docs slug(s) don't exist: ${unknown.join(", ")} — choose only from the provided list`);
      }
    }
  }

  const deterministic = meta.checks.filter((c) => c.type !== "ai-judge");
  if (deterministic.length === 0) failures.push("at least one non-ai-judge check is required");
  const seenIds = new Set<string>();
  for (const c of meta.checks) {
    if (seenIds.has(c.id)) failures.push(`duplicate check id "${c.id}"`);
    seenIds.add(c.id);
    if ((c.type === "stdout" || c.type === "tests") && !(c.entry in starterFiles)) {
      failures.push(`check "${c.id}": entry "${c.entry}" is not one of the lesson's files`);
    }
    if (c.type === "stdout" && RUNNER_FOR[track.language] === "browser" && c.stdin !== undefined) {
      failures.push(`check "${c.id}": stdin is not supported on browser-runner lessons`);
    }
    if (c.type === "tests") {
      if (track.language !== "python" && track.language !== "javascript") {
        failures.push(`check "${c.id}": "tests" checks are only supported for python and javascript`);
      } else if (!(c.testFile in testFiles)) {
        failures.push(`check "${c.id}": testFile "${c.testFile}" has no contents in testFiles`);
      }
    }
    if (c.type === "dom" && track.language !== "html-css") {
      failures.push(`check "${c.id}": "dom" checks are only for html-css lessons`);
    }
  }
  if (failures.length > 0) return { failures, warnings };

  const bundle: LessonBundle = { ...meta, body, starterFiles, solutionFiles, testFiles };
  const lesson: Lesson = {
    ...meta,
    trackId: track.id,
    unitId: CUSTOM_UNIT_ID,
    body,
    starterFiles,
    testFiles,
  };

  // EXECUTE the reference solution against the lesson's own checks. ai-judge
  // is the one exception — it's graded live and would spend tutor tokens here.
  const execLesson: Lesson = { ...lesson, checks: deterministic };
  let pass;
  try {
    pass = await runCheckPass(dataDir, execLesson, { ...starterFiles, ...solutionFiles }, testFiles);
  } catch (err) {
    return { failures: [`executing the solution failed: ${String(err)}`], warnings };
  }
  for (const c of pass.checks) {
    if (!c.passed) {
      const actual = c.actual !== undefined ? ` — actual output: ${JSON.stringify(c.actual.slice(0, 300))}` : "";
      const expected = c.expected !== undefined ? ` — expected: ${JSON.stringify(c.expected.slice(0, 300))}` : "";
      failures.push(`check "${c.checkId}" FAILED against your own solutionFiles: ${c.message}${actual}${expected}`);
    }
  }
  if (failures.length > 0) return { failures, warnings };
  return { bundle, lesson, checks: pass.checks, failures, warnings };
}

// ---------- runtime preflight ----------

async function missingRuntime(language: Language): Promise<string | null> {
  // Same platform-appropriate hints /api/run and the tutor's tools give.
  const hint = missingRuntimeHint(language, await detectRuntimes());
  return hint ? `Can't verify a ${language} lesson on this machine — ${hint}` : null;
}

// ---------- generation ----------

export async function generateCustomLesson(
  contentDir: string,
  dataDir: string,
  req: CustomLessonRequest,
): Promise<GeneratedLesson> {
  const offline = tutorOfflineReason();
  if (offline) throw new Error(`${offline} Custom lessons can't be written without it.`);
  const cur = await getCurriculum(contentDir);
  const track = cur.tracks.find((t) => t.id === req.trackId);
  if (!track) throw new Error(`no track "${req.trackId}"`);

  const runtimeProblem = await missingRuntime(track.language);
  if (runtimeProblem) throw new Error(runtimeProblem);

  const [profile, docSlugs, settings] = await Promise.all([
    getProfile(dataDir),
    allDocSlugs(resolvePaths().docsDir),
    readJson<Settings>(path.join(dataDir, "settings.json"), DEFAULT_SETTINGS),
  ]);
  const exemplars = pickExemplars(cur, track.language);
  if (exemplars.length === 0) throw new Error("no authored lessons exist yet to model the new lesson on");

  const basePrompt = authorPrompt({
    track,
    request: req.prompt,
    difficulty: req.difficulty,
    profile,
    docSlugs,
    exemplars,
  });

  // One query, with one fresh re-query if the reply isn't parseable JSON.
  const queryBundle = async (prompt: string): Promise<unknown> => {
    for (let i = 0; i < 2; i++) {
      const result = await oneShot(prompt, AUTHOR_SYSTEM, settings.tutorModel);
      if (!result.ok) {
        if (/usage|limit|credit/i.test(result.reason)) {
          throw new Error("Claude usage limit reached — lesson writing resumes when it resets.");
        }
        continue;
      }
      const parsed = parseBundle(result.text);
      if (parsed !== null) return parsed;
    }
    throw new Error("The tutor didn't return a readable lesson (malformed JSON twice). Try again in a moment.");
  };

  let raw = await queryBundle(basePrompt);
  let outcome = await validateAndExecute(dataDir, track, raw, docSlugs, false);
  if (outcome.failures.length > 0) {
    // ONE retry with the failures included.
    console.warn(`[author] first attempt failed verification (${outcome.failures.length} issue(s)) — retrying`);
    const retryPrompt = `${basePrompt}

## IMPORTANT — your previous attempt failed verification
Your previous JSON:
${JSON.stringify(raw).slice(0, 24_000)}

Its problems (fix EVERY one, keep everything that already worked, and return the corrected COMPLETE JSON object):
${outcome.failures.map((f) => `- ${f}`).join("\n")}`;
    raw = await queryBundle(retryPrompt);
    outcome = await validateAndExecute(dataDir, track, raw, docSlugs, true);
  }
  if (outcome.failures.length > 0 || !outcome.bundle || !outcome.lesson || !outcome.checks) {
    throw new Error(`The lesson couldn't be verified:\n${outcome.failures.join("\n")}`);
  }
  return { bundle: outcome.bundle, lesson: outcome.lesson, checks: outcome.checks, warnings: outcome.warnings };
}

// ---------- accept: write the bundle into content/ ----------

interface TrackJsonUnit {
  id: string;
  title?: string;
  tier?: string;
  summary?: string;
  lessons?: string[];
  [k: string]: unknown;
}

/**
 * Surgical track.json edit: append `lessonId` to the 90-custom unit (creating
 * the unit if absent) by TEXT insertion, so the rest of the hand-formatted
 * file keeps its byte-exact formatting. Returns null when the file's shape
 * defies the surgical path — the caller then falls back to parse/stringify.
 */
export function addCustomLessonToTrackJson(rawText: string, lessonId: string): string | null {
  const unitMarker = `"id": "${CUSTOM_UNIT_ID}"`;
  const unitAt = rawText.indexOf(unitMarker);
  if (unitAt === -1) {
    // No custom unit yet: insert one before the closing of the units array,
    // which (in every track.json) is the final `]` + `}` of the file.
    const tail = /\n {2}\]\s*\n\}\s*$/.exec(rawText);
    if (!tail) return null;
    const unitJson = `,
    {
      "id": ${JSON.stringify(CUSTOM_UNIT_ID)},
      "title": ${JSON.stringify(CUSTOM_UNIT_TITLE)},
      "tier": "custom",
      "summary": "Lessons you asked for.",
      "lessons": [
        ${JSON.stringify(lessonId)}
      ]
    }`;
    return rawText.slice(0, tail.index) + unitJson + rawText.slice(tail.index);
  }
  // Unit exists: append to its lessons array. Lesson arrays hold only
  // strings, so the first `]` after `"lessons": [` is the array's close.
  const lessonsAt = rawText.indexOf(`"lessons"`, unitAt);
  if (lessonsAt === -1) return null;
  const openAt = rawText.indexOf("[", lessonsAt);
  const closeAt = rawText.indexOf("]", openAt);
  if (openAt === -1 || closeAt === -1) return null;
  const inner = rawText.slice(openAt + 1, closeAt);
  if (inner.includes(JSON.stringify(lessonId))) return rawText; // already listed
  const insert = inner.trim()
    ? `${inner.replace(/\s*$/, "")},\n        ${JSON.stringify(lessonId)}\n      `
    : `\n        ${JSON.stringify(lessonId)}\n      `;
  return rawText.slice(0, openAt + 1) + insert + rawText.slice(closeAt);
}

/** A surgical edit is only trusted if it still parses and actually lists the
 *  lesson in the custom unit. */
function isValidTrackEdit(text: string, lessonId: string): boolean {
  try {
    const json = JSON.parse(text) as { units?: TrackJsonUnit[] };
    return Boolean(json.units?.find((u) => u.id === CUSTOM_UNIT_ID)?.lessons?.includes(lessonId));
  } catch {
    return false;
  }
}

/** Writes the proven bundle to content/tracks/<track>/units/90-custom/<id>/,
 *  surgically adds the unit/lesson to track.json, reloads the curriculum, and
 *  returns the new lesson key. */
export async function writeAcceptedLesson(contentDir: string, generated: GeneratedLesson): Promise<string> {
  const { bundle, lesson } = generated;
  const trackDir = path.join(contentDir, "tracks", lesson.trackId);
  const unitDir = path.join(trackDir, "units", CUSTOM_UNIT_ID);

  // Unique folder: accepting the same idea twice gets a -2/-3… suffix.
  let id = bundle.id;
  for (let n = 2; n <= 50; n++) {
    try {
      await fs.access(path.join(unitDir, id));
      id = `${bundle.id}-${n}`;
    } catch {
      break;
    }
  }

  const lessonDir = path.join(unitDir, id);
  const writeInto = async (rel: string, contents: string): Promise<void> => {
    const full = path.resolve(lessonDir, rel);
    if (full !== path.resolve(lessonDir) && !full.startsWith(path.resolve(lessonDir) + path.sep)) {
      throw new Error(`illegal file path: ${rel}`);
    }
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, contents.endsWith("\n") ? contents : `${contents}\n`, "utf8");
  };

  const frontmatter: Record<string, unknown> = {
    id,
    title: bundle.title,
    language: bundle.language,
    runner: bundle.runner,
    estMinutes: bundle.estMinutes,
    files: bundle.files,
    goal: bundle.goal,
    ...(bundle.docs?.length ? { docs: bundle.docs } : {}),
    checks: bundle.checks,
    ...(bundle.hints?.length ? { hints: bundle.hints } : {}),
    ...(bundle.timeoutMs !== undefined ? { timeoutMs: bundle.timeoutMs } : {}),
  };
  await writeInto("lesson.md", matter.stringify(`\n${bundle.body}\n`, frontmatter));
  for (const [p, contents] of Object.entries(bundle.starterFiles)) {
    await writeInto(path.posix.join("starter", p), contents);
  }
  for (const [p, contents] of Object.entries(bundle.solutionFiles)) {
    await writeInto(path.posix.join("solution", p), contents);
  }
  for (const [p, contents] of Object.entries(bundle.testFiles)) {
    await writeInto(p, contents);
  }

  // Surgical track.json edit: create the custom unit if absent, append the lesson.
  const trackFile = path.join(trackDir, "track.json");
  await withFileLock(trackFile, async () => {
    const rawText = await fs.readFile(trackFile, "utf8");
    const surgical = addCustomLessonToTrackJson(rawText, id);
    let out: string;
    if (surgical !== null && isValidTrackEdit(surgical, id)) {
      out = surgical;
    } else {
      // Structural fallback — always correct, may reflow formatting.
      const json = JSON.parse(rawText.replace(/^﻿/, "")) as { units: TrackJsonUnit[] };
      let unit = json.units.find((u) => u.id === CUSTOM_UNIT_ID);
      if (!unit) {
        unit = {
          id: CUSTOM_UNIT_ID,
          title: CUSTOM_UNIT_TITLE,
          tier: "custom",
          summary: "Lessons you asked for.",
          lessons: [],
        };
        json.units.push(unit);
      }
      unit.lessons ??= [];
      if (!unit.lessons.includes(id)) unit.lessons.push(id);
      out = JSON.stringify(json, null, 2) + (rawText.endsWith("\n") ? "\n" : "");
    }
    await writeTextInLock(trackFile, out);
  });

  await reloadCurriculum(contentDir);
  return `${lesson.trackId}/${CUSTOM_UNIT_ID}/${id}`;
}
