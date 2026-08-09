---
id: 01-the-node-runtime
title: The Node Runtime
language: javascript
runner: local
estMinutes: 15
files:
  - path: main.js
    starter: starter/main.js
goal: "Meet JavaScript outside the browser: detect the runtime from its globals, read process.argv and process.version, and put all argument logic in a function that takes a plain array."
docs: [javascript/npm-basics, javascript/arrays, javascript/strings]
checks:
  - id: report-lines
    type: stdout
    entry: main.js
    match: contains
    value: "runtime: node\nargs: none"
  - id: version-line
    type: stdout
    entry: main.js
    match: regex
    value: "node v\\d+\\.\\d+\\.\\d+"
  - id: functions-work
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: argv-at-the-edge
    type: ai-judge
    rubric: "detectRuntime decides via typeof checks on globals (typeof window and/or typeof process) — not try/catch, not hardcoded — and returns \"node\" or \"browser\". describeArgs takes a plain array parameter and never touches process itself: [] yields \"args: none\", otherwise `args (N): a, b` with the count from .length and the list from .join(\", \"). process.argv appears exactly once, in the top-level call describeArgs(process.argv.slice(2)), and the version line interpolates process.version rather than a pasted version string."
hints:
  - "detectRuntime: return typeof window === \"undefined\" ? \"node\" : \"browser\"; — typeof is the one operator that can safely mention a name that doesn't exist."
  - "describeArgs(args): if (args.length === 0) return \"args: none\"; return `args (${args.length}): ${args.join(\", \")}`; — no process in here, ever."
  - "The three prints: `runtime: ${detectRuntime()}`, then describeArgs(process.argv.slice(2)), then `node ${process.version}` — slice(2) skips the node binary and the script path."
---
## Same language, second home

Five units of browser JavaScript, one of TypeScript — and this whole
time your code has had a second home: **Node**, the runtime that runs JS
on servers, in build tools, and in every `npx` command you'll ever type.
Same language, different globals. There is no `window`, no `document`,
no DOM. In their place: `process`, the file system, real paths. (One
global spans both worlds: `globalThis`.)

How do you *ask* which world you're in? Carefully — mentioning an
undefined name normally throws. `typeof` is the exception:

```js
typeof window === "undefined"   // true in Node, false in a browser
```

The star of today is **`process`** — Node's window onto the outside.
`process.version` tells you which Node you're on. `process.argv` is how
command-line arguments arrive, and its shape surprises everyone once:

```js
node main.js deploy --fast
// process.argv[0] → the node binary's path
// process.argv[1] → main.js's path
// process.argv[2] → "deploy"   ← yours start here
```

Hence the idiom you'll see in every CLI ever written:
`process.argv.slice(2)`.

And here's the professional move, the same one your typed task board
made when it took actions instead of clicks: **touch `process` once, at
the edge**. `describeArgs(args)` takes a plain array — so tests can feed
it `["deploy", "--fast"]` without launching anything, and the function
would work in a browser that has no `process` at all. Our checks do
exactly that: the test file calls your function directly with arrays the
command line never saw.

### Your goal

1. `detectRuntime()` — returns `"node"` or `"browser"`, decided by
   `typeof` checks on globals.
2. `describeArgs(args)` — `[]` gives `"args: none"`; otherwise
   `` `args (${count}): ${list}` `` with the list comma-joined, e.g.
   `args (2): deploy, --fast`.
3. Three top-level prints — runtime, the real
   `describeArgs(process.argv.slice(2))`, and `` `node ${process.version}` ``:

```
runtime: node
args: none
node v24.16.0
```

(Your last line shows *your* Node's version — the check only insists it
looks like one.)
