import path from "node:path";
import type { Progress } from "@teacher/shared";
import { readJson, writeJson } from "./jsonStore.js";

const EMPTY: Progress = {
  lessons: {},
  streak: { current: 0, best: 0, lastActiveDate: "" },
  totals: { runs: 0, checksPassed: 0, checksFailed: 0 },
};

function progressFile(dataDir: string): string {
  return path.join(dataDir, "progress.json");
}

function localDateString(d = new Date()): string {
  // Local calendar date, not UTC — streaks follow the user's clock.
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function touchStreak(p: Progress): void {
  const today = localDateString();
  if (p.streak.lastActiveDate === today) return;
  const yesterday = localDateString(new Date(Date.now() - 86_400_000));
  p.streak.current = p.streak.lastActiveDate === yesterday ? p.streak.current + 1 : 1;
  p.streak.best = Math.max(p.streak.best, p.streak.current);
  p.streak.lastActiveDate = today;
}

export async function getProgress(dataDir: string): Promise<Progress> {
  return readJson(progressFile(dataDir), EMPTY);
}

export async function recordAttempt(dataDir: string, lessonKey: string): Promise<Progress> {
  const p = await getProgress(dataDir);
  const lp = (p.lessons[lessonKey] ??= { attempts: 0, timeSpentMin: 0 });
  lp.attempts += 1;
  p.totals.runs += 1;
  await writeJson(progressFile(dataDir), p);
  return p;
}

export async function completeLesson(dataDir: string, lessonKey: string): Promise<Progress> {
  const p = await getProgress(dataDir);
  const lp = (p.lessons[lessonKey] ??= { attempts: 0, timeSpentMin: 0 });
  if (!lp.completedAt) lp.completedAt = new Date().toISOString();
  touchStreak(p);
  await writeJson(progressFile(dataDir), p);
  return p;
}

export async function recordChecks(dataDir: string, passed: number, failed: number): Promise<void> {
  const p = await getProgress(dataDir);
  p.totals.checksPassed += passed;
  p.totals.checksFailed += failed;
  await writeJson(progressFile(dataDir), p);
}
