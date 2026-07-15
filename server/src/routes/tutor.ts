import path from "node:path";
import { Router } from "express";
import type { AssistanceLevel, Settings } from "@teacher/shared";
import { DEFAULT_SETTINGS } from "@teacher/shared";
import { getCurriculum } from "../curriculum/loader.js";
import { readJson } from "../store/jsonStore.js";
import { getJournal, getProfile, setProfile } from "../store/profile.js";
import { hub, resetSession, sendMessage, setLevel, type TutorDeps } from "../tutor/service.js";

export function tutorRoutes(contentDir: string, dataDir: string): Router {
  const r = Router();

  const deps: TutorDeps = {
    dataDir,
    contentDir,
    getSolution: async (key) => {
      const cur = await getCurriculum(contentDir);
      return cur.solutions.get(key) ?? null;
    },
    getDocSlugs: async () => [], // docs library lands in M4
    getSettings: () => readJson<Settings>(path.join(dataDir, "settings.json"), DEFAULT_SETTINGS),
  };

  r.get("/api/tutor/stream", (req, res) => {
    const key = String(req.query.id ?? "");
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    res.write(": connected\n\n");
    const unsubscribe = hub.subscribe(key, res);
    req.on("close", unsubscribe);
  });

  r.post("/api/tutor/message", async (req, res) => {
    const { lessonId, text, files, lastRun, level } = req.body ?? {};
    const cur = await getCurriculum(contentDir);
    const lesson = cur.lessons.get(String(lessonId));
    if (!lesson || typeof text !== "string" || typeof files !== "object") {
      res.status(400).json({ error: "lessonId, text, files required" });
      return;
    }
    await sendMessage(deps, lesson, {
      text,
      files,
      lastRun: lastRun ?? null,
      level: (Number(level) || 3) as AssistanceLevel,
    });
    res.status(202).end();
  });

  r.post("/api/tutor/level", (req, res) => {
    const { lessonId, level } = req.body ?? {};
    setLevel(String(lessonId), (Number(level) || 3) as AssistanceLevel);
    res.status(204).end();
  });

  r.delete("/api/tutor", async (req, res) => {
    await resetSession(deps, String(req.query.id ?? ""));
    res.status(204).end();
  });

  r.get("/api/profile", async (_req, res) => {
    res.json({ profile: await getProfile(dataDir) });
  });

  r.put("/api/profile", async (req, res) => {
    await setProfile(dataDir, String(req.body?.profile ?? ""));
    res.status(204).end();
  });

  r.get("/api/journal", async (_req, res) => {
    res.json(await getJournal(dataDir));
  });

  return r;
}
