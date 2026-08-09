import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const SOURCE = "notes.txt";

// Pure transform: string in, facts out. No disk in here — that's what
// lets the tests feed it strings no file ever contained.
function summarize(text) {
  const lines = text
    .split("\n")
    .map((line) => line.trim()) // eats stray \r from Windows line endings
    .filter((line) => line !== "");
  const longest = lines.reduce((a, b) => (b.length > a.length ? b : a), "");
  return { lines, longest };
}

// Read.
const { lines, longest } = summarize(readFileSync(SOURCE, "utf8"));
console.log(`${SOURCE}: ${lines.length} lines`);
console.log(`longest: ${longest}`);

// Derive the output name — rename SOURCE and this still works.
const stem = path.basename(SOURCE, path.extname(SOURCE));
const outName = `${stem}.summary.txt`;

// Write.
const numbered = lines.map((line, i) => `${i + 1}. ${line}`);
writeFileSync(outName, [`# summary of ${SOURCE}`, ...numbered].join("\n") + "\n");
console.log(`wrote ${outName}`);

// Prove it landed: read back and count with the same logic.
const onDisk = summarize(readFileSync(outName, "utf8"));
console.log(`check: ${onDisk.lines.length} lines on disk`);
