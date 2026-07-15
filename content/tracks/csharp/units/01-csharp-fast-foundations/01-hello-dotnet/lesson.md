---
id: 01-hello-dotnet
title: Hello, .NET
language: csharp
runner: local
estMinutes: 12
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Print exactly: Hello, .NET!"
docs: [csharp/program-structure]
checks:
  - id: prints-hello
    type: stdout
    entry: Program.cs
    match: exact
    value: "Hello, .NET!\n"
hints:
  - "C#'s printing instruction is Console.WriteLine(...)"
  - "Statements in C# end with a semicolon ;"
  - "The exact line is: Console.WriteLine(\"Hello, .NET!\");"
---
## A compiled language

C# is different from Python and JavaScript in one big way: before your code
runs, a **compiler** reads all of it, checks it, and translates it into a
faster form. If something's wrong, the compiler tells you *before* anything
runs — you'll come to love that.

Modern C# programs can start simple — top-level statements, no ceremony:

```csharp
Console.WriteLine("hi");
```

Note the semicolon: every statement in C# ends with one.

> **Heads-up**: the first Run compiles the project, which takes a while
> (10 seconds or more). After that it's much faster.

### Your goal

Make the program print exactly:

```
Hello, .NET!
```
