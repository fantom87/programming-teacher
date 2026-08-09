---
id: 09-capstone-typed-task-board
title: "Capstone: Typed Task Board"
language: javascript
runner: local
estMinutes: 35
files:
  - path: main.ts
    starter: starter/main.ts
goal: "Build the fully typed engine of a browser app: a Task interface, a discriminated union of Actions, an immutable apply() with an exhaustiveness net, and a render() that prints two computed boards."
docs: [javascript/typescript-basics, javascript/arrays, javascript/objects]
checks:
  - id: board-mid-script
    type: stdout
    entry: main.ts
    match: contains
    value: "1 of 3 done"
  - id: board-final
    type: stdout
    entry: main.ts
    match: contains
    value: "2 of 2 done"
  - id: whole-run-exact
    type: stdout
    entry: main.ts
    match: exact
    value: "== Task Board ==\n[x] write types\n[ ] narrow unions\n[ ] ship the capstone\n1 of 3 done\n\n== Task Board ==\n[x] write types\n[x] ship the capstone\n2 of 2 done\n"
  - id: typed-engine
    type: ai-judge
    rubric: "Task is an interface (id number, title string, done boolean) and Action a discriminated union of exactly three members tagged by kind literals add/toggle/remove — add carries title, the others id. apply(tasks: Task[], action: Action): Task[] branches on action.kind (switch or if-chain) so each payload is only touched in its own branch, and its default/else assigns action to a never-typed binding as an exhaustiveness net. All three moves are immutable: add via spread with a computed next id (max/reduce over existing ids, not a mutating counter), toggle via map with {...task, done: !task.done}, remove via filter — no push/splice/direct assignment on tasks. render computes the [x]/[ ] marks and the N-of-M footer from the array (filter/count), nothing hardcoded. The scripts are annotated Action[], board is Task[], and no any appears."
hints:
  - "type Action = { kind: \"add\"; title: string } | { kind: \"toggle\"; id: number } | { kind: \"remove\"; id: number }; — inside switch (action.kind), each case knows its own payload: case \"add\" can read action.title."
  - "The three moves, immutably — add: [...tasks, { id: nextId, title: action.title, done: false }] with const nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1; toggle: tasks.map((t) => t.id === action.id ? { ...t, done: !t.done } : t); remove: tasks.filter((t) => t.id !== action.id)."
  - "Exhaustiveness net: default: { const impossible: never = action; throw new Error(\"unhandled action\"); } — then fold: let board: Task[] = []; for (const action of script1) board = apply(board, action); render(board); console.log(\"\"); then script2 and render again."
---
## The engine of a browser app

Your Core capstone was a todo widget — state, clicks, re-render. This
capstone rebuilds that machine the way professional TypeScript apps
actually structure it: a **typed engine with no DOM in it**. State, a
closed set of actions, one function that applies them, one that renders.
React and Redux apps are exactly this shape; wire yesterday's DOM code
on top and it's a browser app again. The engine stays testable anywhere
— which is why our runner can grade it.

The centerpiece is the **discriminated union** — the pattern this whole
unit was building toward:

```ts
type Action =
  | { kind: "add"; title: string }
  | { kind: "toggle"; id: number }
  | { kind: "remove"; id: number };
```

Every action carries a `kind` literal — the *discriminant*. Switch on it
and TypeScript narrows per case: inside `case "add"`, `action.title`
exists and `action.id` doesn't. Unions plus literal types plus narrowing,
all pulling together.

Then the safety net that makes teams love this pattern — the `default`
branch assigns the action to a `never`:

```ts
default: {
  const impossible: never = action;
  throw new Error("unhandled action");
}
```

If every kind is handled, `action` in `default` has type `never` and the
line type-checks. Add a fourth action next sprint and forget a case?
`action` still has a type left — not assignable to `never` — and `tsc`
points at this exact line. Exhaustiveness, enforced by the compiler.
(Our runner strips rather than checks, so here that net is for the AI
reviewer and your own editor — write it like it's load-bearing, because
in every real project it is.)

Two professional rules complete the engine: `apply` returns a **new
array** — spread, `map`, `filter`, never `push` — and `render` computes
everything it prints from the state it's given.

### Your goal

**Part 1 — the types.** `interface Task` (`id: number`, `title: string`,
`done: boolean`) and the three-way `Action` union above.

**Part 2 — `apply(tasks: Task[], action: Action): Task[]`.** `add`
appends via spread with a computed next id (max existing id + 1);
`toggle` maps, flipping `done` on the matching id; `remove` filters the
id out; the `default` is the `never` net.

**Part 3 — `render(tasks: Task[]): void`.** The header, one
`[x]`/`[ ]` line per task, then `N of M done` — both numbers computed.

**Part 4 — run the scripts.** Annotate the starter's scripts as
`Action[]`, fold `script1` through `apply` from an empty `Task[]`,
render, print one empty line, fold `script2`, render again:

```
== Task Board ==
[x] write types
[ ] narrow unions
[ ] ship the capstone
1 of 3 done

== Task Board ==
[x] write types
[x] ship the capstone
2 of 2 done
```
