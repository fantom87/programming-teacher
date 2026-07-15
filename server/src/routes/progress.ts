import path from "node:path";
import fs from "node:fs/promises";
import { Router } from "express";
import { completeLesson, getProgress } from "../store/progress.js";

export function progressRoutes(dataDir: string): Router {
  const r = Router();

  // Confirm-gated in the UI. Wipes learning state; keeps settings + profile.
  r.post("/api/progress/reset", async (_req, res) => {
    for (const target of ["progress.json", "journal.json", "drafts", "snapshots", "sessions"]) {
      await fs.rm(path.join(dataDir, target), { recursive: true, force: true }).catch(() => {});
    }
    res.status(204).end();
  });

  r.get("/api/progress", async (_req, res) => {
    res.json(await getProgress(dataDir));
  });

  // M1 interim: manual completion. From M2 on, /api/check is the only path
  // that completes lessons (it verifies goal checks first); this endpoint
  // then becomes dev-only.
  r.post("/api/progress/complete", async (req, res) => {
    const key = String(req.body?.lessonKey ?? "");
    if (!key) {
      res.status(400).json({ error: "lessonKey required" });
      return;
    }
    res.json(await completeLesson(dataDir, key));
  });

  return r;
}
