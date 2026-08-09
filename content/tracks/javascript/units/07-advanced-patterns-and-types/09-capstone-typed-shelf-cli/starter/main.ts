// The Advanced capstone: a typed, tested reading-shelf CLI.
// parse -> decide -> execute -> print, with argv passed explicitly.

// ---- Part 1: the types ----
// interface Book — id: number, title: string, done: boolean.
// type Command — a discriminated union tagged by kind:
//   { kind: "add"; title: string } | { kind: "done"; id: number }
//   | { kind: "list" } | { kind: "stats" }

// ---- Part 2: parseCommand(argv: string[]): Command ----
// const [name, ...rest] = argv;
//   "add"   -> title = rest.join(" "); empty title throws
//   "done"  -> id = Number(rest[0]); non-integer throws
//   "list" / "stats" -> plain commands
//   anything else -> throw new Error(`unknown command: ...`)
// Parsing returns DATA. No printing, no shelf.

// ---- Part 3: the engine and the shell ----
// execute(shelf: Book[], command: Command): { shelf: Book[]; lines: string[] }
//   add   -> next id = max existing id + 1; spread-append; "added #N: title"
//   done  -> map with { ...book, done: true }; "finished #N: title"
//            (unknown id: return the shelf unchanged with a "no book #N" line)
//   list  -> one "[x] #N title" or "[ ] #N title" per book
//   stats -> `books: ${total} | finished: ${count}` — both computed
//   default -> const impossible: never = command; throw
//
// run(argv: string[], shelf: Book[]): Book[] — the ONLY printer:
//   echo `$ shelf ${argv.join(" ")}`, then try/catch around
//   parse + execute: print the lines and return the new shelf, or print
//   `error: ${message}` and
//   "usage: shelf add <title> | done <id> | list | stats"

// ---- Part 4: the proof ----
// let passed = 0; let failed = 0;
// check(name: string, actual: unknown, expected: unknown) — compare via
// JSON.stringify, bump a counter, log FAIL lines with the diff.
// runTests(): six checks — parse add joins words, parse done converts,
// execute add ids from 1, done flips immutably, stats computes,
// unknown command throws (try/catch). Then print
// `self-test: ${passed} passed, ${failed} failed`.

// ---- The demo session (a real CLI would instead end with
// run(process.argv.slice(2), loadShelf()) — argv stays at the edge) ----
// let shelf: Book[] = [];
// shelf = run(["add", "Deep", "Work"], shelf);
// shelf = run(["add", "Refactoring"], shelf);
// shelf = run(["done", "1"], shelf);
// shelf = run(["list"], shelf);
// shelf = run(["stats"], shelf);
// console.log("");
// runTests();
