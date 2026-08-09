---
id: 05-generic-classes-and-constraints
title: Generic Classes and Constraints
language: csharp
runner: local
estMinutes: 18
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Build a generic Box<T> class that stores and describes any value, plus a Max<T> method constrained to IComparable<T> — then use both with ints and strings."
docs: [csharp/classes-and-objects, csharp/interfaces]
checks:
  - id: generic-class-output
    type: stdout
    entry: Program.cs
    match: exact
    value: "Box holding 38\nBox holding keep going\n11\npear\n"
  - id: generic-not-overloaded
    type: ai-judge
    rubric: "Box is declared once as a generic class (class Box<T>) whose stored value, constructor parameter, and property all use the type parameter. Max is declared once as a generic method with a where T : IComparable<T> constraint and decides its result by calling CompareTo. Neither is implemented as per-type overloads or duplicate classes, and the int/string calls flow through the same generic code."
hints:
  - "class Box<T> { public T Value { get; } public Box(T value) { Value = value; } } — T works anywhere a type would."
  - "Describe() is one interpolated return: $\"Box holding {Value}\"."
  - "Max signature: T Max<T>(T a, T b) where T : IComparable<T> — inside, return a.CompareTo(b) >= 0 ? a : b;"
---
## Classes with blanks in them

Generic methods were half the story. The other half is where `List<T>` itself
comes from: **generic classes** — classes with a blank where a type goes.

```csharp
class Box<T>
{
    public T Value { get; }

    public Box(T value)
    {
        Value = value;
    }
}
```

`T` gets fixed the moment someone constructs one: `new Box<int>(38)` is a box
whose `Value` is genuinely an `int`; `new Box<string>("hi")` holds a real
`string`. One class definition, a whole family of precise types — that's
exactly how `List<T>` and `Dictionary<TKey, TValue>` are built.

But write generic code for a while and you hit a wall. Inside `Box<T>`, what
can you *do* with a `T`? Almost nothing — the compiler only knows "it's some
type". Try comparing two `T`s with `<` and compilation fails, because nothing
promises that `T` is comparable.

**Constraints** are the fix — a `where` clause narrowing which types are
allowed in, and unlocking their abilities:

```csharp
T Max<T>(T a, T b) where T : IComparable<T>
{
    return a.CompareTo(b) >= 0 ? a : b;
}
```

"Any `T` — as long as it knows how to compare itself to another `T`." Now
`CompareTo` compiles (positive means "a is bigger"), and `int`, `string`,
`double` all qualify because they implement `IComparable<T>`. A type that
can't compare is rejected *at compile time* — the contract idea from
interfaces, powering generics.

### Your goal

Produce exactly:

```
Box holding 38
Box holding keep going
11
pear
```

1. Write the generic class `Box<T>`: constructor stores a `T` in a `Value`
   property, and `Describe()` returns `$"Box holding {Value}"`.
2. Create `new Box<int>(38)` and `new Box<string>("keep going")` — print each
   box's `Describe()`.
3. Write `T Max<T>(T a, T b) where T : IComparable<T>` using `CompareTo`,
   then print `Max(3, 11)` and `Max("apple", "pear")`.
