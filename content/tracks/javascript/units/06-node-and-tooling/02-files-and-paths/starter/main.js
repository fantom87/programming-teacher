import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const SOURCE = "notes.txt";

// 1. summarize(text) — PURE (no fs in here):
//    split on "\n", trim each line, drop blanks; return
//    { lines, longest } where longest wins by .length.

// 2. Read SOURCE with readFileSync(SOURCE, "utf8"), summarize it, print:
//    `notes.txt: 3 lines` and `longest: ...`

// 3. Derive the output name with path (basename + extname — no string
//    slicing on dots), then writeFileSync:
//      # summary of notes.txt
//      1. node handles files natively
//      ... (one numbered line each, newline-joined, trailing "\n")
//    and print `wrote notes.summary.txt`.

// 4. Read the file you just wrote, count ITS lines the same way, print:
//    `check: 4 lines on disk`
