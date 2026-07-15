import { Router } from "express";
import { getCurriculum, reloadCurriculum } from "../curriculum/loader.js";
import { getProgress } from "../store/progress.js";

export function curriculumRoutes(contentDir: string, dataDir: string): Router {
  const r = Router();

  // Tracks + units + per-lesson completion, shaped for Home/Track views.
  r.get("/api/curriculum", async (_req, res) => {
    const cur = await getCurriculum(contentDir);
    const progress = await getProgress(dataDir);
    const tracks = cur.tracks.map((t) => ({
      ...t,
      units: t.units.map((u) => ({
        ...u,
        lessons: u.lessons.map((lessonId) => {
          const key = `${t.id}/${u.id}/${lessonId}`;
          const lesson = cur.lessons.get(key);
          return {
            id: lessonId,
            key,
            title: lesson?.title ?? lessonId,
            estMinutes: lesson?.estMinutes ?? 10,
            runner: lesson?.runner ?? "browser",
            completedAt: progress.lessons[key]?.completedAt ?? null,
          };
        }),
      })),
    }));
    res.json({ tracks, errors: cur.errors });
  });

  // Full lesson content (frontmatter + body + starter files). No solutions, ever.
  r.get("/api/curriculum/lesson", async (req, res) => {
    const key = String(req.query.id ?? "");
    const cur = await getCurriculum(contentDir);
    const lesson = cur.lessons.get(key);
    if (!lesson) {
      res.status(404).json({ error: `no lesson "${key}"` });
      return;
    }
    res.json(lesson);
  });

  r.post("/api/curriculum/validate", async (_req, res) => {
    const cur = await reloadCurriculum(contentDir);
    res.json({ ok: cur.errors.length === 0, errors: cur.errors });
  });

  return r;
}
