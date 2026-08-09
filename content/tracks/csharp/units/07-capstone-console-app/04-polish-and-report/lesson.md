---
id: 04-polish-and-report
title: "Capstone 4: Polish and Report"
language: csharp
runner: local
estMinutes: 38
timeoutMs: 90000
files:
  - path: Commands.cs
    starter: starter/Commands.cs
  - path: Report.cs
    starter: starter/Report.cs
  - path: Program.cs
    starter: starter/Program.cs
  - path: Domain.cs
    starter: starter/Domain.cs
  - path: Storage.cs
    starter: starter/Storage.cs
goal: "Finish TaskFlow: harden the command parser with TryParse so junk input answers instead of crashing, add a Report layer that groups by category, names the next task and draws a progress bar, and cut the debug output."
docs: [csharp/linq-basics, csharp/methods]
checks:
  - id: bad-number-answers
    type: stdout
    entry: Program.cs
    match: contains
    value: "> done abc\n  not a number: abc"
  - id: bad-priority-answers
    type: stdout
    entry: Program.cs
    match: contains
    value: "  unknown priority: Urgent"
  - id: missing-arguments
    type: stdout
    entry: Program.cs
    match: contains
    value: "  usage: add <category> <priority> <title>"
  - id: category-breakdown
    type: stdout
    entry: Program.cs
    match: contains
    value: "by category:\n  code      1/2 done\n  docs      0/1 done\n  planning  2/2 done\n"
  - id: next-up
    type: stdout
    entry: Program.cs
    match: contains
    value: "next up: #4 Wire persistence (code/Medium)"
  - id: progress-bar
    type: stdout
    entry: Program.cs
    match: contains
    value: "progress: [######----] 60%"
  - id: full-session
    type: stdout
    entry: Program.cs
    match: exact
    value: "== TaskFlow v1.0 ==\n5 tasks: 2 done, 3 open\n\n-- Session log --\n> done 3\n  completed #3 Build the domain\n> add docs Low Write the README\n  added #6 Write the README (docs/Low)\n> drop 5\n  removed #5 Polish the UX\n> done 42\n  no task #42\n> sync\n  unknown command: sync\n> done abc\n  not a number: abc\n> add code Urgent Ship it\n  unknown priority: Urgent\n> add code\n  usage: add <category> <priority> <title>\n\n-- Saving --\nsaved 5 tasks to tasks.json\nloaded 5 tasks (3 done)\nround trip: identical\n\n-- Backlog --\n[x] 1 Draft the spec (planning/High)\n[x] 2 Sketch the layers (planning/Medium)\n[x] 3 Build the domain (code/High)\n[ ] 4 Wire persistence (code/Medium)\n[ ] 6 Write the README (docs/Low)\n\n-- Report --\nby category:\n  code      1/2 done\n  docs      0/1 done\n  planning  2/2 done\nnext up: #4 Wire persistence (code/Medium)\nprogress: [######----] 60%\n"
  - id: finished-not-just-working
    type: ai-judge
    rubric: "Commands.cs uses int.TryParse and Enum.TryParse (not int.Parse/Enum.Parse) and a parts.Length guard checked BEFORE indexing parts[1] or parts[3]; there is no try/catch anywhere in the file, and the store is never touched when input is rejected — 'add code Urgent Ship it' must not create a task, which is why the totals stay at 5 tasks, 3 done. Report.Lines returns a list of strings and calls no Console method; its category lines come from GroupBy(t => t.Category).OrderBy(g => g.Key) with counts from the groups, the column width from the longest category name via PadRight (not a hardcoded 8), 'next up' from a LINQ query over open tasks ordered by Priority descending then Id ascending with FirstOrDefault plus a null branch for an empty board, and the percentage and bar computed from DoneCount and Count (new string('#', ...) or equivalent) — the literals 60, 1/2, 0/1 and 2/2 never appear in the output strings. Program.cs no longer prints the '-- First task on disk --' peek, appends exactly the three junk lines to the script, and prints the report by looping over Report.Lines(reloaded)."
hints:
  - "TryParse returns the verdict and the value at once: if (!int.TryParse(parts[1], out int id)) return $\"not a number: {parts[1]}\"; — and the length guard has to come first, or parts[1] throws before your message ever runs."
  - "Group and pad: int width = store.All.Max(t => t.Category.Length); then per group $\"  {group.Key.PadRight(width)}  {group.Count(t => t.Done)}/{group.Count()} done\" — two spaces after the padded name."
  - "Next up is one query: store.All.Where(t => !t.Done).OrderByDescending(t => t.Priority).ThenBy(t => t.Id).FirstOrDefault() — enums order by their underlying value, so High wins. The bar: int filled = percent / 10; $\"[{new string('#', filled)}{new string('-', 10 - filled)}] {percent}%\"."
---
## Finishing

A program works when it does the thing. A program is *finished* when it
survives a user — and today's one idea is what that costs: **bad input is
an answer, not an exception.**

Your parser currently trusts every line it gets. `int.Parse("abc")`
throws; `parts[3]` on a two-word command throws; and a throw in a console
app is a stack trace in a stranger's face. The fix is the `TryParse`
pattern, which hands you the verdict and the value together:

```csharp
if (!int.TryParse(parts[1], out int id)) return $"not a number: {parts[1]}";
```

No `try`/`catch` — exceptions are for the genuinely exceptional, and a
typo isn't. Guard the argument count *before* you index, check the
priority *before* you touch the store, and every junk line becomes one
calm sentence in the log. Note what the guards also protect: a rejected
`add` must not leave a half-made task behind.

Then the last layer, `Report`. It takes the store and returns
`IReadOnlyList<string>` — finished lines, printed by nobody. That's the
same seam you drew in session one, held all the way to the end: a report
you can assert on in a test, without capturing a Console.

Inside it, LINQ earns its keep. `GroupBy` gives the per-category tallies;
`Max` over the category lengths gives the column width, so the table
stays aligned when someone adds a category called `infrastructure`; and
one ordered query — priority descending, id ascending — answers the only
question a task list exists to answer: *what should I do next?*

Finally, delete the raw-JSON peek. It taught you something in session
three and it's noise now. Knowing what to remove is part of the craft.

### Your goal

Produce exactly:

```
== TaskFlow v1.0 ==
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
> done abc
  not a number: abc
> add code Urgent Ship it
  unknown priority: Urgent
> add code
  usage: add <category> <priority> <title>

-- Saving --
saved 5 tasks to tasks.json
loaded 5 tasks (3 done)
round trip: identical

-- Backlog --
[x] 1 Draft the spec (planning/High)
[x] 2 Sketch the layers (planning/Medium)
[x] 3 Build the domain (code/High)
[ ] 4 Wire persistence (code/Medium)
[ ] 6 Write the README (docs/Low)

-- Report --
by category:
  code      1/2 done
  docs      0/1 done
  planning  2/2 done
next up: #4 Wire persistence (code/Medium)
progress: [######----] 60%
```

Five files, four layers, one app that remembers. That's the capstone —
and the C# track — done.
