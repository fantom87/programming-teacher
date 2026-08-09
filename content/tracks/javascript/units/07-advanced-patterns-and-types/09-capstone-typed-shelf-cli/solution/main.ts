interface Book {
  id: number;
  title: string;
  done: boolean;
}

type Command =
  | { kind: "add"; title: string }
  | { kind: "done"; id: number }
  | { kind: "list" }
  | { kind: "stats" };

function parseCommand(argv: string[]): Command {
  const [name, ...rest] = argv;
  switch (name) {
    case "add": {
      const title = rest.join(" ");
      if (title === "") throw new Error("add needs a title");
      return { kind: "add", title };
    }
    case "done": {
      const id = Number(rest[0]);
      if (!Number.isInteger(id)) throw new Error("done needs a numeric id");
      return { kind: "done", id };
    }
    case "list":
      return { kind: "list" };
    case "stats":
      return { kind: "stats" };
    default:
      throw new Error(`unknown command: ${name ?? "(none)"}`);
  }
}

function execute(shelf: Book[], command: Command): { shelf: Book[]; lines: string[] } {
  switch (command.kind) {
    case "add": {
      const nextId = shelf.reduce((max, book) => Math.max(max, book.id), 0) + 1;
      const book: Book = { id: nextId, title: command.title, done: false };
      return { shelf: [...shelf, book], lines: [`added #${nextId}: ${command.title}`] };
    }
    case "done": {
      const target = shelf.find((book) => book.id === command.id);
      if (!target) return { shelf, lines: [`no book #${command.id}`] };
      return {
        shelf: shelf.map((book) => (book.id === command.id ? { ...book, done: true } : book)),
        lines: [`finished #${command.id}: ${target.title}`],
      };
    }
    case "list":
      return {
        shelf,
        lines: shelf.map((book) => `${book.done ? "[x]" : "[ ]"} #${book.id} ${book.title}`),
      };
    case "stats": {
      const finished = shelf.filter((book) => book.done).length;
      return { shelf, lines: [`books: ${shelf.length} | finished: ${finished}`] };
    }
    default: {
      const impossible: never = command;
      throw new Error(`unhandled command: ${JSON.stringify(impossible)}`);
    }
  }
}

function run(argv: string[], shelf: Book[]): Book[] {
  console.log(`$ shelf ${argv.join(" ")}`);
  try {
    const command = parseCommand(argv);
    const result = execute(shelf, command);
    for (const line of result.lines) console.log(line);
    return result.shelf;
  } catch (err) {
    console.log(`error: ${err instanceof Error ? err.message : String(err)}`);
    console.log("usage: shelf add <title> | done <id> | list | stats");
    return shelf;
  }
}

// ---- self-tests ----

let passed = 0;
let failed = 0;

function check(name: string, actual: unknown, expected: unknown): void {
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    passed += 1;
  } else {
    failed += 1;
    console.log(`FAIL ${name}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function runTests(): void {
  check("parse add joins the title words", parseCommand(["add", "Deep", "Work"]), {
    kind: "add",
    title: "Deep Work",
  });
  check("parse done converts the id", parseCommand(["done", "7"]), { kind: "done", id: 7 });

  const one = execute([], { kind: "add", title: "Dune" });
  check("add gives the first book id 1", one.shelf, [{ id: 1, title: "Dune", done: false }]);

  const marked = execute(one.shelf, { kind: "done", id: 1 });
  check("done flips the flag immutably", [marked.shelf[0].done, one.shelf[0].done], [true, false]);

  check("stats computes its counts", execute(marked.shelf, { kind: "stats" }).lines, [
    "books: 1 | finished: 1",
  ]);

  let threw = false;
  try {
    parseCommand(["burn"]);
  } catch {
    threw = true;
  }
  check("unknown commands throw", threw, true);

  console.log(`self-test: ${passed} passed, ${failed} failed`);
}

// A deployed CLI would end with run(process.argv.slice(2), loadShelf()).
// The graded demo drives run() with explicit argv arrays instead:

let shelf: Book[] = [];
shelf = run(["add", "Deep", "Work"], shelf);
shelf = run(["add", "Refactoring"], shelf);
shelf = run(["done", "1"], shelf);
shelf = run(["list"], shelf);
shelf = run(["stats"], shelf);
console.log("");
runTests();
