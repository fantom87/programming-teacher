import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import {
  lessonFrontmatterSchema,
  trackSchema,
  tracksIndexSchema,
  type Lesson,
  type Track,
} from "@teacher/shared";

export interface ContentError {
  file: string;
  message: string;
}

export interface Curriculum {
  tracks: Track[];
  /** key = "trackId/unitId/lessonId" */
  lessons: Map<string, Lesson>;
  /** solution files per lesson key (tutor-only — never sent to the frontend) */
  solutions: Map<string, Record<string, string>>;
  errors: ContentError[];
}

export function lessonKey(trackId: string, unitId: string, lessonId: string): string {
  return `${trackId}/${unitId}/${lessonId}`;
}

async function readDirFiles(dir: string): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const full = path.join(dir, name);
    if ((await fs.stat(full)).isFile()) out[name] = await fs.readFile(full, "utf8");
  }
  return out;
}

function zodIssues(file: string, error: { issues: { path: PropertyKey[]; message: string }[] }): ContentError[] {
  return error.issues.map((i) => ({
    file,
    message: `${i.path.join(".") || "(root)"}: ${i.message}`,
  }));
}

export async function loadCurriculum(contentDir: string): Promise<Curriculum> {
  const errors: ContentError[] = [];
  const tracks: Track[] = [];
  const lessons = new Map<string, Lesson>();
  const solutions = new Map<string, Record<string, string>>();

  const indexFile = path.join(contentDir, "tracks.json");
  let order: string[] = [];
  try {
    const parsed = tracksIndexSchema.safeParse(JSON.parse(await fs.readFile(indexFile, "utf8")));
    if (parsed.success) order = parsed.data.order;
    else errors.push(...zodIssues(indexFile, parsed.error));
  } catch (err) {
    errors.push({ file: indexFile, message: String(err) });
    return { tracks, lessons, solutions, errors };
  }

  for (const trackId of order) {
    const trackFile = path.join(contentDir, "tracks", trackId, "track.json");
    let track: Track;
    try {
      const parsed = trackSchema.safeParse(JSON.parse(await fs.readFile(trackFile, "utf8")));
      if (!parsed.success) {
        errors.push(...zodIssues(trackFile, parsed.error));
        continue;
      }
      track = parsed.data as Track;
    } catch (err) {
      errors.push({ file: trackFile, message: String(err) });
      continue;
    }
    if (track.id !== trackId) {
      errors.push({ file: trackFile, message: `track id "${track.id}" doesn't match folder "${trackId}"` });
    }
    tracks.push(track);

    for (const unit of track.units) {
      for (const lessonId of unit.lessons) {
        const lessonDir = path.join(contentDir, "tracks", trackId, "units", unit.id, lessonId);
        const lessonFile = path.join(lessonDir, "lesson.md");
        let raw: string;
        try {
          raw = await fs.readFile(lessonFile, "utf8");
        } catch {
          errors.push({
            file: trackFile,
            message: `lesson "${lessonId}" listed in unit "${unit.id}" but ${lessonFile} is missing`,
          });
          continue;
        }
        const { data, content: body } = matter(raw);
        const parsed = lessonFrontmatterSchema.safeParse(data);
        if (!parsed.success) {
          errors.push(...zodIssues(lessonFile, parsed.error));
          continue;
        }
        const meta = parsed.data;
        if (meta.id !== lessonId) {
          errors.push({ file: lessonFile, message: `lesson id "${meta.id}" doesn't match folder "${lessonId}"` });
        }

        const starterFiles: Record<string, string> = {};
        for (const f of meta.files) {
          const starterPath = path.join(lessonDir, f.starter);
          try {
            starterFiles[f.path] = await fs.readFile(starterPath, "utf8");
          } catch {
            errors.push({ file: lessonFile, message: `starter file "${f.starter}" not found` });
          }
        }

        // Check assets must exist.
        for (const check of meta.checks) {
          if (check.type === "tests") {
            try {
              await fs.access(path.join(lessonDir, check.testFile));
            } catch {
              errors.push({ file: lessonFile, message: `check "${check.id}": test file "${check.testFile}" not found` });
            }
          }
        }

        const key = lessonKey(trackId, unit.id, lessonId);
        lessons.set(key, {
          ...meta,
          trackId,
          unitId: unit.id,
          body: body.trim(),
          starterFiles,
        });
        const sol = await readDirFiles(path.join(lessonDir, "solution"));
        if (Object.keys(sol).length > 0) solutions.set(key, sol);
      }
    }
  }

  return { tracks, lessons, solutions, errors };
}

// ---------- cached singleton ----------

let cache: Curriculum | null = null;

export async function getCurriculum(contentDir: string): Promise<Curriculum> {
  if (!cache) cache = await loadCurriculum(contentDir);
  return cache;
}

export async function reloadCurriculum(contentDir: string): Promise<Curriculum> {
  cache = await loadCurriculum(contentDir);
  return cache;
}
