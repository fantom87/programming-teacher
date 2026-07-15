---
id: 04-control-flow
title: Control Flow
language: csharp
runner: local
estMinutes: 15
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Use an if/else if/else chain to print Hot for temperature 35, then a switch expression to print weekend for day 6."
docs: [csharp/control-flow]
checks:
  - id: branches-correctly
    type: stdout
    entry: Program.cs
    match: exact
    value: "Hot\nweekend\n"
hints:
  - "if (temperature > 30) { ... } else if (temperature > 15) { ... } else { ... }"
  - "The condition needs parentheses, and each branch gets { braces }."
  - "A switch expression returns a value: string kind = day switch { 6 or 7 => \"weekend\", _ => \"weekday\" };"
---
## Two ways to decide

C#'s `if` will feel familiar — the condition wears parentheses and each branch
wears braces:

```csharp
if (speed > 120)
{
    Console.WriteLine("Slow down");
}
else if (speed > 90)
{
    Console.WriteLine("Careful");
}
else
{
    Console.WriteLine("Cruising");
}
```

The compiler checks your conditions too: `if (speed)` won't compile, because
`speed` is an `int`, not a `bool`. Only real true/false expressions get in.

For the "compare one value against several possibilities" pattern, modern C#
has something slicker than an if-chain: the **switch expression**. It takes a
value and maps it — each arm is `pattern => result`, and `_` catches anything
that didn't match:

```csharp
string mood = day switch
{
    6 or 7 => "weekend",
    _ => "weekday",
};
```

Notice it *returns a value* you assign to a variable — it's an expression, not
a statement. That `6 or 7` is a pattern matching either value, and the
compiler will warn you if your arms can miss a case. You'll see switch
expressions everywhere in modern C# code.

> **Heads-up**: first Run compiles (~10s); later runs are fast.

### Your goal

The starter declares `temperature = 35` and `day = 6`.

1. Write an `if` / `else if` / `else` chain: above 30 prints `Hot`, above 15
   prints `Mild`, otherwise prints `Cold`.
2. Write a switch expression on `day` mapping `6 or 7` to `"weekend"` and
   everything else to `"weekday"`, then print the result.

Expected output:

```
Hot
weekend
```
