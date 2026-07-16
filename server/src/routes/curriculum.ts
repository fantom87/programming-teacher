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

    // The lesson that follows: next in this unit, else the first lesson of
    // the next unit that has authored lessons. Null at the end of content.
    let nextLessonKey: string | null = null;
    const track = cur.tracks.find((t) => t.id === lesson.trackId);
    const unitIndex = track?.units.findIndex((u) => u.id === lesson.unitId) ?? -1;
    if (track && unitIndex >= 0) {
      const unit = track.units[unitIndex];
      const lessonIndex = unit.lessons.indexOf(lesson.id);
      if (lessonIndex >= 0 && lessonIndex + 1 < unit.lessons.length) {
        nextLessonKey = `${track.id}/${unit.id}/${unit.lessons[lessonIndex + 1]}`;
      } else {
        const nextUnit = track.units.slice(unitIndex + 1).find((u) => u.lessons.length > 0);
        if (nextUnit) nextLessonKey = `${track.id}/${nextUnit.id}/${nextUnit.lessons[0]}`;
      }
    }

    res.json({ ...lesson, nextLessonKey });
  });

  r.post("/api/curriculum/validate", async (_req, res) => {
    const cur = await reloadCurriculum(contentDir);
    res.json({ ok: cur.errors.length === 0, errors: cur.errors });
  });

  return r;
}
