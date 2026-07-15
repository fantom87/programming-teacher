import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import type { Snapshot } from "@teacher/shared";
import { readJson, writeJson } from "./jsonStore.js";

const KEEP = 10;

function snapDir(dataDir: string, lessonKey: string): string {
  return path.join(dataDir, "snapshots", lessonKey.replaceAll("/", "__"));
}

export async function takeSnapshot(
  dataDir: string,
  lessonKey: string,
  trigger: "run" | "check",
  files: Record<string, string>,
): Promise<void> {
  const dir = snapDir(dataDir, lessonKey);
  const snap: Snapshot = {
    id: crypto.randomUUID().slice(0, 8),
    lessonId: lessonKey,
    takenAt: new Date().toISOString(),
    trigger,
    files,
  };
  await writeJson(path.join(dir, `${snap.takenAt.replaceAll(":", "-")}_${snap.id}.json`), snap);
  // Ring buffer: keep the newest KEEP.
  const entries = (await fs.readdir(dir)).filter((f) => f.endsWith(".json")).sort();
  for (const stale of entries.slice(0, Math.max(0, entries.length - KEEP))) {
    await fs.rm(path.join(dir, stale), { force: true });
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
    return [] as never;
  }
  for (const f of entries) {
    if (f.includes(`_${id}.json`)) return readJson<Snapshot | null>(path.join(dir, f), null);
  }
  return null;
}
