import path from "node:path";
import fs from "node:fs/promises";
import { Router } from "express";
import { DEFAULT_SETTINGS, type Settings } from "@teacher/shared";
import { readJson } from "../store/jsonStore.js";
import { getProgress } from "../store/progress.js";
import { getJournal, getProfile } from "../store/profile.js";

export function exportRoutes(dataDir: string): Router {
  const r = Router();

  // "Download my data": everything the app persists, as one JSON backup.
  r.get("/api/export", async (_req, res) => {
    const drafts: Record<string, unknown> = {};
    try {
      for (const f of await fs.readdir(path.join(dataDir, "drafts"))) {
        if (!f.endsWith(".json")) continue;
        const id = f.slice(0, -".json".length).replaceAll("__", "/");
        drafts[id] = await readJson<unknown>(path.join(dataDir, "drafts", f), null);
      }
    } catch {
      // no drafts yet — fine
    }
    const journalEntries = await getJournal(dataDir);
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      settings: await readJson<Settings>(path.join(dataDir, "settings.json"), DEFAULT_SETTINGS),
      progress: await getProgress(dataDir),
      journal: journalEntries,
      profile: await getProfile(dataDir),
      drafts,
      journalEntries,
    };
    const date = new Date().toISOString().slice(0, 10);
    res.setHeader("Content-Disposition", `attachment; filename="rubberduck-backup-${date}.json"`);
    res.json(payload);
  });

  return r;
}
