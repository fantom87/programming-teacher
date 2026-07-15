---
id: 02-static-types
title: Static Types
language: csharp
runner: local
estMinutes: 12
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Declare four typed variables — a string \"C#\", an int 2026, a double 9.75, a bool true — and print each on its own line."
docs: [csharp/types-and-variables]
checks:
  - id: prints-typed-values
    type: stdout
    entry: Program.cs
    match: exact
    value: "C#\n2026\n9.75\nTrue\n"
hints:
  - "Declarations lead with the type: int year = 2026;"
  - "The four types you need: string, int, double, bool."
  - "Console.WriteLine(year); prints a variable's value — one WriteLine per line of output."
---
## The type comes first

In Python or JavaScript, a variable will happily hold a number today and a
string tomorrow. C# says no. Every variable declares its **type** up front,
and the compiler holds you to it forever:

```csharp
int wheels = 4;
string maker = "Volvo";
double price = 19999.50;
bool electric = false;
```

The four workhorse types: `int` for whole numbers, `double` for decimals,
`string` for text (always double quotes), and `bool` for `true`/`false`.

Here's the payoff. Try writing `wheels = "many";` — the compiler refuses to
even run the program: *cannot convert 'string' to 'int'*. A whole category of
bugs that scripting languages let you discover at 2 a.m. in production, C#
catches before the program starts. That trade — a little ceremony for a lot of
safety — is the deal static typing offers, and most people grow to love it.

Two printing quirks worth knowing: `Console.WriteLine(someBool)` prints
`True` with a capital T, and a `double` like `9.75` prints just as you'd
expect.

> **Heads-up**: the first Run compiles the project and takes ~10 seconds or
> more. After that it's much faster.

### Your goal

Declare four variables and print each with its own `Console.WriteLine`, so the
output is exactly:

```
C#
2026
9.75
True
```

That's a `string` of `"C#"`, an `int` of `2026`, a `double` of `9.75`, and a
`bool` of `true` — in that order.
