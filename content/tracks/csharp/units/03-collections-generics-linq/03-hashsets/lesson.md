---
id: 03-hashsets
title: HashSets
language: csharp
runner: local
estMinutes: 12
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Count unique badge scans with a HashSet<string>: fill it from the scans array, print a computed summary line, two Contains checks, and what Add returns for a duplicate."
docs: [csharp/collections]
checks:
  - id: hashset-output
    type: stdout
    entry: Program.cs
    match: exact
    value: "6 scans, 3 unique visitors\nTrue\nFalse\nFalse\n"
hints:
  - "Create it empty — new HashSet<string>() — then foreach over scans, calling visitors.Add(name) for each."
  - "The summary line is interpolated from scans.Length and visitors.Count — don't type 6 or 3 yourself."
  - "Add returns a bool. Capture it: bool added = visitors.Add(\"ada\"); then print added."
---
## The bag that refuses duplicates

Third core collection, simplest rule: a `HashSet<T>` holds each value **at
most once**. Add something it already has, and it just... declines.

```csharp
HashSet<string> tags = new HashSet<string>();
tags.Add("urgent");     // true  — added
tags.Add("bug");        // true  — added
tags.Add("urgent");     // false — already there, set unchanged
Console.WriteLine(tags.Count);   // 2
```

That's the trick worth noticing: `Add` returns a `bool` telling you whether
it actually added anything. No pre-checking, no exception — the set quietly
enforces uniqueness and reports what happened.

Sets answer one question extremely well: **"have I seen this before?"**
`Contains` on a `HashSet` is effectively instant no matter how big the set
gets, while `Contains` on a `List` walks every element looking for a match.
Deduplicating scans, tracking visited pages, spotting repeat usernames —
any "seen it already?" job is set-shaped.

The trade: a set has no order and no index. There's no `visitors[0]`, and
when you `foreach` over it, the order isn't something to rely on. If you
catch yourself wanting positions, you wanted a `List`; wanting labels, a
`Dictionary`. Choosing the right collection *is* the skill this unit is
building.

### Your goal

The starter has today's badge-scan log — six scans, with repeats. Produce
exactly:

```
6 scans, 3 unique visitors
True
False
False
```

1. Create a `HashSet<string>` called `visitors` and `Add` every scan to it,
   using a loop.
2. Print the summary line — both numbers computed from `scans.Length` and
   `visitors.Count`, not typed by hand.
3. Print `visitors.Contains("grace")`, then `visitors.Contains("brad")`.
4. `Add` `"ada"` one more time, capture the `bool` it returns, and print it.
