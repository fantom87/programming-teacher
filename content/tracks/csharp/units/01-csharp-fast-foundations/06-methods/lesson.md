---
id: 06-methods
title: Methods
language: csharp
runner: local
estMinutes: 15
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Define two methods with typed parameters and return values — int Square(int n) and string Greet(string name) — and call them to produce the expected output."
docs: [csharp/methods]
checks:
  - id: method-output
    type: stdout
    entry: Program.cs
    match: exact
    value: "49\nHello, Ada!\n144\n"
  - id: real-methods
    type: ai-judge
    rubric: "The code defines at least two methods (local functions are fine) that each take at least one parameter and return a value with a declared return type, and the printed output comes from calling those methods — not from hard-coded Console.WriteLine values."
hints:
  - "A method declares what it returns, its name, and typed parameters: int Square(int n) { return n * n; }"
  - "return hands the value back; the caller prints it: Console.WriteLine(Square(7));"
  - "In a top-level program, method definitions go at the bottom, after the statements."
---
## Types on the doors

You've called methods since lesson one — `Console.WriteLine` is one. Now you
write your own, and this is where static typing starts paying rent. A C#
method declares the type of everything crossing its boundary — what goes in
*and* what comes out:

```csharp
int Double(int n)
{
    return n * 2;
}

Console.WriteLine(Double(21));   // 42
```

Read the first line like a contract: "give me an `int`, I return an `int`."
The compiler enforces both sides — call `Double("hi")` and it won't compile;
forget the `return` and it won't compile either. Method signatures become
documentation that can't go stale.

In a top-level program these are called *local functions*, and there's one
placement rule: the runnable statements come first, method definitions after
them at the bottom of the file. Calls at the top can happily use methods
defined below — the compiler reads the whole file before judging.

A method that returns something is a value factory: `Square(7)` can sit
anywhere a plain `49` could, including inside `Console.WriteLine(...)` or
another expression.

> **Heads-up**: first Run compiles (~10s). Later runs are quick.

### Your goal

Define two methods and call them so the program prints exactly:

```
49
Hello, Ada!
144
```

1. `int Square(int n)` — returns `n * n`. Print `Square(7)` and `Square(12)`.
2. `string Greet(string name)` — returns `"Hello, {name}!"` using
   interpolation. Print `Greet("Ada")`.

The values must come from the method calls — no hard-coding `49` allowed.
