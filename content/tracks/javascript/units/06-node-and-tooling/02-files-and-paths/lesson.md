---
id: 02-files-and-paths
title: Files and Paths
language: javascript
runner: local
estMinutes: 20
files:
  - path: main.js
    starter: starter/main.js
  - path: notes.txt
    starter: starter/notes.txt
goal: "Run the classic file cycle with node:fs and node:path — read notes.txt, summarize it with a pure function, derive the output filename with path functions, write the summary, and read it back to prove it landed."
docs: [javascript/strings, javascript/arrays, javascript/modules]
checks:
  - id: summarize-is-pure-and-robust
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: file-report
    type: stdout
    entry: main.js
    match: exact
    value: "notes.txt: 3 lines\nlongest: paths differ across platforms\nwrote notes.summary.txt\ncheck: 4 lines on disk\n"
  - id: real-io-real-paths
    type: ai-judge
    rubric: "The file is read with readFileSync(..., \"utf8\") from node:fs and the summary written with writeFileSync — no faked data. summarize(text) is pure: it splits on newlines, trims each line (so \\r from Windows line endings can't survive), filters out blanks, and finds the longest line by comparing lengths (loop or reduce) — it never touches fs. The output filename is DERIVED with path.basename(SOURCE, path.extname(SOURCE)) + \".summary.txt\" (or equivalent path-function use), not assembled by string slicing on dots. The final line re-reads the written file and counts its lines with the same splitting logic — the 4 is computed from disk, not typed."
hints:
  - "import { readFileSync, writeFileSync } from \"node:fs\"; import path from \"node:path\"; — the node: prefix marks built-ins."
  - "summarize: const lines = text.split(\"\\n\").map((l) => l.trim()).filter((l) => l !== \"\"); then reduce for the longest: lines.reduce((a, b) => (b.length > a.length ? b : a))."
  - "Derive, don't slice: const stem = path.basename(SOURCE, path.extname(SOURCE)); const outName = `${stem}.summary.txt`; — then writeFileSync(outName, [`# summary of ${SOURCE}`, ...numbered].join(\"\\n\") + \"\\n\")."
---
## The read–transform–write cycle

Last lesson gave you `process`; this one gives you the other two
pillars of every Node tool: **`node:fs`** and **`node:path`**. Nearly
everything on a computer — configs, logs, build output — is a file, and
nearly every tool you'll write runs the same cycle: *read, transform,
write*.

```js
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
```

The `node:` prefix says "built-in, not from npm." `readFileSync(name,
"utf8")` hands you the whole file as one string — the `"utf8"` matters,
because without it you get raw bytes. The runner is local, so this is
genuine I/O against the `notes.txt` sitting next to your program.

Two professional habits shape the exercise:

**Keep the transform pure.** `summarize(text)` takes a string and
returns `{ lines, longest }` — it never touches the disk. Reading and
writing stay at the edges (exactly where `process.argv` went last
lesson), so tests can feed `summarize` any string they like. And because
Windows ends lines with `\r\n`, split on `"\n"` then `trim()` each line
— a `\r` that survives is the classic cross-platform bug, and a test
lies in wait for it.

**Never build paths by hand.** Slicing filenames on `"."` breaks on
`my.data.txt`; joining folders with `"/"` breaks on Windows.
`path` knows the rules:

```js
path.extname("notes.txt")            // ".txt"
path.basename("notes.txt", ".txt")   // "notes"
path.join("dist", "app.js")          // separator chosen per-OS
```

You'll use the first two to *derive* `notes.summary.txt` from the
source name — rename the source file and the program still works.

### Your goal

1. `summarize(text)` — pure: trimmed, non-blank `lines` plus the
   `longest` line.
2. Read `notes.txt`, print its line count and longest line.
3. Write the summary file — `# summary of notes.txt`, then each line
   numbered (`1. …`) — to a name derived with `path`, and say so.
4. Read the written file back; report its line count:

```
notes.txt: 3 lines
longest: paths differ across platforms
wrote notes.summary.txt
check: 4 lines on disk
```
