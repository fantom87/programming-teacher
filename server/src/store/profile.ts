import path from "node:path";
import type { JournalEntry } from "@teacher/shared";
import { readJson, readText, writeJson, writeText } from "./jsonStore.js";

const PROFILE_CAP = 2048; // the one cap for every write path — keep it a profile, not a transcript
const MIN_NOTES_KEPT = 5; // pruning never eats the most recent notes
const NOTE_LINE = /^- \d{4}-\d{2}: /; // dated notes written by appendProfileNote

function profileFile(dataDir: string): string {
  return path.join(dataDir, "learner-profile.md");
}

export async function getProfile(dataDir: string): Promise<string> {
  return readText(profileFile(dataDir), "");
}

export async function setProfile(dataDir: string, text: string): Promise<void> {
  await writeText(profileFile(dataDir), text.slice(0, PROFILE_CAP));
}

export async function appendProfileNote(dataDir: string, note: string, replaces?: string): Promise<string> {
  let profile = await getProfile(dataDir);
  if (replaces) {
    // Remove only the FIRST matching line — a generic fragment must not wipe
    // every note that happens to contain it.
    const lines = profile.split("\n");
    const idx = lines.findIndex((line) => line.includes(replaces));
    if (idx !== -1) {
      lines.splice(idx, 1);
      profile = lines.join("\n");
    }
  }
  const date = new Date().toISOString().slice(0, 7); // YYYY-MM
  profile = (profile.trim() + `\n- ${date}: ${note.trim()}`).trim() + "\n";
  // Past the cap, prune the OLDEST dated notes first. Never touch other lines
  // (the learner hand-edits this file) and never drop below the newest 5 notes.
  const lines = profile.split("\n");
  const noteIndexes = () => lines.flatMap((l, i) => (NOTE_LINE.test(l) ? [i] : []));
  let notes = noteIndexes();
  while (lines.join("\n").length > PROFILE_CAP && notes.length > MIN_NOTES_KEPT) {
    lines.splice(notes[0], 1);
    notes = noteIndexes();
  }
  profile = lines.join("\n");
  // Write directly (not via setProfile) so the 5-note floor survives even when
  // a long hand-written header keeps the file slightly over the cap.
  await writeText(profileFile(dataDir), profile);
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
