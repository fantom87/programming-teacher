---
id: 04-tuples-and-deconstruction
title: Tuples and Deconstruction
language: csharp
runner: local
estMinutes: 15
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Write MinMax(int[] values) returning both extremes as one named tuple, deconstruct the result into two variables, then pull off the classic no-temp variable swap with tuple assignment."
docs: [csharp/methods, csharp/types-and-variables]
checks:
  - id: minmax-and-swap
    type: stdout
    entry: Program.cs
    match: exact
    value: "low 54, high 72\nswing: 18\nbefore: Ada, Grace\nafter: Grace, Ada\n"
  - id: tuple-idioms
    type: ai-judge
    rubric: "MinMax is declared with a named tuple return type — (int Min, int Max) — and returns both values in one return statement, computed from the array (a scan loop or Min()/Max() calls; 54 and 72 never appear as literals). The call site DECONSTRUCTS the result into two variables — (int min, int max) = MinMax(temps); — rather than storing the tuple and dotting .Min/.Max. The swing line is computed from those deconstructed variables. The swap uses one tuple assignment (first, second) = (second, first); with no third temp variable, and the before/after lines print the same two variables."
hints:
  - "Return type first: (int Min, int Max) MinMax(int[] values) { ... return (min, max); } — track both in one pass over the array."
  - "Deconstruct at the call: (int min, int max) = MinMax(temps); — two fresh variables, both filled by one call. Then swing is max - min."
  - "The swap is one line, no temp: (first, second) = (second, first); — the right-hand tuple is built first, THEN assigned, so nothing is lost."
---
## Two answers from one method

A method returns one thing. That's fine until the honest answer is two
things — the smallest *and* largest of the same array. Scanning it twice is
wasteful; writing a `MinMaxResult` class for one method's plumbing is
ceremony. C# has a lighter tool — the **tuple**:

```csharp
(int Min, int Max) MinMax(int[] values)
{
    // one pass, tracking both...
    return (min, max);
}
```

That return type is a pair with *named* elements. Callers can keep the
bundle — `var result = MinMax(temps); result.Max` — but the fluent move is
to **deconstruct**, unpacking straight into fresh variables:

```csharp
(int min, int max) = MinMax(temps);
```

One call, two filled variables, names of your choosing. This is also why
lesson 1's *positional* records were declared the way they were — they
deconstruct for free: `var (title, artist, seconds) = song;`.

Deconstruction works in plain assignments too, which unlocks a classic.
Swapping two variables used to demand a third:

```csharp
(first, second) = (second, first);
```

The right-hand tuple is built *first*, then assigned — so nothing gets
overwritten before it's read. No temp, no shuffle, and it reads exactly
like what it does.

So when tuple, and when record? Scope. A tuple is for *local* plumbing — a
method handing two values back, a quick pairing inside a loop. The moment
the bundle travels — stored in a list, passed between layers, part of your
domain — give it a record and a real name. Tuples are grammar; records are
vocabulary.

### Your goal

Produce exactly:

```
low 54, high 72
swing: 18
before: Ada, Grace
after: Grace, Ada
```

1. Write `MinMax(int[] values)` returning `(int Min, int Max)` — both
   extremes, one pass, one `return`.
2. Deconstruct the call on the starter's `temps` into `min` and `max`;
   print the `low`/`high` line, then `swing:` (max minus min).
3. Start `first = "Ada"`, `second = "Grace"`; print `before:`, swap with
   one tuple assignment, print `after:`.
