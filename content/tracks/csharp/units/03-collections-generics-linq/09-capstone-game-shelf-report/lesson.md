---
id: 09-capstone-game-shelf-report
title: "Capstone: Game Shelf Report"
language: csharp
runner: local
estMinutes: 35
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Build a data-driven report generator: turn a list of Game objects into a full console report — headline stats, a per-genre breakdown, and a sorted backlog section — where every number is computed with collections and LINQ."
docs: [csharp/linq-basics, csharp/collections, csharp/classes-and-objects]
checks:
  - id: report-header
    type: stdout
    entry: Program.cs
    match: contains
    value: "== Game Shelf Report =="
  - id: headline-counts
    type: stdout
    entry: Program.cs
    match: contains
    value: "6 games across 3 genres"
  - id: total-hours
    type: stdout
    entry: Program.cs
    match: contains
    value: "Total hours: 235"
  - id: average-rating
    type: stdout
    entry: Program.cs
    match: contains
    value: "Average rating: 9.2"
  - id: top-rated
    type: stdout
    entry: Program.cs
    match: contains
    value: "Top rated: Hollow Knight (9.6)"
  - id: genre-breakdown
    type: stdout
    entry: Program.cs
    match: contains
    value: "rpg: 2 games, 127 hours"
  - id: backlog-entry
    type: stdout
    entry: Program.cs
    match: contains
    value: "Dead Cells (6 hours)"
  - id: everything-computed
    type: ai-judge
    rubric: "Every statistic in the report is computed from the shelf list, not hardcoded: game count via Count, genre count via a HashSet or Distinct over genres, total hours via Sum, average rating via Average (formatted, not typed as 9.2), top-rated via OrderByDescending/First or an equivalent Max-based lookup, the per-genre lines by iterating GroupBy with each group's Key/Count()/Sum, and the barely-started section via a Where/OrderBy chain over the list. None of the literal numbers 6, 3, 235, 9.2, 9.6, 61, 47, 127 appear typed inside output strings, and no report line is a hand-written copy of expected output."
hints:
  - "Genre count: new HashSet<string>(shelf.Select(g => g.Genre)).Count — or shelf.Select(g => g.Genre).Distinct().Count()."
  - "Top rated: Game top = shelf.OrderByDescending(g => g.Rating).First(); then print top.Title and {top.Rating:F1}."
  - "The backlog is one pipeline — shelf.Where(g => g.Hours < 10).OrderBy(g => g.Hours) — then foreach-print $\"{g.Title} ({g.Hours} hours)\"."
---
## The report generator

This is the Core capstone: a real, data-driven console app. The starter hands
you a dataset — six `Game` objects on a shelf — and your job is to turn raw
data into a readable report, the way an analytics dashboard would. The rule
that makes it professional: **every number on screen is computed from the
data**. Swap in a different shelf tomorrow and the report should stay
correct without touching a line.

Everything you need is already in your hands: aggregation for the headline
stats, a `HashSet` (or `Distinct`) for counting genres, `GroupBy` for the
breakdown, and a `Where`/`OrderBy` pipeline for the backlog. The craft here
is composition — picking the right tool per line.

### Your goal

Produce this report (blank line between sections):

```
== Game Shelf Report ==
6 games across 3 genres
Total hours: 235
Average rating: 9.2
Top rated: Hollow Knight (9.6)

-- By genre --
platformer: 2 games, 61 hours
roguelike: 2 games, 47 hours
rpg: 2 games, 127 hours

-- Barely started (under 10 hours) --
Dead Cells (6 hours)
Undertale (7 hours)
Celeste (9 hours)
```

**Part 1 — headline stats.** The header line, then: how many games across
how many distinct genres (use a `HashSet` or `Distinct`); total hours
(`Sum`); average rating (`Average`, formatted `:F1`); and the top-rated
game — find it with `OrderByDescending` + `First`, printing its title and
rating (`:F1`).

**Part 2 — by genre.** `GroupBy` genre, one line per group with its `Key`,
game count, and summed hours. Groups appear in first-seen order, which
matches the expected output.

**Part 3 — barely started.** Games under 10 hours, sorted by hours
ascending, printed as `Title (N hours)`.

An AI reviewer will verify the numbers are computed, not typed. When it
passes, you've written the exact shape of a thousand real-world reporting
tools — congratulations, that's the Core tier done.
