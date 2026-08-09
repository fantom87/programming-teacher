---
id: 02-properties
title: Properties
language: csharp
runner: local
estMinutes: 15
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Give the Rectangle class Width and Height auto-properties plus a computed Area property, so the starter's top-level code compiles and prints both area lines."
docs: [csharp/classes-and-objects]
checks:
  - id: area-recomputes
    type: stdout
    entry: Program.cs
    match: exact
    value: "4 x 2.5 = 10\n8 x 2.5 = 20\n"
  - id: real-properties
    type: ai-judge
    rubric: "Rectangle exposes Width and Height as auto-properties with { get; set; } (PascalCase, not public fields), and Area is a computed property (expression-bodied => or a get-only property) that multiplies Width by Height on every read — Area is not a stored field or settable auto-property, and the numbers 10 and 20 are computed, never typed into the code."
hints:
  - "An auto-property in one line: public double Width { get; set; }"
  - "A computed property has no set and no stored value: public double Area => Width * Height;"
  - "The class needs nothing else — no constructor, no fields. Three property lines and you're done."
---
## The public face of your class

Last lesson you reached straight into `p2.score` from outside the class.
Public fields work, but you'll almost never see them in professional C#.
The idiom is **properties**:

```csharp
class Rectangle
{
    public double Width { get; set; }
    public double Height { get; set; }
}
```

That `{ get; set; }` is an **auto-property**. From outside it feels exactly
like a field — `r.Width = 4;` to write, `r.Width` to read — but under the
hood it's a pair of tiny methods (a *getter* and a *setter*) wrapped around a
hidden field. Why bother? Because methods can grow brains later: add
validation, logging, or a computed value without changing a single caller.
Fields can't. Note the naming convention while you're here: properties are
`PascalCase`, fields are `camelCase`.

The payoff arrives immediately with the second kind — the **computed
property**:

```csharp
public double Area => Width * Height;
```

No `set`, no storage. The `=>` says "when someone reads `Area`, run this
expression." It recomputes on every read, so it can never go stale — resize
the rectangle and `Area` is already correct. Compare that to storing the area
in a field: one forgotten update and your class is quietly lying.

If a caller tries `r.Area = 50;`, the compiler refuses — there's no setter.
Read-only by construction.

### Your goal

The top-level code is already written in the starter. Build the `Rectangle`
class it needs:

1. `Width` and `Height` — `double` auto-properties.
2. `Area` — a computed property returning `Width * Height`.

Expected output (note `Area` updating after the resize):

```
4 x 2.5 = 10
8 x 2.5 = 20
```
