import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

// Atomic JSON persistence: write to a uniquely-named temp file, then rename
// over the target, so a crash mid-write can never corrupt saved data. Writes
// to the same file are additionally serialized through a per-file promise
// queue, so concurrent requests can't interleave renames or lose updates.

const queues = new Map<string, Promise<unknown>>();

/**
 * Serialize async work on one file. Read-modify-write helpers (store/progress
 * and friends) run their whole cycle inside this lock so overlapping requests
 * can't lose each other's updates. Inside the callback, write with
 * writeJsonInLock/writeTextInLock — the plain writers take this same lock and
 * would deadlock.
 */
export function withFileLock<T>(file: string, fn: () => Promise<T>): Promise<T> {
  const key = path.resolve(file);
  const prev = queues.get(key) ?? Promise.resolve();
  const run = prev.then(fn);
  queues.set(key, run.catch(() => {})); // keep the chain alive after failures
  return run;
}

export async function readJson<T>(file: string, fallback: T): Promise<T> {
  let text: string;
  try {
    // Strip a UTF-8 BOM if present — files edited by hand (or PowerShell)
    // often carry one, and JSON.parse rejects it.
    text = (await fs.readFile(file, "utf8")).replace(/^﻿/, "");
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[store] couldn't read ${path.basename(file)} (${String(err)}) — using defaults`);
    }
    return fallback;
  }
  try {
    return JSON.parse(text) as T;
  } catch (err) {
    // Corrupt (likely hand-edited) file: set it aside so the next write
    // starts clean, log once, and carry on. Never throw to routes.
    const corrupt = `${file}.corrupt-${Date.now()}`;
    await fs.rename(file, corrupt).catch(() => {});
    console.warn(
      `[store] ${path.basename(file)} is not valid JSON (${String(err)}) — moved to ${path.basename(corrupt)}, using defaults`,
    );
    return fallback;
  }
}

async function atomicWrite(file: string, data: string): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(tmp, data, "utf8");
  await fs.rename(tmp, file);
}

export async function writeJson(file: string, value: unknown): Promise<void> {
  await withFileLock(file, () => atomicWrite(file, JSON.stringify(value, null, 2)));
}

/** Write without re-taking the per-file lock — only for use INSIDE withFileLock. */
export async function writeJsonInLock(file: string, value: unknown): Promise<void> {
  await atomicWrite(file, JSON.stringify(value, null, 2));
}

export async function readText(file: string, fallback: string): Promise<string> {
  try {
    return await fs.readFile(file, "utf8");
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[store] couldn't read ${path.basename(file)} (${String(err)}) — using defaults`);
    }
    return fallback;
  }
}

export async function writeText(file: string, value: string): Promise<void> {
  await withFileLock(file, () => atomicWrite(file, value));
}

/** Write without re-taking the per-file lock — only for use INSIDE withFileLock. */
export async function writeTextInLock(file: string, value: string): Promise<void> {
  await atomicWrite(file, value);
}
