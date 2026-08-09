import crypto from "node:crypto";
import { Router } from "express";
import { getCurriculum } from "../curriculum/loader.js";
import {
  DIFFICULTIES,
  generateCustomLesson,
  writeAcceptedLesson,
  type Difficulty,
  type GeneratedLesson,
} from "../tutor/author.js";

// Custom lesson jobs (plan §17.2). In-memory only — a restart forgets
// unaccepted drafts, which is fine: accepted lessons live in content/.

interface Job {
  id: string;
  trackId: string;
  state: "generating" | "ready" | "failed";
  createdAt: number;
  result?: GeneratedLesson;
  error?: string;
}

const JOB_TTL_MS = 30 * 60 * 1000;
const MAX_CONCURRENT = 3;
const jobs = new Map<string, Job>();

function sweepJobs(): void {
  const cutoff = Date.now() - JOB_TTL_MS;
  for (const [id, job] of jobs) {
    if (job.createdAt < cutoff) jobs.delete(id);
  }
}

/** What the frontend may see: everything EXCEPT solution and test contents. */
function preview(g: GeneratedLesson) {
  const { bundle } = g;
  return {
    id: bundle.id,
    title: bundle.title,
    estMinutes: bundle.estMinutes,
    language: bundle.language,
    runner: bundle.runner,
    goal: bundle.goal,
    docs: bundle.docs ?? [],
    checks: bundle.checks,
    hints: bundle.hints ?? [],
    body: bundle.body,
    files: bundle.files.map((f) => f.path),
  };
}

export function customLessonRoutes(contentDir: string, dataDir: string): Router {
  const r = Router();

  r.post("/api/custom-lesson", async (req, res) => {
    sweepJobs();
    const { trackId, prompt, difficulty } = (req.body ?? {}) as Record<string, unknown>;
    if (
      typeof trackId !== "string" ||
      typeof prompt !== "string" ||
      !prompt.trim() ||
      !DIFFICULTIES.includes(difficulty as Difficulty)
    ) {
      res.status(400).json({ error: "trackId, prompt, difficulty (beginner|intermediate|advanced) required" });
      return;
    }
    if (prompt.length > 2000) {
      res.status(400).json({ error: "That request is too long — keep it under 2000 characters." });
      return;
    }
    const cur = await getCurriculum(contentDir);
    if (!cur.tracks.some((t) => t.id === trackId)) {
      res.status(404).json({ error: `no track "${trackId}"` });
      return;
    }
    if ([...jobs.values()].filter((j) => j.state === "generating").length >= MAX_CONCURRENT) {
      res.status(429).json({ error: "Three lessons are already being written — wait for one to finish." });
      return;
    }

    const job: Job = { id: crypto.randomUUID(), trackId, state: "generating", createdAt: Date.now() };
    jobs.set(job.id, job);
    void generateCustomLesson(contentDir, dataDir, {
      trackId,
      prompt: prompt.trim(),
      difficulty: difficulty as Difficulty,
    })
      .then((result) => {
        job.state = "ready";
        job.result = result;
      })
      .catch((err: unknown) => {
        job.state = "failed";
        job.error = err instanceof Error ? err.message : String(err);
        console.error(`[custom-lesson] job ${job.id} failed:`, job.error);
      });
    res.status(202).json({ jobId: job.id });
  });

  r.get("/api/custom-lesson/:jobId", (req, res) => {
    sweepJobs();
    const job = jobs.get(req.params.jobId);
    if (!job) {
      res.status(404).json({ error: "no such job (it may have expired)" });
      return;
    }
    if (job.state === "ready" && job.result) {
      res.json({ state: "ready", lesson: preview(job.result), checks: job.result.checks, warnings: job.result.warnings });
    } else if (job.state === "failed") {
      res.json({ state: "failed", error: job.error ?? "generation failed" });
    } else {
      res.json({ state: "generating" });
    }
  });

  r.post("/api/custom-lesson/:jobId/accept", async (req, res) => {
    sweepJobs();
    const job = jobs.get(req.params.jobId);
    if (!job) {
      res.status(404).json({ error: "no such job (it may have expired)" });
      return;
    }
    if (job.state !== "ready" || !job.result) {
      res.status(409).json({ error: job.state === "generating" ? "still generating" : "that lesson failed to generate" });
      return;
    }
    try {
      const key = await writeAcceptedLesson(contentDir, job.result);
      jobs.delete(job.id);
      res.json({ key });
    } catch (err) {
      console.error("[custom-lesson] accept failed:", err);
      res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
  });

  r.post("/api/custom-lesson/:jobId/discard", (req, res) => {
    jobs.delete(req.params.jobId);
    res.status(204).end();
  });

  return r;
}
