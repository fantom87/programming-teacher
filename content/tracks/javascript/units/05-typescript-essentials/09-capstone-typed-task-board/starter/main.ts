// The Core capstone's todo widget, reborn as a typed, DOM-free engine.
// State in, action in, new state out — the shape of every modern app.

// 1. interface Task — id: number, title: string, done: boolean.

// 2. type Action — a discriminated union tagged by `kind`:
//    { kind: "add"; title: string } | { kind: "toggle"; id: number }
//                                   | { kind: "remove"; id: number }

// 3. apply(tasks: Task[], action: Action): Task[] — switch on action.kind.
//    add    -> spread in { id: <max id + 1>, title, done: false }
//    toggle -> map, flipping done on the matching id
//    remove -> filter the id out
//    default -> const impossible: never = action;  (the exhaustiveness net)
//    Never mutate — every branch returns a NEW array.

// 4. render(tasks: Task[]): void — "== Task Board ==", one "[x] title" or
//    "[ ] title" line per task, then "N of M done" — computed, not counted
//    by hand.

const script1 = [
  { kind: "add", title: "write types" },
  { kind: "add", title: "narrow unions" },
  { kind: "add", title: "ship the capstone" },
  { kind: "toggle", id: 1 },
];

const script2 = [
  { kind: "remove", id: 2 },
  { kind: "toggle", id: 3 },
];

// 5. Annotate both scripts as Action[]. Then, from let board: Task[] = [],
//    fold script1 through apply, render, console.log(""), fold script2,
//    render again.
