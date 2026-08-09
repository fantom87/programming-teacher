---
id: 01-spec-and-architecture
title: "Capstone 1: Spec and Domain"
language: csharp
runner: local
estMinutes: 28
timeoutMs: 90000
files:
  - path: Domain.cs
    starter: starter/Domain.cs
  - path: Program.cs
    starter: starter/Program.cs
goal: "Open the four-session capstone by writing TaskFlow's domain layer: a TaskStore that guards its list behind IReadOnlyList and answers Count, DoneCount and OpenCount as computed properties, with Program.cs doing all the printing."
docs: [csharp/classes-and-objects, csharp/collections]
checks:
  - id: counts-line
    type: stdout
    entry: Program.cs
    match: contains
    value: "5 tasks: 2 done, 3 open"
  - id: backlog-render
    type: stdout
    entry: Program.cs
    match: contains
    value: "[ ] 3 Build the domain (code/High)"
  - id: full-report
    type: stdout
    entry: Program.cs
    match: exact
    value: "== TaskFlow v0.1 ==\n5 tasks: 2 done, 3 open\n\n-- Backlog --\n[x] 1 Draft the spec (planning/High)\n[x] 2 Sketch the layers (planning/Medium)\n[ ] 3 Build the domain (code/High)\n[ ] 4 Wire persistence (code/Medium)\n[ ] 5 Polish the UX (code/Low)\n"
  - id: domain-is-a-domain
    type: ai-judge
    rubric: "Domain.cs contains a TaskStore class with a private readonly List<TaskItem> field assigned from the constructor parameter, exposed only as `public IReadOnlyList<TaskItem> All` — there is no public List<TaskItem> property, no setter, and no method returning the mutable list. Count, DoneCount and OpenCount are computed properties (expression-bodied, using tasks.Count / LINQ Count with a predicate), not int fields updated by hand. Domain.cs contains no Console call of any kind, and Program.cs contains no arithmetic on the seed — the numbers 5, 2 and 3 are read from the store's properties, never typed into the output strings. The backlog line is produced by a Render(TaskItem) helper in Program.cs, and the seed data in SeedData.Tasks() is unchanged."
hints:
  - "Field and constructor first: private readonly List<TaskItem> tasks; then public TaskStore(List<TaskItem> seed) => tasks = seed;. Build once before adding anything else."
  - "Expose without handing over: public IReadOnlyList<TaskItem> All => tasks; — a List<T> already implements IReadOnlyList<T>, so nothing is copied and callers simply never see Add."
  - "Counts are one line each: public int DoneCount => tasks.Count(t => t.Done); and OpenCount is the same with !t.Done. Render is also one line: $\"[{(t.Done ? 'x' : ' ')}] {t.Id} {t.Title} ({t.Category}/{t.Priority})\" — the enum prints its own name."
---
## Four sessions, one app

Everything this track taught you now goes into a single program, built
across four sessions: **TaskFlow**, a console task manager that
remembers its tasks between runs. Today, the spec and the domain. Then
commands, then JSON persistence, then polish and a report.

The spec fits in a breath — and writing it down first is the point, because
you can't architect a thing you can't describe:

> TaskFlow holds a list of tasks, each with an id, title, category,
> priority and a done flag. It can add, complete and drop them, saves to
> `tasks.json`, and prints a status report.

Now the architecture, which is today's one idea: **the domain owns the
data, the presentation layer owns the Console.** `Domain.cs` never
prints; `Program.cs` never calculates. Two files, one seam — the same
seam that separates a class library from its UI in every real .NET
solution, and the reason you'll be able to test the domain later without
capturing output.

A seam is only real if the domain protects what's behind it. `TaskStore`
keeps `private readonly List<TaskItem> tasks`, so nothing outside can add
to it, clear it, or pass it somewhere that will. What callers get is
`IReadOnlyList<TaskItem> All` — look all you like, mutate nothing. The
list itself is handed over unchanged; the *type* is what removes `Add`
from view.

The counts follow the same instinct. Make them **computed properties**,
not fields:

```csharp
public int DoneCount => tasks.Count(t => t.Done);
```

A stored `doneCount` is a second source of truth, and second sources of
truth drift the first time someone forgets to update one. Recomputing
costs a microsecond and can never be stale.

### Your goal

Fill in `TaskStore`, then print exactly:

```
== TaskFlow v0.1 ==
5 tasks: 2 done, 3 open

-- Backlog --
[x] 1 Draft the spec (planning/High)
[x] 2 Sketch the layers (planning/Medium)
[ ] 3 Build the domain (code/High)
[ ] 4 Wire persistence (code/Medium)
[ ] 5 Polish the UX (code/Low)
```

Every number comes from the store. Nothing in `Domain.cs` prints.
