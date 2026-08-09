---
id: 07-arrays-and-lists
title: Arrays and Lists
language: csharp
runner: local
estMinutes: 15
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Print the Length of a four-score array, then build a List<string>, Add three books to it, print its Count, and foreach-print each book."
docs: [csharp/collections]
checks:
  - id: array-and-list-output
    type: stdout
    entry: Program.cs
    match: exact
    value: "4\n3\nDune\nFoundation\nHyperion\n"
hints:
  - "An array knows its size: scores.Length (no parentheses — it's a property)."
  - "An empty growable list: List<string> shelf = new List<string>();"
  - "shelf.Add(\"Dune\"); grows the list; shelf.Count tells you how many it holds."
---
## Fixed rows and growing shelves

You met arrays in the loops lesson: a row of same-typed values whose size is
fixed the moment it's created.

```csharp
int[] scores = { 90, 75, 88, 62 };
Console.WriteLine(scores.Length);   // 4
Console.WriteLine(scores[0]);       // 90 — indexes start at 0
```

Arrays are simple and fast, but that fixed size chafes: real programs add and
remove things constantly. For that, .NET gives you `List<T>` — a collection
that grows as you feed it:

```csharp
List<string> shelf = new List<string>();
shelf.Add("Dune");
shelf.Add("Foundation");
Console.WriteLine(shelf.Count);     // 2
```

The angle brackets are your first taste of **generics**: `List<string>` is "a
list of strings", `List<int>` "a list of ints" — and the compiler enforces it,
so `shelf.Add(42)` won't compile. No stray numbers hiding in your book list.

Small trap for your pattern-matcher: arrays measure with `.Length`, lists with
`.Count`. Both work with `foreach` exactly the same way — and `foreach` is how
you'll walk them ninety percent of the time.

> **Heads-up**: first Run compiles (~10s). Later runs are quicker, but still
> take a few seconds.

### Your goal

Produce exactly:

```
4
3
Dune
Foundation
Hyperion
```

1. Print the starter array's `Length`.
2. Create an empty `List<string>`, `Add` `"Dune"`, `"Foundation"`, and
   `"Hyperion"` in that order.
3. Print the list's `Count`, then `foreach` over it printing each book.
