---
id: 01-projects-and-solutions
title: Projects and Solutions
language: csharp
runner: local
estMinutes: 15
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Read the real app.csproj this lesson is compiled from and print a four-line report — OutputType, TargetFramework, Nullable, ImplicitUsings — every value extracted by a reusable helper, none typed by hand."
docs: [csharp/program-structure, csharp/dotnet-cli]
checks:
  - id: csproj-report
    type: stdout
    entry: Program.cs
    match: exact
    value: "== app.csproj ==\nOutputType: Exe\nTargetFramework: net8.0\nNullable: enable\nImplicitUsings: enable\n"
  - id: values-extracted
    type: ai-judge
    rubric: "The four property values are read out of app.csproj at runtime: the code loads the file with File.ReadAllLines or ReadAllText, and one reusable helper method locates an element by name and strips its tags (Trim/StartsWith/Replace, or IndexOf/Substring). Only property NAMES like TargetFramework appear as literals — the values Exe, net8.0, and enable are never typed into the source — and the helper produces the value for each of the four report lines (called directly four times or via a loop)."
hints:
  - "The project file genuinely sits next to your code: string[] lines = File.ReadAllLines(\"app.csproj\"); gives you its lines."
  - "In the helper, trim each line and test trimmed.StartsWith($\"<{name}>\") — then peel both tags off with .Replace($\"<{name}>\", \"\").Replace($\"</{name}>\", \"\")."
  - "Shape: static string Prop(string[] lines, string name) { foreach line: trim, match, peel, return; } — then Console.WriteLine($\"Nullable: {Prop(lines, \"Nullable\")}\"); and friends."
---
## The other half of your program

Every C# lesson so far has quietly involved a file you never wrote. When you
hit Run, `dotnet` doesn't start with `Program.cs` — it looks for a **project
file**, and yours is called `app.csproj`. Your code says *what the program
does*; the csproj says *how to build it*:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
</Project>
```

It's XML — angle-bracket tags with values between them. `Sdk="Microsoft.NET.Sdk"`
pulls in sensible defaults, including "compile every `.cs` file in this
folder" — which is why nothing here lists your file. The `<PropertyGroup>`
holds the decisions: **OutputType** `Exe` means a runnable program rather
than a library; **TargetFramework** pins which .NET you build against;
**Nullable** switches on the null-checking you'll meet in lesson 7; and
**ImplicitUsings** is the reason you've never had to write `using System;`
to reach `Console`.

One project is rarely the whole story. Real products are several — the app,
a class library, a test project — grouped by a **solution** file (`.sln`) so
tools build them together: `dotnet new sln`, then `dotnet sln add MyApp`.
For now the shorthand is enough: csproj = one buildable thing, sln = the set.

Here's the fun part: none of this is hypothetical. The workspace this lesson
runs in is literally a folder holding `app.csproj` next to your `Program.cs` —
so your program can open its own project file and report on it.
`File.ReadAllLines("app.csproj")` hands you the lines; a small helper can
find `<Nullable>` and peel the tags off.

### Your goal

Print exactly:

```
== app.csproj ==
OutputType: Exe
TargetFramework: net8.0
Nullable: enable
ImplicitUsings: enable
```

1. Read `app.csproj` with `File.ReadAllLines`.
2. Write a helper `Prop(string[] lines, string name)` that finds the line
   for `<name>` and returns the value between the tags.
3. Print the header, then one `Name: value` line per property — every value
   fetched by the helper, none typed by hand.
