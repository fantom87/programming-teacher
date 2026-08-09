---
id: 07-extension-methods
title: Extension Methods
language: csharp
runner: local
estMinutes: 15
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Write Shout and Truncate as extension methods on string — static class, static method, `this` on the first parameter — and call them instance-style, including one LINQ-flavored chain."
docs: [csharp/methods, csharp/linq-basics]
checks:
  - id: extended-strings
    type: stdout
    entry: Program.cs
    match: exact
    value: "LAUNCH THE PROBE!\na mission to...\nOK...\n"
  - id: real-extensions
    type: ai-judge
    rubric: "Both methods live in a top-level (non-nested) static class, are static, and mark their first string parameter with the `this` modifier. Shout returns the string uppercased with \"!\" appended; Truncate returns the string unchanged when it fits within max and otherwise the first max characters plus \"...\" — computed with Length and Substring or a range, not hardcoded outputs. All three calls are made instance-style on string values (\"...\".Shout(), not StringExtensions.Shout(...)), and the third output line comes from a chained call like \"ok\".Shout().Truncate(2)."
hints:
  - "The recipe: static class StringExtensions { public static string Shout(this string s) => s.ToUpper() + \"!\"; } — the `this` on the first parameter is the entire feature."
  - "Truncate guards first: if (s.Length <= max) return s; — otherwise return s.Substring(0, max) + \"...\";"
  - "Chaining just works because each call returns a string: \"ok\".Shout() gives \"OK!\", and .Truncate(2) trims that to \"OK...\"."
---
## Where Where lives

Here's a puzzle you've been carrying since the LINQ unit. Open the
documentation for `List<T>` and look for `Where`. It isn't there. Not on
arrays either. Yet `list.Where(...)` compiles and runs every day. The trick
is the **extension method** — a static method that *poses* as an instance
method:

```csharp
static class StringExtensions
{
    public static string Shout(this string s) => s.ToUpper() + "!";
}
```

The recipe has three parts: a `static` class, a `static` method, and the
`this` modifier on the first parameter. That `this` is the entire feature.
It tells the compiler: *let people call me ON a string* —

```csharp
"launch the probe".Shout()   // the string lands in s
```

Same method, dot-call spelling. Nothing about `string` changed — it's
`sealed`, you couldn't inherit from it if you wanted to, and you certainly
don't own it. Extensions let you bolt your team's vocabulary onto types you
can't touch: strings, ints, `DateTime`, other people's library types.

And because each extension returns a value, the dots chain:

```csharp
"ok".Shout().Truncate(2)   // "OK!" -> "OK..."
```

That chain shape should look familiar — it *is* the LINQ pipeline.
`Enumerable` is one giant static class of extension methods on
`IEnumerable<T>`; `Where`, `Select`, and `OrderBy` chain for exactly the
reason your two methods will.

One honest limit: an extension is outside the type, so it sees only the
public surface — no private fields, no special access. It's sugar, not
surgery. If you own the class, a real method is usually the better home;
extensions shine on the types you don't.

### Your goal

Produce exactly:

```
LAUNCH THE PROBE!
a mission to...
OK...
```

1. In a static class at the bottom of the file, write two extensions:
   `Shout(this string s)` — uppercased plus `"!"` — and
   `Truncate(this string s, int max)` — unchanged if it fits, otherwise
   the first `max` characters plus `"..."`.
2. Call them instance-style: `"launch the probe".Shout()`,
   `"a mission to the outer planets".Truncate(12)`, and the chain
   `"ok".Shout().Truncate(2)`.
