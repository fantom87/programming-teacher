---
id: 07-module-architecture
title: Module Architecture
language: javascript
runner: local
estMinutes: 25
files:
  - path: main.js
    starter: starter/main.js
  - path: report.js
    starter: starter/report.js
  - path: crates.js
    starter: starter/crates.js
goal: "Build a three-layer module design with one-way imports: a pure crates.js core that imports nothing, a report.js that turns core data into strings, and a main.js shell — the only file allowed to print."
docs: [javascript/modules, javascript/functions-and-closures, javascript/arrays]
checks:
  - id: core-is-pure
    type: tests
    entry: crates.js
    testFile: tests/test_crates.js
  - id: shell-output
    type: stdout
    entry: main.js
    match: exact
    value: "3 records, 130 minutes\nlongest: Aurora Suite\n"
  - id: one-way-imports
    type: ai-judge
    rubric: "The dependency arrows point one way: crates.js has ZERO import statements and ZERO console calls — pure exported functions where addRecord returns a NEW array via spread (no push on the parameter), totalMinutes reduces, and longest picks the record with the most minutes. report.js imports ONLY from ./crates.js, never touches console, and its crateReport RETURNS an array of strings whose numbers all come from calling the core functions — no arithmetic re-derived locally and no literal 130 or 3 anywhere. main.js is the sole file containing console.log: it assembles the crate through addRecord calls and prints crateReport's lines in a loop. Any import of report.js from crates.js, any printing outside main.js, or any computation living in the shell breaks the architecture and fails."
hints:
  - "Core first, and keep it silent: export function addRecord(crate, title, minutes) { return [...crate, { title, minutes }]; } — a new array out, nothing logged, nothing imported."
  - "The middle layer speaks in strings, not side effects: crateReport builds [`${crate.length} records, ${totalMinutes(crate)} minutes`, `longest: ${longest(crate).title}`] and RETURNS it — printing is above its pay grade."
  - "longest without mutation: crate.reduce((best, record) => (record.minutes > best.minutes ? record : best)) — and the shell stays dumb: build the crate, loop crateReport's lines through console.log."
---
## Arrows point one way

You know how to split code into modules. Architecture is deciding
**which module may import which** — and it's the difference between a
codebase that grows and one that congeals. This lesson builds the
layered shape you'll meet in every serious project:

```
main.js  ──imports──▶  report.js  ──imports──▶  crates.js
(shell: prints)        (formatting)             (core: pure data logic)
```

Three rules give the shape its power:

**The core imports nothing and prints nothing.** `crates.js` knows how
to add a record to a crate, total the minutes, find the longest album —
as pure functions: data in, new data out, no `console`, no awareness
that screens exist. Pure core is why our `tests` check can grade it in
isolation, and why the same file would drop unchanged into a browser
app, a CLI, or a server.

**The middle layer turns data into strings — and returns them.** In
`report.js`, `crateReport(crate)` produces lines by *calling the core*,
computing nothing of its own. Returning strings instead of printing
them sounds pedantic; it's what makes the layer testable and reusable
(tomorrow those lines go into a DOM node instead of a terminal).

**Only the shell touches the world.** `main.js` builds the crate,
calls `crateReport`, and loops the result through `console.log`. It
contains zero arithmetic. All the I/O gathered in one thin, boring
file at the top — the pattern goes by "functional core, imperative
shell", and your Node CLI capstone is built on it.

The arrows never reverse: if `crates.js` ever imports from `report.js`,
the core now knows about formatting, and the whole stack fuses into a
circle. The AI reviewer will be checking the direction of every arrow.

### Your goal

1. `crates.js` — pure, import-free: `addRecord(crate, title, minutes)`
   (spread, never push), `totalMinutes(crate)`, `longest(crate)`.
2. `report.js` — imports only the core; `crateReport(crate)` returns
   the two lines below as an array of strings.
3. `main.js` — the only printer: add *Blue in Green* (37),
   *Aurora Suite* (52), *Night Drive* (41), then log each report line:

```
3 records, 130 minutes
longest: Aurora Suite
```
