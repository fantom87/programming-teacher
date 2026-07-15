import path from "node:path";
import type { JournalEntry } from "@teacher/shared";
import { readJson, readText, writeJson, writeText } from "./jsonStore.js";

const PROFILE_CAP = 2048; // keep it a profile, not a transcript

function profileFile(dataDir: string): string {
  return path.join(dataDir, "learner-profile.md");
}

export async function getProfile(dataDir: string): Promise<string> {
  return readText(profileFile(dataDir), "");
}

export async function setProfile(dataDir: string, text: string): Promise<void> {
  await writeText(profileFile(dataDir), text.slice(0, PROFILE_CAP * 2));
}

export async function appendProfileNote(dataDir: string, note: string, replaces?: string): Promise<string> {
  let profile = await getProfile(dataDir);
  if (replaces) {
    profile = profile
      .split("\n")
      .filter((line) => !line.includes(replaces))
      .join("\n");
  }
  const date = new Date().toISOString().slice(0, 7); // YYYY-MM
  profile = (profile.trim() + `\n- ${date}: ${note.trim()}`).trim() + "\n";
  // Prune oldest notes past the cap.
  while (profile.length > PROFILE_CAP) {
    const lines = profile.split("\n");
    lines.shift();
    profile = lines.join("\n");
  }
  await setProfile(dataDir, profile);
  return profile;
}

// ---------- Learning journal ----------

function journalFile(dataDir: string): string {
  return path.join(dataDir, "journal.json");
}

export async function getJournal(dataDir: string): Promise<JournalEntry[]> {
  return readJson<JournalEntry[]>(journalFile(dataDir), []);
}

export async function appendJournal(dataDir: string, entry: JournalEntry): Promise<void> {
  const journal = await getJournal(dataDir);
  journal.push(entry);
  await writeJson(journalFile(dataDir), journal);
}
