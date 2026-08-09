// Node drills — fs, path, argv. The test file for this lesson is
// literal vitest syntax; our harness runs the same assertions.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

// 1. slugify(title) — lowercase; every RUN of non-alphanumerics becomes
//    one "-"; no leading/trailing dashes. "  Hello, Node!  " -> "hello-node".

// 2. describePath(p) — `${basename} (${extname})`, printing "no ext"
//    when path.extname comes back empty. "src/notes/todo.md" -> "todo.md (.md)".

// 3. saveNote(title, body) — writeFileSync `# ${title}\n\n${body}\n`
//    to `${slugify(title)}.md`.
//    readNote(title) — read the SAME file back as a string (utf8!).

// Drill — leave these lines exactly as they are:
console.log(slugify("  Hello, Node!  "));
console.log(describePath("src/notes/todo.md"));
console.log(describePath("README"));
saveNote("Ship It", "Deploy on Friday.");
console.log(readNote("Ship It").split("\n")[0]);
console.log(`hello, ${process.argv[2] ?? "world"}`);
