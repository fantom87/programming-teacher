import fs from "node:fs/promises";
import path from "node:path";

// Atomic JSON persistence: write to a temp file, then rename over the target,
// so a crash mid-write can never corrupt saved data.

export async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    // Strip a UTF-8 BOM if present — files edited by hand (or PowerShell)
    // often carry one, and JSON.parse rejects it.
    const text = (await fs.readFile(file, "utf8")).replace(/^﻿/, "");
    return JSON.parse(text) as T;
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw err;
  }
}

export async function writeJson(file: string, value: unknown): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2), "utf8");
  await fs.rename(tmp, file);
}

export async function readText(file: string, fallback: string): Promise<string> {
  try {
    return await fs.readFile(file, "utf8");
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw err;
  }
}

export async function writeText(file: string, value: string): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, value, "utf8");
  await fs.rename(tmp, file);
}
