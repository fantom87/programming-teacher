---
id: 09-structs
title: Structs
language: csharp
runner: local
estMinutes: 18
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Define a Point struct with X and Y, a constructor, and a DistanceTo method — then prove its value-type copy semantics by mutating a copy, and compute a real distance with Math.Sqrt."
docs: [csharp/types-and-variables, csharp/classes-and-objects]
checks:
  - id: struct-copy-and-distance
    type: stdout
    entry: Program.cs
    match: exact
    value: "a = (3, 4)\nb = (99, 4)\na to origin: 5\n"
  - id: real-struct
    type: ai-judge
    rubric: "Point is declared with the struct keyword (not class) and has X and Y members, a constructor setting both, and a DistanceTo (or equivalently named) method that computes Math.Sqrt of the squared coordinate differences. The code demonstrates value semantics by assigning one Point variable to another and mutating only the copy before printing both. The printed 5 comes from calling the distance method on live Point values — none of the three output lines' numbers after the mutation (99, 5) are hard-coded into WriteLine strings."
hints:
  - "Swap one keyword: struct Point { ... } — the inside looks exactly like a class (properties, constructor, methods)."
  - "Because Point is a struct, Point b = a; copies the whole value — changing b.X leaves a untouched. That's the lesson-1 experiment with the opposite result."
  - "DistanceTo: double dx = X - other.X; double dy = Y - other.Y; return Math.Sqrt(dx * dx + dy * dy); — for (3,4) to (0,0) that's 5."
---
## Design your own value type

Full circle time. This unit opened with the two kinds of copies: value types
copy the value, reference types copy the reference. You've spent seven
lessons building reference types — every `class` is one. Today, the other
kind. A **struct** is a value type *you* design:

```csharp
struct Point
{
    public double X { get; set; }
    public double Y { get; set; }

    public Point(double x, double y)
    {
        X = x;
        Y = y;
    }
}
```

The body reads exactly like a class — properties, constructor, methods. The
keyword changes the *semantics*: a `Point` variable holds the data itself,
not directions to it. Assignment copies the whole thing:

```csharp
Point b = a;    // a full copy — two independent points
b.X = 99;       // a.X is untouched
```

Run the lesson-1 experiment in your head: with a class, mutating through the
second variable changed "both" objects (there was only one). With a struct,
the copy is genuinely separate. Same syntax, opposite behavior — now you
know why it matters that .NET's own `int`, `double`, `bool`, and `DateTime`
are all structs.

So when do you write one? The .NET guideline is refreshingly concrete: use a
struct when the type is **small, data-centric, and has no identity** — a
coordinate, a color, an amount of money. Two points at (3, 4) are
interchangeable; nobody asks "but *which* (3, 4)?" A bank account is the
opposite — two accounts with equal balances are emphatically not the same
account. Identity means class.

### Your goal

Produce:

```
a = (3, 4)
b = (99, 4)
a to origin: 5
```

1. Define `struct Point`: `X`, `Y`, a constructor, and
   `double DistanceTo(Point other)` using `Math.Sqrt`.
2. Create `a = (3, 4)`, copy it to `b`, set `b.X = 99`, and print both as
   `({X}, {Y})` — proving the copy is independent.
3. Print `a`'s distance to a `(0, 0)` point via `DistanceTo`.
