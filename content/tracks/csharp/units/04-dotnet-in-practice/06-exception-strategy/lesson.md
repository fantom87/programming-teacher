---
id: 06-exception-strategy
title: An Exception Strategy
language: csharp
runner: local
estMinutes: 18
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
  - path: scores.txt
    starter: starter/scores.txt
goal: "Import scores.txt with a real exception strategy: int.Parse inside a small try, catch (FormatException) to skip the corrupt row by name, and a computed team-total line."
docs: [csharp/exceptions]
checks:
  - id: import-report
    type: stdout
    entry: Program.cs
    match: exact
    value: "Imported alice: 50\nSkipped bob: not a number\nImported carol: 75\nImported dave: 25\nTeam total: 150 (3 of 4 rows)\n"
  - id: specific-and-small
    type: ai-judge
    rubric: "The corrupt row is detected by catching FormatException around int.Parse — the catch clause names FormatException specifically (no catch (Exception), no bare catch) and there is no TryParse pre-check. The try block sits INSIDE the loop and wraps only the parse and the success bookkeeping, so good rows after the bad one still import. The catch reports the offending row's name taken from the data. Total, imported count, and row count in the final line are computed (150, 3, and 4 are never typed as literals)."
hints:
  - "Read rows with File.ReadAllLines(\"scores.txt\"), then Split(',') each row — parts[0] is the name, parts[1] the score text."
  - "Inside the loop: try { int score = int.Parse(parts[1]); total += score; imported++; ... } catch (FormatException) { Console.WriteLine($\"Skipped {name}: not a number\"); }"
  - "The closing line: $\"Team total: {total} ({imported} of {rows.Length} rows)\" — all three numbers computed, none typed."
---
## Catch what you expect, crash on what you don't

C#'s exception syntax will feel familiar — it's Python's `try`/`except`
with the names changed:

```csharp
try
{
    int score = int.Parse(text);
}
catch (FormatException)
{
    Console.WriteLine("that wasn't a number");
}
```

Syntax is the easy part. What separates professional code is **strategy**,
and it fits in three rules:

**Catch the specific type.** `catch (FormatException)` handles exactly one
story: the text wasn't a number. Writing `catch (Exception)` instead feels
safer but is the opposite — it also swallows `NullReferenceException` and
`IndexOutOfRangeException`, which are *bugs*, and relabels them "bad
input". Expected failures get caught by name; bugs should crash loudly
(next lesson leans into that).

**Keep the `try` small.** Wrap the one call that can legitimately fail, not
the whole loop body. A small blast radius means that when the catch fires,
you know exactly what threw — and one bad row can't take the rest of the
file down with it.

**Never swallow silently.** An empty catch block is where evidence goes to
die. Report, count, log — leave a trace.

Where's the line between "expected" and "bug"? Data from *outside* the
program — user input, files, networks — will eventually be malformed:
expected, plan for it. (For parsing specifically, C# also offers
`int.TryParse`, cousin of `TryGetValue`. It's often the better tool when a
pre-check exists — but plenty of failures have no pre-check, so the
try/catch shape you're practicing today generalizes further.)

Your program is an importer with exactly this shape: a scores file where
one row is corrupt. Import the good rows, skip the bad one *by name*, and
keep the tally — the file doesn't get to win.

### Your goal

Read `scores.txt` and print exactly:

```
Imported alice: 50
Skipped bob: not a number
Imported carol: 75
Imported dave: 25
Team total: 150 (3 of 4 rows)
```

1. `File.ReadAllLines`, then `Split(',')` each row into name and score text.
2. `int.Parse` inside a `try`; on success add to the total, count it, and
   print the `Imported` line.
3. `catch (FormatException)` prints the `Skipped` line — and the loop keeps
   going.
4. Close with the totals line — every number computed.
