---
id: 04-files-and-directories
title: Files and Directories
language: csharp
runner: local
estMinutes: 16
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Write a two-entry journal into notes/journal.txt — Path.Combine for the path, WriteAllText then AppendAllText for rerun-safe writes — and read it back with a count and an exists check."
docs: [csharp/collections, csharp/program-structure]
checks:
  - id: journal-round-trip
    type: stdout
    entry: Program.cs
    match: exact
    value: "Day 1: read the csproj\nDay 2: tamed the CLI\n2 entries on disk\nTrue\n"
  - id: rerun-safe-io
    type: ai-judge
    rubric: "The path is built with Path.Combine(\"notes\", \"journal.txt\") — no slash-joined \"notes/journal.txt\" or \"notes\\\\journal.txt\" literal. Day 1 is written with File.WriteAllText (which replaces the file) and Day 2 added with File.AppendAllText, so repeated runs keep exactly two entries. The printed entries and the count come from File.ReadAllLines and its Length, and the final True is a live File.Exists call — neither 2 nor True is typed into an output string."
hints:
  - "Directory.CreateDirectory(\"notes\") first — it's a no-op when the folder already exists, so it's safe on every rerun."
  - "string path = Path.Combine(\"notes\", \"journal.txt\"); then File.WriteAllText(path, \"Day 1: read the csproj\\n\"); and File.AppendAllText(path, \"Day 2: tamed the CLI\\n\");"
  - "Read back: string[] entries = File.ReadAllLines(path); foreach-print them, then $\"{entries.Length} entries on disk\" and Console.WriteLine(File.Exists(path));"
---
## Programs that leave a trail

Until now every C# program you've written forgot everything the moment it
ended. The filesystem is the cure, and .NET's door to it is a trio of
static toolboxes (in reach already, thanks to ImplicitUsings): **`File`**,
**`Directory`**, and **`Path`**.

```csharp
Directory.CreateDirectory("notes");                    // safe if it already exists
string path = Path.Combine("notes", "journal.txt");    // notes\journal.txt on Windows
File.WriteAllText(path, "Day 1: read the csproj\n");   // create or REPLACE
File.AppendAllText(path, "Day 2: tamed the CLI\n");    // add to the end
```

Three habits worth underlining. `Path.Combine` joins folder and file with
the right separator for the OS — hardcoding `"notes/journal.txt"` works
until it doesn't; let `Path` do the joining. Written lines end with `"\n"` —
files don't add newlines for you. And the big one: **`WriteAllText`
replaces the whole file; `AppendAllText` stacks onto it.** That difference
is why this program starts with `WriteAllText`: run it five times and the
journal still holds exactly two entries. Start with an append instead and
every run would quietly double the file — a classic bug in real log-writing
code. Begin each run from a known state.

Reading back is symmetrical:

```csharp
string[] entries = File.ReadAllLines(path);   // one array element per line
```

— plus `File.Exists(path)` to ask before touching, and `File.ReadAllText`
when you'd rather have one big string than lines.

All of this lands in the workspace folder you inspected in lesson 2: after
a run, `notes/` genuinely sits there next to `bin/` and `obj/`.

### Your goal

Print exactly:

```
Day 1: read the csproj
Day 2: tamed the CLI
2 entries on disk
True
```

1. Create a `notes` folder and build the path with
   `Path.Combine("notes", "journal.txt")`.
2. `WriteAllText` the Day 1 line, then `AppendAllText` the Day 2 line.
3. `ReadAllLines`, print each entry, then print `{entries.Length} entries
   on disk`.
4. Finish with `File.Exists(path)`.
