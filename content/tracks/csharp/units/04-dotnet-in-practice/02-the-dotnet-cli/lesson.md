---
id: 02-the-dotnet-cli
title: The dotnet CLI
language: csharp
runner: local
estMinutes: 14
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Prove the dotnet CLI's build footprint from inside the running program: live-check app.csproj, bin, and obj, then ask reflection which assembly you're running as."
docs: [csharp/dotnet-cli, csharp/program-structure]
checks:
  - id: footprint-report
    type: stdout
    entry: Program.cs
    match: exact
    value: "== Build footprint ==\napp.csproj found: True\nbin exists: True\nobj exists: True\nRunning as: app\n"
  - id: live-answers
    type: ai-judge
    rubric: "The three True values are live calls interpolated into the output — File.Exists(\"app.csproj\"), Directory.Exists(\"bin\"), Directory.Exists(\"obj\") — with True never typed as a literal. The Running as value comes from Assembly.GetEntryAssembly()?.GetName().Name (with using System.Reflection), and the string \"app\" is never typed as an output value (the \"app.csproj\" literal passed to File.Exists and printed in its label is fine)."
hints:
  - "Files and folders have separate checks: File.Exists(\"app.csproj\") for the file, Directory.Exists(\"bin\") and Directory.Exists(\"obj\") for the folders."
  - "The assembly name needs using System.Reflection; at the very top — then Assembly.GetEntryAssembly()?.GetName().Name comes back \"app\"."
  - "Each line is one interpolation: Console.WriteLine($\"bin exists: {Directory.Exists(\"bin\")}\"); — the bool prints as True."
---
## The tool behind every button

This app's Run button isn't magic — it shells out to the same command-line
tool every .NET professional lives in: the **`dotnet` CLI**. Five verbs
cover most of a working day:

```
dotnet new console -n MyApp    # scaffold a project (csproj + Program.cs)
dotnet run                     # build if needed, then run  <- the Run button
dotnet build                   # compile only; report errors
dotnet watch                   # rebuild and rerun on every save
dotnet publish                 # produce a shippable build
```

Where does the build *go*? Every run leaves a footprint of two folders next
to your code. **`obj/`** is the scratch bench — package bookkeeping and
half-finished pieces. **`bin/`** holds the finished product: your compiled
program, named after the project file, so `app.csproj` becomes `app.dll`
inside `bin/Debug/net8.0/`. This also explains why the first Run of every
lesson feels slow and later ones snappy: the CLI compares timestamps and
recompiles only what changed — an **incremental build**. Nothing in `bin/`
or `obj/` is precious; delete both and the next build recreates them, which
is exactly why they never get committed to git.

Today's program is a footprint inspector. Because it runs *inside*
`dotnet run`, it can look around the workspace and confirm all of this is
real: `File.Exists` answers for files, `Directory.Exists` for folders, and
one line of reflection lets a program ask which assembly it's running as:

```csharp
using System.Reflection;

string? name = Assembly.GetEntryAssembly()?.GetName().Name;   // "app"
```

That name isn't decoration — it's the CLI's whole naming chain made
visible: `app.csproj` in, `app.dll` out, `app` running right now.

### Your goal

Print exactly:

```
== Build footprint ==
app.csproj found: True
bin exists: True
obj exists: True
Running as: app
```

1. Print the header.
2. Three live checks, interpolated: the project file, `bin`, and `obj` —
   so each `True` is an answer, not a string you typed.
3. Add `using System.Reflection;` at the top and close with the entry
   assembly's name.
