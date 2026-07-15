import { Router } from "express";
import { getCurriculum } from "../curriculum/loader.js";
import { runLocal } from "../runner/localRunner.js";
import { evaluateDomAssertions } from "../runner/domCheck.js";
import { runCheckPass } from "../checks/run.js";
import { completeLesson, recordAttempt, recordChecks } from "../store/progress.js";
import { takeSnapshot, listSnapshots, getSnapshot } from "../store/snapshots.js";
import { detectRuntimes } from "../preflight.js";

function missingRuntimeError(language: string, runtimes: { python: string | null; dotnet: string | null }) {
  if (language === "python" && !runtimes.python) {
    return "Python isn't installed (or not on PATH). Install it with: winget install Python.Python.3.12";
  }
  if (language === "csharp" && !runtimes.dotnet) {
    return "The .NET SDK isn't installed. Install it with: winget install Microsoft.DotNet.SDK.8";
  }
  return null;
}

export function runRoutes(contentDir: string, dataDir: string): Router {
  const r = Router();

  // Local-runner execution of the user's editor files (no goal checking).
  r.post("/api/run", async (req, res) => {
    const { lessonId, files } = req.body ?? {};
    const cur = await getCurriculum(contentDir);
    const lesson = cur.lessons.get(String(lessonId));
    if (!lesson || typeof files !== "object") {
      res.status(400).json({ error: "lessonId and files required" });
      return;
    }
    const runtimes = await detectRuntimes();
    const missing = missingRuntimeError(lesson.language, runtimes);
    if (missing) {
      res.json({ ok: false, exitCode: null, stdout: "", stderr: missing, durationMs: 0, timedOut: false });
      return;
    }
    await recordAttempt(dataDir, String(lessonId));
    await takeSnapshot(dataDir, String(lessonId), "run", files);

    if (lesson.language === "html-css") {
      // "Running" HTML = parse + snapshot; the browser shows the live preview.
      const allAssertions = lesson.checks.flatMap((c) => (c.type === "dom" ? c.assertions : []));
      const { domSnapshot } = evaluateDomAssertions(files, allAssertions);
      res.json({ ok: true, exitCode: 0, stdout: "", stderr: "", durationMs: 0, timedOut: false, domSnapshot });
      return;
    }

    const result = await runLocal(dataDir, {
      language: lesson.language,
      entry: lesson.files[0].path,
      files,
      timeoutMs: lesson.timeoutMs,
    });
    res.json(result);
  });

  // Canonical goal check: runs, evaluates every check, completes the lesson
  // when all required (non-ai) checks pass.
  r.post("/api/check", async (req, res) => {
    const { lessonId, files } = req.body ?? {};
    const cur = await getCurriculum(contentDir);
    const lesson = cur.lessons.get(String(lessonId));
    if (!lesson || typeof files !== "object") {
      res.status(400).json({ error: "lessonId and files required" });
      return;
    }
    const runtimes = await detectRuntimes();
    const missing = lesson.language !== "html-css" ? missingRuntimeError(lesson.language, runtimes) : null;
    if (missing) {
      res.status(409).json({ error: missing });
      return;
    }
    await takeSnapshot(dataDir, String(lessonId), "check", files);

    const pass = await runCheckPass(dataDir, lesson, files, lesson.testFiles);
    await recordChecks(dataDir, pass.checks.filter((c) => c.passed).length, pass.checks.filter((c) => !c.passed).length);

    let completed = false;
    if (pass.passedRequired) {
      await completeLesson(dataDir, String(lessonId));
      completed = true;
    }
    res.json({ run: pass.run, checks: pass.checks, completed });
  });

  r.get("/api/snapshots", async (req, res) => {
    res.json(await listSnapshots(dataDir, String(req.query.id ?? "")));
  });

  // Browser-runner lessons execute client-side; they report snapshots here.
  r.post("/api/snapshots", async (req, res) => {
    const { lessonId, files, trigger } = req.body ?? {};
    if (!lessonId || typeof files !== "object") {
      res.status(400).json({ error: "lessonId and files required" });
      return;
    }
    await recordAttempt(dataDir, String(lessonId));
    await takeSnapshot(dataDir, String(lessonId), trigger === "check" ? "check" : "run", files);
    res.status(204).end();
  });

  r.get("/api/snapshots/one", async (req, res) => {
    const snap = await getSnapshot(dataDir, String(req.query.id ?? ""), String(req.query.snap ?? ""));
    if (!snap) {
      res.status(404).json({ error: "snapshot not found" });
      return;
    }
    res.json(snap);
  });

  return r;
}
