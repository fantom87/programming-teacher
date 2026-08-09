---
id: 04-modern-language-features
title: Modern Language Features
language: csharp
runner: local
estMinutes: 18
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Five modern-C# drills, nine exact lines: a with expression and record value equality, deconstruction, a named-tuple method, one switch expression with property patterns, and a genuine extension method."
docs: [csharp/classes-and-objects, csharp/control-flow, csharp/methods]
checks:
  - id: modern-output
    type: stdout
    entry: Program.cs
    match: exact
    value: "p2: Point { X = 3, Y = 9 }\nsame: True\nsum: 12\nlo 2 hi 9\nS 0.5kg -> small parcel\nM 4kg -> standard\nM 12kg -> heavy\nL 32kg -> freight\nslug: modern-csharp\n"
  - id: modern-idioms
    type: ai-judge
    rubric: "p2 is created from p1 with a `with` expression changing only Y — not new Point(3, 9) — and the True on the same: line comes from == between two independently constructed records (record value equality), not ReferenceEquals or hand-typed True. sum uses positional deconstruction into two variables (var (x, y) = ...), not p2.X + p2.Y directly. Bounds returns a named tuple (int Lo, int Hi) or equivalent built with Min and Max, and the call site deconstructs or uses the names — the 2 and 9 are computed from the array. Rate is a single switch expression over Box using property patterns: a Kg-relational arm (> 20) for freight, a Size \"S\" arm, a combined Size \"M\" and Kg <= 5 arm, and a discard — no if/else chain; the four box lines come from looping the boxes list. Slug is an extension method (static class, this string parameter) chaining ToLowerInvariant and Replace; no output words (small parcel, standard, heavy, freight, modern-csharp, 12, 2, 9) are typed as literals inside WriteLines."
hints:
  - "with copies a record, changing only what you name: Point p2 = p1 with { Y = 9 }; — and records print themselves as Point { X = 3, Y = 9 }, so interpolate p2 directly."
  - "Tuples name their fields in the return type: (int Lo, int Hi) Bounds(int[] xs) => (xs.Min(), xs.Max()); — deconstruct at the call site with var (lo, hi) = Bounds(...)."
  - "Rate in one expression: b switch { { Kg: > 20 } => \"freight\", { Size: \"S\" } => \"small parcel\", { Size: \"M\", Kg: <= 5 } => \"standard\", _ => \"heavy\" } — arms match top to bottom, so the freight arm must come first."
---
## The modern kit

Everything post-C# 9 that changed how the language *feels*, in five
drills. Rapid recap:

- **Records** are value-shaped: `record Point(int X, int Y)` gives you a
  constructor, `==` that compares *contents*, and a readable `ToString`
  (`Point { X = 3, Y = 9 }`) for free.
- **`with`** copies immutably: `p1 with { Y = 9 }` — never edit, always
  replace.
- **Deconstruction** splits positional records and tuples alike:
  `var (x, y) = p2;`.
- **Named tuples** make multi-returns honest:
  `(int Lo, int Hi) Bounds(...)` beats out-params every time.
- **Switch expressions with property patterns** match on *shape*:
  `{ Size: "M", Kg: <= 5 }` reads like the spec it came from. Arms match
  top to bottom — put the greedy relational arm first.
- **Extension methods** bolt vocabulary onto types you don't own: a
  `static` class, a `static` method, `this` on the first parameter.

The starter seeds the data; every printed value is computed from it.

### Your goal

Work the five drills to produce exactly:

```
p2: Point { X = 3, Y = 9 }
same: True
sum: 12
lo 2 hi 9
S 0.5kg -> small parcel
M 4kg -> standard
M 12kg -> heavy
L 32kg -> freight
slug: modern-csharp
```

The checker demands a real `with` expression, record `==`, a
deconstruction, a named-tuple return, one switch expression with
property patterns (freight arm first), and a genuine `this`-parameter
extension method.
