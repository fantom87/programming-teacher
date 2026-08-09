---
id: 03-property-patterns
title: Property Patterns
language: csharp
runner: local
estMinutes: 18
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Classify Package records with one switch expression built from property patterns — matching combinations of Express, Kg, and Destination — ordered most-specific-first, plus one `is` pattern check."
docs: [csharp/control-flow, csharp/classes-and-objects]
checks:
  - id: package-labels
    type: stdout
    entry: Program.cs
    match: exact
    value: "Oslo: express heavy\nLisbon: express\nPrague: freight\nlocal: courier\nMadrid: standard\nfirst flies tonight\n"
  - id: patterns-not-ifs
    type: ai-judge
    rubric: "Label is a single switch expression on the package whose arms are property patterns in braces — an arm matching Express: true combined with Kg: > 20 for \"express heavy\", an Express: true arm for \"express\", a Kg: > 20 arm for \"freight\", a Destination: \"local\" arm for \"courier\", and a discard for \"standard\" — with the express-heavy arm placed before the plain express and freight arms. No if/else chain and no boolean && expressions compute the labels; the five label lines come from one loop calling Label. The final line is guarded by an `is` property pattern (like packages[0] is { Express: true }), not by comparing .Express == true directly."
hints:
  - "An arm that matches a SHAPE: { Express: true, Kg: > 20 } => \"express heavy\" — two properties inside one set of braces means both must match."
  - "Specific before general: if { Express: true } comes first, express-heavy packages stop there and never reach the heavy arm. Discard _ last for \"standard\"."
  - "The last line: if (packages[0] is { Express: true }) Console.WriteLine(\"first flies tonight\"); — is works with property patterns anywhere, not just in switch."
---
## Matching shapes, not just values

Last lesson your patterns compared plain numbers. But most data isn't a
plain number — it's an object with properties. **Property patterns** let a
pattern reach *inside*:

```csharp
string label = package switch
{
    { Express: true, Kg: > 20 } => "express heavy",
    { Express: true }           => "express",
    { Kg: > 20 }                => "freight",
    _                           => "standard",
};
```

`{ Express: true }` reads as "any object whose `Express` is true." Put two
properties inside one set of braces and *both* must match — that first arm
is express **and** heavy. Notice the pattern vocabulary composing: a
constant pattern (`true`), a relational pattern (`> 20`), now nested inside
property patterns. It's one language, and it stacks.

First-match-wins is doing real work here. The express-heavy arm must come
*before* `{ Express: true }`, or every express package — heavy or not —
stops at the plain express arm. Ordering arms most-specific-first is *the*
skill of pattern matching, and the compiler has your back: reorder them so
an early arm swallows a later one, and the unreachable arm is a compile
error.

Patterns aren't switch-only, either. The same shapes work with `is`,
anywhere a condition goes:

```csharp
if (p is { Express: true, Kg: < 1 })
{
    // an express envelope
}
```

Compare that to `p.Express == true && p.Kg < 1` — same meaning, but the
pattern reads as one shape instead of a chain of comparisons. Combined with
the records you built in lesson 1, this is how modern C# handles data:
records to *shape* it, patterns to *ask questions about* it.

### Your goal

The starter has five `Package` records. Produce exactly:

```
Oslo: express heavy
Lisbon: express
Prague: freight
local: courier
Madrid: standard
first flies tonight
```

1. Write `Label(Package p)` — one switch expression: express **and** over
   20 kg `"express heavy"`; express `"express"`; over 20 kg `"freight"`;
   destination `"local"` `"courier"`; otherwise `"standard"`.
2. `foreach` over the packages, printing `{Destination}: {Label(p)}`.
3. With an `is` property pattern, check whether `packages[0]` is express —
   if so, print `first flies tonight`.
