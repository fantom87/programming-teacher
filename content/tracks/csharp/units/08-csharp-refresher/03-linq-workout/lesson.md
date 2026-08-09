---
id: 03-linq-workout
title: LINQ Workout
language: csharp
runner: local
estMinutes: 18
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Nine exact lines, each answered by one chained LINQ expression: Where/OrderBy/Select with string.Join, Average, Any/All, an ordered GroupBy with per-group aggregation, Take, and First with a predicate."
docs: [csharp/linq-basics, csharp/collections]
checks:
  - id: workout-output
    type: stdout
    entry: Program.cs
    match: exact
    value: "stars: Iris, Max, Ada\navg points: 20.3\nany 10+ assists: True\nall above 10: False\nred: 64 pts, 3 players\nblue: 58 pts, 3 players\nBo 11\nLee 9\nfirst: Kim\n"
  - id: pure-linq
    type: ai-judge
    rubric: "Every answer is produced by LINQ operators chained off players — no manual accumulator loops, no mutation of intermediate state; foreach appears only to print already-computed sequences. Specifically: stars combines Where, OrderByDescending, and Select inside string.Join; the average uses Average with :F1 formatting; the two booleans come straight from Any and All with predicates; the team lines iterate players.GroupBy(p => p.Team) ordered by each group's Sum of points descending, printing the group Key with per-group Sum and Count; the assist lines use OrderByDescending plus Take(2); the last line uses First with a compound predicate. None of the printed values (Iris/Max/Ada order, 20.3, 64, 58, Bo, Lee, Kim) appear as literals in output strings."
hints:
  - "stars is one expression inside the join: string.Join(\", \", players.Where(p => p.Points >= 20).OrderByDescending(p => p.Points).Select(p => p.Name))"
  - "Groups aggregate like any sequence: players.GroupBy(p => p.Team).OrderByDescending(g => g.Sum(p => p.Points)) — in the loop, g.Key names the team while g.Sum(...) and g.Count() crunch its members."
  - "Booleans interpolate capitalized — $\"...{players.Any(p => p.Assists >= 10)}\" prints True. First takes the predicate directly: players.First(p => p.Team == \"blue\" && p.Assists < 5)."
---
## The workout

LINQ is the C# you actually write all day, so this drill is pure reps:
seven questions, seven chains, zero manual loops. The rules of the gym:

- **Chain, don't accumulate.** Every answer is one expression off
  `players`. `foreach` may print results; it may not compute them.
- **Operators recap** — `Where` filters, `Select` projects,
  `OrderByDescending` ranks, `Take` slices, `Average`/`Sum`/`Count`
  collapse, `Any`/`All` answer yes/no questions, `First(predicate)`
  grabs one match, and `GroupBy` buckets — after which *every operator
  above works per bucket*.
- **Groups are sequences with a `.Key`** — order the groups themselves
  by an aggregate (`OrderByDescending(g => g.Sum(...))`) like anything
  else.
- `string.Join(", ", sequence)` turns a projected sequence into one
  line — no trailing-comma bookkeeping.

The roster is six players on two teams; every number in the expected
output must fall out of the chains.

### Your goal

Produce exactly:

```
stars: Iris, Max, Ada
avg points: 20.3
any 10+ assists: True
all above 10: False
red: 64 pts, 3 players
blue: 58 pts, 3 players
Bo 11
Lee 9
first: Kim
```

1. Stars: names with 20+ points, highest first, joined with `", "`.
2. Average points, `:F1`.
3. `Any` player with 10+ assists; `All` players above 10 points.
4. `GroupBy` team, groups ordered by total points descending —
   `<team>: <sum> pts, <count> players`.
5. Top two by assists — `<name> <assists>`.
6. `First` blue player with fewer than 5 assists.
