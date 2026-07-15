import path from "node:path";
import { Router } from "express";
import { readJson, writeJson } from "../store/jsonStore.js";

// Auto-saved editor contents per lesson (and playground scratchpads).
// Draft ids are lesson keys ("python/01-first-steps/01-hello-world") or
// "playground-<language>"; slashes become "__" on disk.

function draftFile(dataDir: string, id: string): string {
  return path.join(dataDir, "drafts", `${id.replaceAll("/", "__")}.json`);
}

export function draftRoutes(dataDir: string): Router {
  const r = Router();

  r.get("/api/drafts", async (req, res) => {
    const id = String(req.query.id ?? "");
    if (!id) {
      res.status(400).json({ error: "id required" });
      return;
    }
    const draft = await readJson<{ files: Record<string, string> } | null>(draftFile(dataDir, id), null);
    res.json(draft ?? { files: null });
  });

  r.put("/api/drafts", async (req, res) => {
    const id = String(req.query.id ?? "");
    const files = req.body?.files;
    if (!id || typeof files !== "object" || files === null) {
      res.status(400).json({ error: "id and files required" });
      return;
    }
    await writeJson(draftFile(dataDir, id), { files, savedAt: new Date().toISOString() });
    res.status(204).end();
  });

  return r;
}
