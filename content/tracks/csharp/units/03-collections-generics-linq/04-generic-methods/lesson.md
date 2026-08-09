---
id: 04-generic-methods
title: Generic Methods
language: csharp
runner: local
estMinutes: 15
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Write generic methods First<T> and Last<T> that work on any List<T>, and prove it by calling them on an int list and a string list."
docs: [csharp/methods, csharp/collections]
checks:
  - id: generic-methods-output
    type: stdout
    entry: Program.cs
    match: exact
    value: "3\nalpha\n243\ngamma\n"
  - id: actually-generic
    type: ai-judge
    rubric: "First and Last are each defined exactly once as generic methods with a type parameter (e.g. T First<T>(List<T> items)) and both return type and parameter use that type parameter. The int and string calls go through the same two generic methods — there are no per-type overloads like First(List<int>) plus First(List<string>), and no use of object as the parameter type."
hints:
  - "The signature reads: T First<T>(List<T> items) — the <T> after the name declares the placeholder, then T is usable as a type everywhere in the method."
  - "First returns items[0]. Last returns items[items.Count - 1]."
  - "Call them like normal methods — First(numbers), First(words) — the compiler figures out T from the argument."
---
## Writing the angle brackets yourself

You've been *consuming* generics all unit: `List<string>`, `Dictionary<string,
int>`, `HashSet<string>`. Someone wrote `List<T>` once, and it works for every
type ever invented. Today you switch sides and write the angle brackets
yourself.

Say you want a method returning the first item of a list. Without generics
you'd be stuck writing one per type:

```csharp
int FirstInt(List<int> items) { return items[0]; }
string FirstString(List<string> items) { return items[0]; }
// ...one more for every type, forever
```

Identical bodies, different types — exactly the duplication the compiler
should handle. A **generic method** declares a *type parameter*:

```csharp
T First<T>(List<T> items)
{
    return items[0];
}
```

Read it as: "for any type `T` you pick, `First` takes a `List<T>` and returns
a `T`." The `<T>` after the method name introduces the placeholder; from then
on `T` works like a real type inside the method.

Calling it is anticlimactic — in a good way:

```csharp
List<int> nums = new List<int> { 5, 10 };
Console.WriteLine(First(nums));    // 5 — the compiler infers T = int
```

No `<int>` needed at the call site: the compiler looks at the argument and
*infers* `T`. And it stays fully type-safe — `First(nums)` is an `int` as far
as the compiler is concerned, not some vague "object".

`T` is just a name (convention: `T`, or descriptive like `TKey`), and this is
the same machinery behind every collection you've used this unit.

### Your goal

The starter has an int list and a string list. Produce exactly:

```
3
alpha
243
gamma
```

1. Write `T First<T>(List<T> items)` — returns the item at index 0.
2. Write `T Last<T>(List<T> items)` — returns the item at index `Count - 1`.
3. Print `First(numbers)`, `First(words)`, `Last(numbers)`, `Last(words)` —
   one per line. Each method must be written **once**; no per-type copies.
