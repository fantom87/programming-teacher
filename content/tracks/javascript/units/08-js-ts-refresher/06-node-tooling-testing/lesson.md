---
id: 06-node-tooling-testing
title: "Node, Tooling, Testing"
language: javascript
runner: local
estMinutes: 18
files:
  - path: main.js
    starter: starter/main.js
goal: "A Node mini-tool, drilled: slugify with one regex chain, describePath on the path module, and saveNote/readNote roundtripping through the real filesystem — with vitest-shaped tests and an argv default."
docs: [javascript/npm-basics, javascript/modules]
checks:
  - id: node-functions-hold-up
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: drill-output
    type: stdout
    entry: main.js
    match: exact
    value: "hello-node\ntodo.md (.md)\nREADME (no ext)\n# Ship It\nhello, world\n"
  - id: node-idioms
    type: ai-judge
    rubric: "slugify is a chain — toLowerCase, then a regex replace collapsing every RUN of non-alphanumerics to a single '-', then a trim of leading/trailing dashes (a plain trim() is not enough) — no character-by-character loops. describePath uses path.basename and path.extname with a fallback string 'no ext' when extname returns empty — no manual splitting on slashes or dots. saveNote writes the note with writeFileSync to a filename derived as slugify(title) + '.md', with content: '# ' + title, a blank line, the body, and a trailing newline; readNote re-derives the SAME slug filename and reads with the 'utf8' encoding so it returns a string, not a Buffer. The starter's import lines and drill lines are intact — including the final line's process.argv[2] ?? \"world\" default."
hints:
  - "slugify: title.toLowerCase().replace(/[^a-z0-9]+/g, \"-\").replace(/^-+|-+$/g, \"\") — the second replace strips the edge dashes the first can leave behind."
  - "describePath: const ext = path.extname(p); return `${path.basename(p)} (${ext || \"no ext\"})`; — both helpers are separator-safe on every OS."
  - "The roundtrip hinges on two things: both functions computing the same `${slugify(title)}.md` name, and readFileSync getting \"utf8\" — forget it and the test shows you the Buffer you got instead."
---
## Node without ceremony

Last drill: the runtime under all your tooling. This file runs on the
**real Node on your machine** — real filesystem, real `path` module,
real `process.argv`.

Rapid recall:

```js
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";              // basename, extname — OS-safe
readFileSync(name, "utf8")                 // no encoding = Buffer, not string
process.argv[2] ?? "world"                 // CLI arg with a default
```

And the testing note: this lesson's test file is literal **vitest**
syntax — `test("...", () => { expect(x).toBe(y) })`. In a real repo
you'd `npm i -D vitest`, point a `package.json` script at it
(`"test": "vitest"`), and `npm test` would run every `*.test.js`; here
our harness runs the same assertions. ESLint and Prettier round out the
toolchain — linting and formatting nobody argues about.

### Your goal

1. `slugify(title)` — lowercase; every run of non-alphanumerics becomes
   one `-`; no leading/trailing dashes. `"  Hello, Node!  "` →
   `"hello-node"`.
2. `describePath(p)` — `` `${basename} (${extname})` ``, with `no ext`
   when there is none.
3. `saveNote(title, body)` — write `` `# ${title}\n\n${body}\n` `` to
   `<slug>.md`; `readNote(title)` — read the same file back as a
   string.

The starter's drill prints exactly:

```
hello-node
todo.md (.md)
README (no ext)
# Ship It
hello, world
```
