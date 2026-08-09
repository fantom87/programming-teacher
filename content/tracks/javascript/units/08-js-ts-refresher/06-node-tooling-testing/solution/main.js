import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function describePath(p) {
  const ext = path.extname(p);
  return `${path.basename(p)} (${ext || "no ext"})`;
}

function saveNote(title, body) {
  writeFileSync(`${slugify(title)}.md`, `# ${title}\n\n${body}\n`);
}

function readNote(title) {
  return readFileSync(`${slugify(title)}.md`, "utf8");
}

// Drill — leave these lines exactly as they are:
console.log(slugify("  Hello, Node!  "));
console.log(describePath("src/notes/todo.md"));
console.log(describePath("README"));
saveNote("Ship It", "Deploy on Friday.");
console.log(readNote("Ship It").split("\n")[0]);
console.log(`hello, ${process.argv[2] ?? "world"}`);
