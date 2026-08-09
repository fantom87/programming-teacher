import path from "node:path";
import fs from "node:fs/promises";
import { Router } from "express";
import { getProgress, recordActivity } from "../store/progress.js";
import { resetAllTutorState } from "../tutor/service.js";

export function progressRoutes(dataDir: string): Router {
  const r = Router();

  // Wipes learning state; keeps settings + profile. The x-confirm header is
  // the server-side twin of the Settings UI's confirm dialog — no accidental
  // (or cross-site) wipes.
  r.post("/api/progress/reset", async (req, res) => {
    if (req.get("x-confirm") !== "reset") {
      res.status(400).json({ error: 'progress reset requires the "x-confirm: reset" header' });
      return;
    }
    // Close live tutor sessions and delete their SDK transcripts first — a
    // wipe shouldn't leave conversation history behind outside data/.
    await resetAllTutorState(dataDir).catch(() => {});
    const failed: string[] = [];
    for (const target of ["progress.json", "journal.json", "drafts", "snapshots", "sessions"]) {
      try {
        // maxRetries: Windows file locks (editors, antivirus) reject the
        // first rm; force only covers nonexistence.
        await fs.rm(path.join(dataDir, target), { recursive: true, force: true, maxRetries: 3 });
      } catch (err) {
        failed.push(`${target} (${(err as NodeJS.ErrnoException).code ?? String(err)})`);
      }
    }
    if (failed.length > 0) {
      res.status(500).json({ error: `couldn't delete: ${failed.join(", ")} — close anything using the data folder and retry` });
      return;
    }
    res.status(204).end();
  });

  r.get("/api/progress", async (_req, res) => {
    res.json(await getProgress(dataDir));
  });

  // Activity heartbeat from the Lesson view (60s ticks while visible): feeds
  // per-lesson time-spent and the ≥15-minutes-a-day streak rule. Completion
  // stays /api/check's job — there is no manual-complete endpoint.
  r.post("/api/progress/activity", async (req, res) => {
    const seconds = Number(req.body?.seconds);
    if (!Number.isFinite(seconds) || seconds <= 0 || seconds > 3600) {
      res.status(400).json({ error: "seconds must be between 1 and 3600" });
      return;
    }
    const lessonKey =
      typeof req.body?.lessonKey === "string" && req.body.lessonKey ? (req.body.lessonKey as string) : undefined;
    res.json(await recordActivity(dataDir, seconds, lessonKey));
  });

  return r;
}
