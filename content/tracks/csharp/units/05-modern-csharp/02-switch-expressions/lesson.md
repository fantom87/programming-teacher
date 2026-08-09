---
id: 02-switch-expressions
title: Switch Expressions
language: csharp
runner: local
estMinutes: 15
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Write Category(int age) as a single switch expression — relational patterns, an `and` combinator, and a discard arm — then print a category for every age in the starter array."
docs: [csharp/control-flow]
checks:
  - id: ticket-categories
    type: stdout
    entry: Program.cs
    match: exact
    value: "3: free\n9: child\n15: teen\n30: adult\n70: senior\n"
  - id: one-switch-expression
    type: ai-judge
    rubric: "Category's whole body is one switch expression on age (=> age switch { ... } or a return of one) using relational patterns — arms like < 5 and >= 65 — with the teen arm combining two comparisons with `and`, and a discard `_` arm producing \"adult\". No if/else chain or switch STATEMENT (case/break) computes categories, and the five printed lines come from calling Category inside a loop over the ages array, not from five hand-written WriteLines."
hints:
  - "The shape: string Category(int age) => age switch { < 5 => \"free\", ... , _ => \"adult\" }; — arms are pattern => result, separated by commas."
  - "The teen arm joins two relational patterns: >= 13 and < 18 => \"teen\". The senior arm is >= 65."
  - "Order matters — first match wins. Put < 5 before < 13 (or every toddler is a \"child\"), and keep _ last as the everything-else arm."
---
## A switch that returns

You know `switch` as a statement — `case`, `break`, `default`, and a bit of
ceremony. Modern C# has a second form that most new code prefers: the
**switch expression**. It doesn't *do* things; it *evaluates to a value*:

```csharp
string size = grams switch
{
    < 100  => "small",
    < 1000 => "medium",
    _      => "large",
};
```

Read each arm as *pattern* `=>` *result*. The value is tested against each
pattern top to bottom; the **first match wins** and its right-hand side
becomes the result of the whole expression. No `case`, no `break`, no
fall-through bugs.

Those `< 100` shapes are **relational patterns** — comparisons used as
patterns. They combine with `and`, `or`, and `not`:

```csharp
>= 13 and < 18 => "teen",
```

The `_` is the **discard** — it matches anything, which makes it your
"everything else" arm. It goes last, because first-match-wins means anything
after it would be unreachable — and the compiler enforces that: shadowed
arms are a compile error, and if your arms don't cover every possible input
you get a warning. The statement form never checked your logic like this.

Because it's an expression, it goes anywhere a value goes: assigned to a
variable, interpolated into a string, or — the tidiest form — as the entire
body of an expression-bodied method:

```csharp
string Category(int age) => age switch { ... };
```

That shape, a small pure function that classifies its input, is where switch
expressions shine — you'll see it in every modern C# codebase.

### Your goal

Produce exactly:

```
3: free
9: child
15: teen
30: adult
70: senior
```

1. Write `Category(int age)` — the whole body one switch expression:
   under 5 `"free"`, under 13 `"child"`, 13–17 `"teen"` (use `and`),
   65 and up `"senior"`, and a `_` arm for `"adult"`.
2. `foreach` over the starter's `ages` array, printing
   `{age}: {Category(age)}`. No `if`/`else` anywhere in the file.
