---
id: 05-delegates-and-lambdas
title: Delegates and Lambdas
language: csharp
runner: local
estMinutes: 18
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Write CountWhere(int[] values, Func<int, bool> keep) — your own Where-shaped method — then feed it a stored Func variable and an inline lambda, and route the banner lines through an Action<string>."
docs: [csharp/methods, csharp/linq-basics]
checks:
  - id: dice-report
    type: stdout
    entry: Program.cs
    match: exact
    value: ">> dice report\nsixes: 3\nevens: 5\n>> done\n"
  - id: delegates-at-work
    type: ai-judge
    rubric: "CountWhere takes a Func<int, bool> parameter and counts with its OWN loop, invoking the delegate on each element — no LINQ Count/Where inside it. The sixes count passes a Func<int, bool> variable (like isSix) declared separately and holding a lambda; the evens count passes an inline lambda at the call site. Both >> lines are printed through one Action<string> variable holding a lambda that adds the >> prefix — not by writing Console.WriteLine(\">> ...\") directly at top level. The 3 and 5 are computed by CountWhere over the rolls array, never hardcoded."
hints:
  - "Func<int, bool> reads inputs-then-output: takes an int, returns a bool. Store one: Func<int, bool> isSix = n => n == 6; — then isSix(4) calls it like a method."
  - "CountWhere: int count = 0; foreach (int v in values) { if (keep(v)) count++; } return count; — keep is just a method you were handed."
  - "Action<string> announce = message => Console.WriteLine($\">> {message}\"); — then announce(\"dice report\") and announce(\"done\") produce both banner lines."
---
## Behavior in a variable

Every lambda you fed to LINQ — `g => g.Rating`, `t => t.Amount < 0` — was
you passing *code* as an argument. Today we name the machinery that makes
that legal. A **delegate** is a type whose values are methods, and .NET
ships the two families you'll actually use:

```csharp
Func<int, bool> isSix = n => n == 6;
Console.WriteLine(isSix(4));          // False — call it like a method
```

`Func<int, bool>` reads inputs-then-output: takes an `int`, returns a
`bool`. The *last* type parameter is always the return type —
`Func<int, int, string>` takes two ints and returns a string. When there's
nothing to return, the family is `Action`: an `Action<string>` takes a
string and just *does* something.

A delegate in a variable is behavior you can store, pass, and swap. But the
real power move is a method that *accepts* one:

```csharp
int CountWhere(int[] values, Func<int, bool> keep)
```

Inside, `keep(v)` runs whatever the caller handed over. One counting loop,
infinite counting rules — sixes today, evens tomorrow, primes next week,
without touching the method again. This is exactly what `Where` is: open
its documentation and you'll find `Func<TSource, bool> predicate` staring
back at you. You haven't been learning a LINQ quirk all this time; you've
been using delegates since the day you met lambdas.

One habit: name delegate variables after what they *mean* (`isSix`,
`announce`), not what they are (`func1`). A well-named delegate reads like
a sentence at the call site.

### Your goal

Produce exactly:

```
>> dice report
sixes: 3
evens: 5
>> done
```

1. Write `CountWhere(int[] values, Func<int, bool> keep)` — its own loop
   and counter, calling `keep(v)`. No LINQ inside; feel the machinery once.
2. Count the sixes in `rolls` by passing a stored `Func<int, bool>`
   variable; count the evens by passing an inline lambda.
3. Make `Action<string> announce` that prints `>> ` plus the message —
   both banner lines go through it.
