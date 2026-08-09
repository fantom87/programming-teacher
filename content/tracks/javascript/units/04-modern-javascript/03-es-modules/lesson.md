---
id: 03-es-modules
title: ES Modules
language: javascript
runner: local
estMinutes: 20
files:
  - path: main.js
    starter: starter/main.js
  - path: stats.js
    starter: starter/stats.js
goal: "Build stats.js — named exports mean and median plus a default-exported summarize that calls them — and a main.js that imports all three in one line to print the report."
docs: [javascript/modules]
checks:
  - id: stats-functions-work
    type: tests
    entry: stats.js
    testFile: tests/test_stats.js
  - id: report-is-right
    type: stdout
    entry: main.js
    match: exact
    value: "mean: 46\nmedian: 47\n5 runs — mean 46, median 47\n"
  - id: designed-like-modules
    type: ai-judge
    rubric: "stats.js owns all the computation: mean and median are genuine named exports (mean totals the array and divides by length; median sorts a COPY of the input with a numeric compare callback — the caller's array is never mutated), and summarize is the file's default export, building its string by CALLING mean and median rather than re-deriving them. main.js imports the default and both named functions in a single import statement from \"./stats.js\" and contains no arithmetic of its own — every printed number arrives through an import, and no literal 46 or 47 appears in either file."
hints:
  - "export function mean(numbers) { ... } — the word export in front is the whole trick. Total the list with reduce or a loop, then divide by numbers.length."
  - "median: const sorted = [...numbers].sort((a, b) => a - b); return sorted[Math.floor(sorted.length / 2)]; — the spread makes the copy, the callback makes the sort numeric."
  - "main.js line one: import summarize, { mean, median } from \"./stats.js\"; — default import outside the braces, named imports inside."
---
## One job per file

Until now, every JavaScript lesson lived in one file. Real projects
don't — they're dozens of files, each with one job, sharing code through
**ES modules**: `export` marks what a file offers, `import` pulls it in.
And because modules are real files finding each other on disk, this
lesson runs on the **real Node on your machine**.

`stats.js` is your library. Making a function public takes one keyword:

```js
export function mean(numbers) { ... }
```

A file can have as many **named exports** as it likes — plus at most one
**default export**, its headline act:

```js
export default function summarize(numbers) { ... }
```

`main.js` is the program. Named imports travel in braces and must match
their export names exactly; the default import goes outside the braces,
and *you* pick its name:

```js
import summarize, { mean, median } from "./stats.js";
```

The `./` matters — it means "same folder, my file." Bare names like
`"react"` are reserved for installed packages; that story comes in the
Node unit.

Two design notes as you build the library:

- `median` must **sort a copy** — `[...numbers].sort((a, b) => a - b)` —
  lesson 1's spread, back already. `.sort` mutates, and quietly
  reordering your caller's array is a classic bug; a test will catch it.
  The middle of the sorted copy is `sorted[Math.floor(sorted.length / 2)]`
  (odd-length input only for this lesson).
- `summarize` should *call* `mean` and `median`, not re-derive them —
  inside their home module, your exports are just neighbors.

Meanwhile `main.js` computes nothing. Every number it prints crosses the
file boundary through an import — which is the moment this lesson
exists to teach.

### Your goal

1. `stats.js` — named exports `mean(numbers)` and `median(numbers)`,
   plus a default-exported `summarize(numbers)` that returns
   `` `${numbers.length} runs — mean M, median D` `` by calling the
   other two.
2. `main.js` — one import line, then print the three-line report on the
   starter's `RUN_TIMES`:

```
mean: 46
median: 47
5 runs — mean 46, median 47
```
