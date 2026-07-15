import type { Lesson, Progress, Tier, Language, RunnerKind } from "@teacher/shared";

export interface LessonRow {
  id: string;
  key: string;
  title: string;
  estMinutes: number;
  runner: RunnerKind;
  completedAt: string | null;
}

export interface UnitView {
  id: string;
  title: string;
  tier: Tier;
  summary: string;
  lessons: LessonRow[];
  planned?: boolean;
  plannedLessons?: string[];
  topics?: string[];
}

export interface TrackView {
  id: string;
  title: string;
  language: Language;
  philosophy: string;
  units: UnitView[];
}

export interface CurriculumResponse {
  tracks: TrackView[];
  errors: { file: string; message: string }[];
}

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json() as Promise<T>;
}

async function send(method: string, url: string, body?: unknown): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${method} ${url} → ${res.status}`);
  return res;
}

export const api = {
  curriculum: () => get<CurriculumResponse>("/api/curriculum"),
  lesson: (key: string) => get<Lesson>(`/api/curriculum/lesson?id=${encodeURIComponent(key)}`),
  progress: () => get<Progress>("/api/progress"),
  completeLesson: async (lessonKey: string): Promise<Progress> => {
    const res = await send("POST", "/api/progress/complete", { lessonKey });
    return res.json() as Promise<Progress>;
  },
  draft: (id: string) =>
    get<{ files: Record<string, string> | null }>(`/api/drafts?id=${encodeURIComponent(id)}`),
  saveDraft: (id: string, files: Record<string, string>) =>
    send("PUT", `/api/drafts?id=${encodeURIComponent(id)}`, { files }).then(() => undefined),
};
