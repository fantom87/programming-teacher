import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import type { Snapshot } from "@teacher/shared";
import { readJson, writeJson } from "./jsonStore.js";
import { isKnownLessonKey } from "../curriculum/loader.js";

const KEEP = 10;

// Lesson keys come in off the wire — never let one become a path escape.
// Checked BEFORE the "/" → "__" substitution: no dots, colons, or backslashes.
const KEY_RE = /^[a-z0-9][a-z0-9/_-]*$/i;
const PLAYGROUND_RE = /^playground\/(python|javascript|html-css|csharp)(\/[a-z0-9_-]+)*$/;

function badRequest(message: string): Error {
  return Object.assign(new Error(message), { status: 400 });
}

function snapDir(dataDir: string, lessonKey: string): string {
  if (!KEY_RE.test(lessonKey)) throw badRequest(`invalid lesson key "${lessonKey}"`);
  return path.join(dataDir, "snapshots", lessonKey.replaceAll("/", "__"));
}

export async function takeSnapshot(
  dataDir: string,
  lessonKey: string,
  trigger: "run" | "check",
  files: Record<string, string>,
): Promise<Snapshot> {
  const dir = snapDir(dataDir, lessonKey);
  // Snapshots only exist for real lessons (or playground scratchpads) — an
  // arbitrary key must not create directories.
  if (!PLAYGROUND_RE.test(lessonKey) && !(await isKnownLessonKey(lessonKey))) {
    throw badRequest(`unknown lesson "${lessonKey}"`);
  }
  const snap: Snapshot = {
    id: crypto.randomUUID().slice(0, 8),
    lessonId: lessonKey,
    takenAt: new Date().toISOString(),
    trigger,
    files,
  };
  await writeJson(path.join(dir, `${snap.takenAt.replaceAll(":", "-")}_${snap.id}.json`), snap);
  await pruneSnapshots(dir);
  return snap;
}

// Ring buffer: keep the newest KEEP — but never evict the most recent passing
// snapshot. Post-completion experimentation must not destroy the code that
// passed; it's the learner's only durable copy of their solution.
async function pruneSnapshots(dir: string): Promise<void> {
  const entries = (await fs.readdir(dir)).filter((f) => f.endsWith(".json")).sort();
  if (entries.length <= KEEP) return;
  let newestPassed: string | null = null;
  for (const f of [...entries].reverse()) {
    const snap = await readJson<Snapshot | null>(path.join(dir, f), null);
    if (snap?.passed) {
      newestPassed = f;
      break;
    }
  }
  for (const stale of entries.slice(0, entries.length - KEEP)) {
    if (stale === newestPassed) continue;
    await fs.rm(path.join(dir, stale), { force: true });
  }
}

/** Flag a snapshot as the code that passed every check (called by /api/check
 *  on completion). Pinned against ring eviction; shown as a restore point. */
export async function markSnapshotPassed(dataDir: string, lessonKey: string, id: string): Promise<void> {
  const dir = snapDir(dataDir, lessonKey);
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return;
  }
  for (const f of entries) {
    if (f.includes(`_${id}.json`)) {
      const snap = await readJson<Snapshot | null>(path.join(dir, f), null);
      if (snap) await writeJson(path.join(dir, f), { ...snap, passed: true });
      return;
    }
  }
}

export async function listSnapshots(dataDir: string, lessonKey: string): Promise<Omit<Snapshot, "files">[]> {
  const dir = snapDir(dataDir, lessonKey);
  let entries: string[];
  try {
    entries = (await fs.readdir(dir)).filter((f) => f.endsWith(".json")).sort().reverse();
  } catch {
    return [];
  }
  const out: Omit<Snapshot, "files">[] = [];
  for (const f of entries) {
    const snap = await readJson<Snapshot | null>(path.join(dir, f), null);
    if (snap) {
      const { files: _files, ...meta } = snap;
      out.push(meta);
    }
  }
  return out;
}

export async function getSnapshot(dataDir: string, lessonKey: string, id: string): Promise<Snapshot | null> {
  const dir = snapDir(dataDir, lessonKey);
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return null;
  }
  for (const f of entries) {
    if (f.includes(`_${id}.json`)) return readJson<Snapshot | null>(path.join(dir, f), null);
  }
  return null;
}
