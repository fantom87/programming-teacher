import path from "node:path";
import { Router } from "express";
import { DEFAULT_SETTINGS, settingsSchema, type Settings } from "@teacher/shared";
import { readJson, writeJson } from "../store/jsonStore.js";

export function settingsRoutes(dataDir: string): Router {
  const r = Router();
  const file = path.join(dataDir, "settings.json");

  r.get("/api/settings", async (_req, res) => {
    res.json(await readJson<Settings>(file, DEFAULT_SETTINGS));
  });

  r.put("/api/settings", async (req, res) => {
    const parsed = settingsSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join("; ") });
      return;
    }
    await writeJson(file, parsed.data);
    res.status(204).end();
  });

  return r;
}
