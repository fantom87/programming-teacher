---
id: 02-commands-and-state
title: "Capstone 2: Commands and State"
language: csharp
runner: local
estMinutes: 32
timeoutMs: 90000
files:
  - path: Domain.cs
    starter: starter/Domain.cs
  - path: Commands.cs
    starter: starter/Commands.cs
  - path: Program.cs
    starter: starter/Program.cs
goal: "Give TaskFlow verbs: Add, Complete and Remove on the store (completing replaces the record with a `with` copy), a CommandRunner that turns a line of text into exactly one message, and a session log that shows the totals moving."
docs: [csharp/control-flow, csharp/methods]
checks:
  - id: completes-a-task
    type: stdout
    entry: Program.cs
    match: contains
    value: "> done 3\n  completed #3 Build the domain"
  - id: adds-a-task
    type: stdout
    entry: Program.cs
    match: contains
    value: "  added #6 Write the README (docs/Low)"
  - id: removes-a-task
    type: stdout
    entry: Program.cs
    match: contains
    value: "  removed #5 Polish the UX"
  - id: misses-are-messages
    type: stdout
    entry: Program.cs
    match: contains
    value: "  no task #42"
  - id: unknown-verb
    type: stdout
    entry: Program.cs
    match: contains
    value: "  unknown command: sync"
  - id: totals-moved
    type: stdout
    entry: Program.cs
    match: contains
    value: "5 tasks: 3 done, 2 open"
  - id: full-session
    type: stdout
    entry: Program.cs
    match: exact
    value: "== TaskFlow v0.2 ==\n5 tasks: 2 done, 3 open\n\n-- Session log --\n> done 3\n  completed #3 Build the domain\n> add docs Low Write the README\n  added #6 Write the README (docs/Low)\n> drop 5\n  removed #5 Polish the UX\n> done 42\n  no task #42\n> sync\n  unknown command: sync\n\n-- Backlog --\n[x] 1 Draft the spec (planning/High)\n[x] 2 Sketch the layers (planning/Medium)\n[x] 3 Build the domain (code/High)\n[ ] 4 Wire persistence (code/Medium)\n[ ] 6 Write the README (docs/Low)\n\n5 tasks: 3 done, 2 open\n"
  - id: state-changes-are-domain-work
    type: ai-judge
    rubric: "TaskStore gained a private int nextId initialised in the constructor from the seed (max Id + 1, guarded for an empty list) and never hardcoded to 6. Add appends a new TaskItem built with that id and returns it; Complete finds the task by id and REPLACES it via `tasks[index] = tasks[index] with { Done = true }` (the record is never mutated through a setter, and TaskItem stays a positional record); Remove takes it out of the list. Complete and Remove both return TaskItem? and return null on a miss, so the 'no task #42' wording is decided in Commands.cs, not in the domain. CommandRunner.Run splits the line with Split(' ', 4) and dispatches with a single switch expression over parts[0] whose discard arm produces the unknown-command message; each verb's work lives in its own small helper, no if/else chain. Domain.cs and Commands.cs contain no Console calls, and Program.cs computes both counts lines from the store rather than typing 2, 3 or 5 into strings."
hints:
  - "Complete can't edit a record — it swaps one in: int index = tasks.FindIndex(t => t.Id == id); if (index < 0) return null; tasks[index] = tasks[index] with { Done = true }; return tasks[index];"
  - "Run is pure dispatch: string[] parts = line.Split(' ', 4); return parts[0] switch { \"add\" => Add(store, parts), \"done\" => Finish(store, parts), \"drop\" => Drop(store, parts), _ => $\"unknown command: {parts[0]}\" };"
  - "The miss is a message, not a crash: TaskItem? done = store.Complete(id); return done is null ? $\"no task #{id}\" : $\"completed #{done.Id} {done.Title}\"; — and the log loop is two writes, \"> {line}\" then \"  {CommandRunner.Run(store, line)}\"."
---
## Verbs

A store you can only read is a report, not an app. Today TaskFlow gets
its three verbs — add, complete, drop — and today's one idea is *where
they live*: *state changes belong to the domain, wording belongs to the
command layer.*

So `TaskStore` grows three methods that change data and return facts:

```csharp
public TaskItem? Complete(int id)
```

Note the `?`. Ask to complete task 42 when there is no 42 and you get
`null` back — not an exception, not a printed apology. The domain
reports what happened; deciding that a miss reads `no task #42` is
someone else's job.

Completing is where records bite back. `TaskItem` is immutable, so you
can't flip `Done`. You *replace* the record with a changed copy and put
it back in the list:

```csharp
tasks[index] = tasks[index] with { Done = true };
```

The old value is untouched, the list now points at a new one — the same
`with` move you learned on transactions, doing real work.

Then `Commands.cs`, a new layer between text and domain. `Run` takes one
line — `"add docs Low Write the README"` — splits it into at most four
parts, and dispatches with a switch expression: `add`, `done`, `drop`,
and a discard arm for anything else. It returns a **message string**.
Nothing here prints; nothing here knows a Console exists. That's why the
same runner will happily serve a REPL, a test, or the scripted session
you're about to run.

### Your goal

Run the five scripted lines and print exactly:

```
== TaskFlow v0.2 ==
5 tasks: 2 done, 3 open

-- Session log --
> done 3
  completed #3 Build the domain
> add docs Low Write the README
  added #6 Write the README (docs/Low)
> drop 5
  removed #5 Polish the UX
> done 42
  no task #42
> sync
  unknown command: sync

-- Backlog --
[x] 1 Draft the spec (planning/High)
[x] 2 Sketch the layers (planning/Medium)
[x] 3 Build the domain (code/High)
[ ] 4 Wire persistence (code/Medium)
[ ] 6 Write the README (docs/Low)

5 tasks: 3 done, 2 open
```

The new task's id comes from the store, never from you.
