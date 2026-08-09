---
id: 09-capstone-typed-shelf-cli
title: "Capstone: Typed Shelf CLI"
language: javascript
runner: local
estMinutes: 35
files:
  - path: main.ts
    starter: starter/main.ts
goal: "Ship the Advanced capstone: a typed Node CLI for a reading shelf — parseCommand turns argv arrays into a discriminated Command union, a pure execute engine applies them immutably, run() is the printing shell, and a self-test suite proves the whole machine."
docs: [javascript/typescript-basics, javascript/arrays, javascript/objects]
checks:
  - id: session-highlights
    type: stdout
    entry: main.ts
    match: contains
    value: "finished #1: Deep Work"
  - id: self-tests-green
    type: stdout
    entry: main.ts
    match: contains
    value: "self-test: 6 passed, 0 failed"
  - id: whole-session-exact
    type: stdout
    entry: main.ts
    match: exact
    value: "$ shelf add Deep Work\nadded #1: Deep Work\n$ shelf add Refactoring\nadded #2: Refactoring\n$ shelf done 1\nfinished #1: Deep Work\n$ shelf list\n[x] #1 Deep Work\n[ ] #2 Refactoring\n$ shelf stats\nbooks: 2 | finished: 1\n\nself-test: 6 passed, 0 failed\n"
  - id: typed-tested-engine
    type: ai-judge
    rubric: "Book is an interface (id number, title string, done boolean) and Command a discriminated union tagged by kind with exactly add/done/list/stats members — add carrying title, done carrying id. parseCommand(argv: string[]): Command destructures the argv ARRAY (never process.argv), joins rest words into add's title, converts done's id with Number and validates it (Number.isInteger or equivalent), and THROWS on missing titles and unknown commands. execute(shelf, command) is pure and immutable — switch on command.kind, add computes next id from existing ids (max+1, no counter variable), done maps to a new array spreading the flipped book, list/stats derive lines from the data, and the default branch assigns command to a never-typed binding. execute returns new state plus lines; ONLY run() calls console.log, echoes '$ shelf ...' from the argv, and catches thrown errors to print error + usage instead of crashing. The self-tests are genuine: a check helper comparing actual vs expected (JSON.stringify or deep equality) that COUNTS passes and failures, at least six checks covering parse add/done, execute add/done/stats, and that unknown commands throw (try/catch), with the summary line printed from the two counters — not a hardcoded string. The demo session drives run() with explicit argv arrays, threading the returned shelf. No any anywhere."
hints:
  - "Parse first, decide later: parseCommand returns data, never acts. case \"add\": const title = rest.join(\" \"); if (title === \"\") throw new Error(\"add needs a title\"); return { kind: \"add\", title }; — and default: throw new Error(`unknown command: ${name ?? \"(none)\"}`);"
  - "execute mirrors your task-board engine: add computes nextId = shelf.reduce((max, b) => Math.max(max, b.id), 0) + 1; done maps with { ...book, done: true }; stats counts with filter().length; and the default branch is the never net — return { shelf: newShelf, lines: [...] } from every case."
  - "run() owns all printing and all failure: console.log(`$ shelf ${argv.join(\" \")}`); then try { ...execute, print lines, return new shelf } catch (err) { print `error: ...` and the usage line, return the shelf unchanged }. The self-tests are one check(name, actual, expected) helper bumping passed/failed counters, six calls, and a summary printed from the counters."
---
## Everything, welded together

This is the Advanced capstone, and it's the shape of every real CLI
you'll ship: **parse → decide → execute → print**, with types welding
the joints and tests proving the welds. Every part is something this
unit or its neighbors taught — discriminated unions with a `never` net,
argv-at-the-edge from your Node lessons, the pure-core/printing-shell
architecture from two lessons ago, and a test suite because untested
tools are rumors.

The engine never touches `process.argv` — `run(argv, shelf)` takes the
array explicitly, which is exactly what makes the tool testable and
gradeable. (A real deployment would end with
`run(process.argv.slice(2), shelf)`; the starter notes where.)

### Your goal

Four parts. Build and run them in order.

**Part 1 — the types.** `interface Book` (`id: number`,
`title: string`, `done: boolean`) and a `Command` union tagged by
`kind`: `add` (with `title`), `done` (with `id`), `list`, `stats`.

**Part 2 — `parseCommand(argv: string[]): Command`.** Destructure
`[name, ...rest]`. `add` joins `rest` into a title (empty → throw);
`done` converts `rest[0]` with `Number` and validates it; unknown or
missing commands throw. Parsing returns *data* — no printing, no state.

**Part 3 — the engine and shell.**
`execute(shelf: Book[], command: Command): { shelf: Book[]; lines: string[] }`
— pure, immutable, exhaustive (`never` net in `default`): `add`
appends with computed next id, `done` flips via `map` + spread, `list`
renders `[x]`/`[ ]` lines, `stats` computes
`books: N | finished: M`. Then `run(argv, shelf)` — the only printer:
echo `$ shelf <argv>`, execute, print the lines, return the new shelf;
caught errors print `error: <message>` plus a usage line.

**Part 4 — the proof.** A `check(name, actual, expected)` helper with
`passed`/`failed` counters, six checks (parse add, parse done, execute
add, done immutability, stats, unknown-command throw), and a computed
summary. Then the demo session, threading state through `run`:

```
$ shelf add Deep Work
added #1: Deep Work
$ shelf add Refactoring
added #2: Refactoring
$ shelf done 1
finished #1: Deep Work
$ shelf list
[x] #1 Deep Work
[ ] #2 Refactoring
$ shelf stats
books: 2 | finished: 1

self-test: 6 passed, 0 failed
```

Green means you've shipped a tested, typed Node CLI — the Advanced
tier, complete.
