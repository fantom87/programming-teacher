---
id: 03-npm-and-package-json
title: npm and package.json
language: javascript
runner: local
estMinutes: 15
files:
  - path: main.js
    starter: starter/main.js
  - path: package.json
    starter: starter/package.json
goal: "Read a real package.json off disk and report what npm would do with it — scripts, dependency counts, and which versions are pinned exactly versus floating on a caret — every value computed from the parsed file."
docs: [javascript/npm-basics, javascript/objects, javascript/arrays]
checks:
  - id: classifier-works
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: manifest-report
    type: stdout
    entry: main.js
    match: exact
    value: "linkdrop v1.4.2\nscripts: build, dev, test\n3 deps + 2 dev deps\npinned: commander\nfloating: chalk, eslint, vitest, zod\n"
  - id: computed-from-the-manifest
    type: ai-judge
    rubric: "package.json is read with readFileSync and JSON.parse — its contents are never pasted into main.js. The report is computed: name and version interpolated from the parsed object; the script names from Object.keys(pkg.scripts) sorted alphabetically; both counts from Object.keys(...).length over dependencies and devDependencies. classifyDeps takes a plain deps object and splits it into { pinned, floating } by whether the version string starts with \"^\" (or \"~\"), returning sorted name arrays — and the printed pinned/floating lines come from calling it on the MERGED dependencies + devDependencies (spread or equivalent). None of the strings linkdrop, 1.4.2, commander, chalk, eslint, vitest, zod appear as literals in main.js."
hints:
  - "const pkg = JSON.parse(readFileSync(\"package.json\", \"utf8\")); — then `${pkg.name} v${pkg.version}` and Object.keys(pkg.scripts).sort().join(\", \")."
  - "classifyDeps(deps): loop Object.entries(deps); version.startsWith(\"^\") || version.startsWith(\"~\") sends the name to floating, anything else to pinned; sort both before returning."
  - "Merge for the last two lines: classifyDeps({ ...pkg.dependencies, ...pkg.devDependencies }) — dev tools float or pin by the same rules as runtime deps."
---
## The manifest

Every real JavaScript project has a `package.json` at its root — the
**manifest** npm reads before it does anything. Four fields carry most
of the weight:

- **`name` / `version`** — identity, semver-formatted:
  `major.minor.patch`.
- **`scripts`** — named commands. `npm run build` runs whatever the
  `build` script says; `npm test` and `npm start` are shorthands.
- **`dependencies`** — packages your code imports at runtime.
  `npm install zod` downloads it into `node_modules/` (never committed
  — it's rebuildable from the manifest) and records it here.
- **`devDependencies`** — tools for *building* the project: test
  runners, linters, bundlers. Installed with `npm i -D vitest`.

The subtle part is the version *ranges*. `"commander": "14.0.0"` is a
**pin** — exactly that build. `"chalk": "^5.6.0"` **floats**: the caret
accepts any `5.x.y` at or above `5.6.0`, on the semver promise that
minor and patch releases don't break you. (A tilde `~` floats patch
versions only.) Floating gets you bug fixes for free; it also means two
`npm install`s a month apart can produce different code — which is why
npm writes `package-lock.json`, freezing the exact versions it chose so
teammates and CI install *those*. Commit the lockfile.

npm itself needs the network, so today's program does what npm does
first instead: **read the manifest**. Your lesson folder has a real
`package.json`; last lesson's `readFileSync` plus `JSON.parse` turns it
into an object, and everything you print is computed from it — change a
version in the file, rerun, watch the report follow.

### Your goal

1. Parse `package.json`.
2. `classifyDeps(deps)` — split one deps object into
   `{ pinned, floating }` (caret/tilde floats, bare versions pin), both
   alphabetical.
3. Print the report — scripts alphabetical, counts computed, the last
   two lines from classifying `dependencies` and `devDependencies`
   merged:

```
linkdrop v1.4.2
scripts: build, dev, test
3 deps + 2 dev deps
pinned: commander
floating: chalk, eslint, vitest, zod
```
