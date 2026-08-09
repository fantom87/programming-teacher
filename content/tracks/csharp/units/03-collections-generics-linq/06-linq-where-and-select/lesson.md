---
id: 06-linq-where-and-select
title: "LINQ: Where and Select"
language: csharp
runner: local
estMinutes: 15
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Use LINQ method syntax on a temperature list: Where to keep the warm days, then a chained Where + OrderBy + Select pipeline that builds formatted labels — foreach-printing both results."
docs: [csharp/linq-basics, csharp/collections]
checks:
  - id: linq-pipeline-output
    type: stdout
    entry: Program.cs
    match: exact
    value: "31\n28\n35\n28C\n31C\n35C\n"
  - id: uses-linq-operators
    type: ai-judge
    rubric: "Both result sequences are produced with LINQ method syntax: the first via temps.Where with a lambda predicate, the second via a chain that includes Where, OrderBy, and Select with lambdas. The filtering, ordering, and label formatting are done by those operators — not by manual for/foreach loops with if statements building up lists, and not by printing hardcoded values."
hints:
  - "A lambda is a mini inline method: t => t >= 25 reads \"given t, is t at least 25?\""
  - "var warm = temps.Where(t => t >= 25); then foreach (int t in warm) to print."
  - "Chain calls with dots, one per line: temps.Where(t => t >= 25).OrderBy(t => t).Select(t => $\"{t}C\") — Select turns each int into a string."
---
## Loops you don't have to write

Every "keep some items" job so far has meant a `foreach`, an `if`, and a
result list you fill by hand. LINQ (Language INtegrated Query) collapses that
whole ritual into one readable line:

```csharp
var warm = temps.Where(t => t >= 25);
```

The arrow expression is a **lambda** — a tiny nameless method written inline.
`t => t >= 25` means "given an item `t`, answer whether `t >= 25`." `Where`
runs your lambda against every element and keeps the ones that say `true`,
in their original order.

`Where` filters; its partner `Select` *transforms* — it maps each element
through a lambda into something new (programmers call this **projection**):

```csharp
var labels = temps.Select(t => $"{t}C");   // ints in, strings out
```

The real power move is chaining. Each operator returns a sequence, so the
next operator can grab on, and the pipeline reads left-to-right like a
sentence:

```csharp
var report = temps
    .Where(t => t >= 25)     // keep the warm ones
    .OrderBy(t => t)         // sort ascending
    .Select(t => $"{t}C");   // format each
```

Filter, sort, format — three steps, zero handwritten loops, no temporary
lists. This "method syntax" style is the LINQ you'll see most in real
codebases, and it works on lists, arrays, dictionaries — any sequence.

You still `foreach` over the *result* to print it. LINQ builds the sequence;
what happens to it afterwards is your business.

### Your goal

From the starter's week of daily highs, produce exactly:

```
31
28
35
28C
31C
35C
```

1. `warm` — `Where` keeps temps of 25 and up. `foreach`-print each (original
   order).
2. `labels` — one chain on `temps`: `Where` (25 and up), `OrderBy`
   (ascending), `Select` into `$"{t}C"`. `foreach`-print each label.
