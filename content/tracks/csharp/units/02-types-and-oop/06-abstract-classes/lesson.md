---
id: 06-abstract-classes
title: Abstract Classes
language: csharp
runner: local
estMinutes: 18
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Define an abstract Shape with an abstract Area method and one shared Describe method, then implement Circle and Rectangle and describe one of each from a List<Shape>."
docs: [csharp/classes-and-objects, csharp/interfaces]
checks:
  - id: shape-areas
    type: stdout
    entry: Program.cs
    match: exact
    value: "Circle area: 28.27\nRectangle area: 10.00\n"
  - id: really-abstract
    type: ai-judge
    rubric: "Shape is declared abstract and contains: an abstract double Area() (no body), and a concrete Describe defined ONCE on the base that prints using Area() with :F2 formatting. Circle and Rectangle derive from Shape and override Area with real formulas (Math.PI * radius * radius; width * height). Describe is not duplicated in the child classes, no Shape is instantiated with new Shape(...), and the two area numbers are computed, not typed as literals."
hints:
  - "abstract class Shape { public abstract double Area(); } — an abstract method has a signature and a semicolon, no body."
  - "Describe lives on Shape only, once: public void Describe() { Console.WriteLine($\"{Name} area: {Area():F2}\"); } — it calls whichever Area the real object provides."
  - "Circle stores a radius from its constructor and overrides Area: public override double Area() { return Math.PI * Radius * Radius; }"
---
## Blueprints with holes in them

The `Animal` from last lesson had a wrinkle: you could create a plain
`new Animal("Blob")` — a creature of no particular kind. Sometimes that's
fine. But what *is* a plain Shape? What's its area? The question has no
answer, and C# lets you say so:

```csharp
abstract class Shape
{
    public abstract double Area();   // a hole: signature, semicolon, no body

    public void Describe()           // shared machinery, written once
    {
        Console.WriteLine($"{Name} area: {Area():F2}");
    }
}
```

Two new powers here. First, `abstract class` means **no instantiating** —
`new Shape("blob")` is a compile error; only concrete children can be built.
Second, an `abstract` method is a **hole in the blueprint**: it has a
signature but no body, and every child *must* `override` it — forget, and
the compiler refuses to build. (Compare `virtual`: children *may* replace a
default. `abstract`: children *must* fill a blank.)

The magic is how the two halves cooperate. `Describe` is ordinary shared
code, written once on the base — yet it calls `Area()`, which doesn't exist
yet! By the time `Describe` actually runs, it's running on a real `Circle`
or `Rectangle`, and *their* `Area` answers. The base class provides the
skeleton; each child plugs in its one line of geometry. Professional
codebases lean on this shape constantly: shared workflow up top, required
specifics below.

### Your goal

Produce:

```
Circle area: 28.27
Rectangle area: 10.00
```

1. `abstract class Shape` — a `Name` property set by its constructor, an
   `abstract double Area()`, and the shared `Describe` printing
   `{Name} area: {Area():F2}`.
2. `Circle` (constructor takes a radius) — `Area` returns
   `Math.PI * Radius * Radius`.
3. `Rectangle` (constructor takes width and height) — `Area` returns
   `Width * Height`.
4. Put a `Circle` of radius 3 and a `4 x 2.5 Rectangle` in a `List<Shape>`
   and call `Describe()` on each.
