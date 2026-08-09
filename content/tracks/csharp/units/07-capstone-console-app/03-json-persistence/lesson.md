---
id: 03-json-persistence
title: "Capstone 3: JSON Persistence"
language: csharp
runner: local
estMinutes: 35
timeoutMs: 90000
files:
  - path: Storage.cs
    starter: starter/Storage.cs
  - path: Program.cs
    starter: starter/Program.cs
  - path: Domain.cs
    starter: starter/Domain.cs
  - path: Commands.cs
    starter: starter/Commands.cs
goal: "Give TaskFlow a memory: a Storage layer that serializes the store to tasks.json with System.Text.Json, reads it back into real TaskItem records, and proves the round trip is lossless using record value equality."
docs: [csharp/classes-and-objects, csharp/exceptions]
checks:
  - id: saved-line
    type: stdout
    entry: Program.cs
    match: contains
    value: "saved 5 tasks to tasks.json"
  - id: loaded-line
    type: stdout
    entry: Program.cs
    match: contains
    value: "loaded 5 tasks (3 done)"
  - id: lossless
    type: stdout
    entry: Program.cs
    match: contains
    value: "round trip: identical"
  - id: enum-as-text
    type: stdout
    entry: Program.cs
    match: contains
    value: "\"Priority\": \"High\""
  - id: indented-json
    type: stdout
    entry: Program.cs
    match: contains
    value: "-- First task on disk --\n[\n  {\n    \"Id\": 1,"
  - id: full-session
    type: stdout
    entry: Program.cs
    match: exact
    value: "== TaskFlow v0.3 ==\n5 tasks: 2 done, 3 open\n\n-- Session log --\n> done 3\n  completed #3 Build the domain\n> add docs Low Write the README\n  added #6 Write the README (docs/Low)\n> drop 5\n  removed #5 Polish the UX\n> done 42\n  no task #42\n> sync\n  unknown command: sync\n\n-- Saving --\nsaved 5 tasks to tasks.json\nloaded 5 tasks (3 done)\nround trip: identical\n\n-- First task on disk --\n[\n  {\n    \"Id\": 1,\n    \"Title\": \"Draft the spec\",\n    \"Category\": \"planning\",\n    \"Priority\": \"High\",\n    \"Done\": true\n\n-- Backlog --\n[x] 1 Draft the spec (planning/High)\n[x] 2 Sketch the layers (planning/Medium)\n[x] 3 Build the domain (code/High)\n[ ] 4 Wire persistence (code/Medium)\n[ ] 6 Write the README (docs/Low)\n\n5 tasks: 3 done, 2 open\n"
  - id: real-serialization
    type: ai-judge
    rubric: "Storage.cs writes the file with JsonSerializer.Serialize(store.All, ...) and reads it with JsonSerializer.Deserialize<List<TaskItem>>(...) — the JSON is never assembled or parsed by hand with string concatenation, Split, or Substring. One static readonly JsonSerializerOptions instance is created once and shared by both methods (not a fresh options object per call), with WriteIndented = true and a JsonStringEnumConverter added to Converters, which is why the file shows \"High\" rather than 2. Load checks File.Exists first and returns an empty TaskStore when the file is missing, and handles the null a failed Deserialize can return (?? new List<TaskItem>() or equivalent) so the method never returns null. Storage.cs contains no Console call. Program.cs saves, then loads into a SEPARATE TaskStore variable, prints the verdict from reloaded.All.SequenceEqual(store.All) rather than a hardcoded \"identical\", and the backlog plus the closing counts line are printed from the reloaded store. Every count in the output still comes from a store property."
hints:
  - "Options once, at the top: private static readonly JsonSerializerOptions Options = new() { WriteIndented = true, Converters = { new JsonStringEnumConverter() } }; — building options per call is a documented performance trap, because each instance recreates the serializer's cached metadata."
  - "Save is two lines: string json = JsonSerializer.Serialize(store.All, Options); then File.WriteAllText(path, json);. Load mirrors it: if (!File.Exists(path)) return new TaskStore(new List<TaskItem>()); then Deserialize<List<TaskItem>>(File.ReadAllText(path), Options) ?? new List<TaskItem>()."
  - "The verdict is one interpolation: $\"round trip: {(reloaded.All.SequenceEqual(store.All) ? \"identical\" : \"MISMATCH\")}\" — and the peek is foreach (string line in File.ReadLines(StorePath).Take(7)) Console.WriteLine(line);"
---
## A memory

TaskFlow forgets everything the moment it exits. Today it stops
forgetting — and today's one idea is the **round trip**: objects out to
text, text back to objects, and nothing lost in either direction.

`System.Text.Json` ships with .NET, so there's no package to add:

```csharp
string json = JsonSerializer.Serialize(store.All, Options);
List<TaskItem>? back = JsonSerializer.Deserialize<List<TaskItem>>(json, Options);
```

Two symmetrical calls. Deserialize hands you `List<TaskItem>?` — nullable,
because malformed input legitimately produces `null` — so you coalesce it
away (`?? new List<TaskItem>()`) rather than let a `null` leak into the
domain. And records need no special help: `TaskItem` has one public
constructor, so the serializer feeds the JSON properties straight into
its parameters.

Two details separate a toy from a tool. First, **build your
`JsonSerializerOptions` once** — a `static readonly` field. Each new
instance rebuilds the serializer's cached type metadata, which is the
classic way to make JSON code mysteriously slow. Second, add a
`JsonStringEnumConverter`, or `Priority.High` is written as `2` and your
file becomes a puzzle for anyone reading it — including you, in a year.

`Load` also decides what a missing file *means*. Here it means "no tasks
yet", not "crash": check `File.Exists`, hand back an empty store, and a
first run works like every other run.

Then the proof. Save, load into a *separate* store, and compare:

```csharp
reloaded.All.SequenceEqual(store.All)
```

Records compare by value, so this asks whether every field of every task
survived the trip. `identical` means your persistence is honest. Print
the report from the reloaded store from now on — the app is reading its
own file, exactly as it will after a restart.

### Your goal

Add `Storage`, then produce exactly:

```
== TaskFlow v0.3 ==
5 tasks: 2 done, 3 open

-- Session log --
> done 3
  completed #3 Build the domain
> add docs Low Write the README
  added #6 Write the README (docs/Low)
> drop 5
  removed #5 Polish the UX
> done 42
  no task #42
> sync
  unknown command: sync

-- Saving --
saved 5 tasks to tasks.json
loaded 5 tasks (3 done)
round trip: identical

-- First task on disk --
[
  {
    "Id": 1,
    "Title": "Draft the spec",
    "Category": "planning",
    "Priority": "High",
    "Done": true

-- Backlog --
[x] 1 Draft the spec (planning/High)
[x] 2 Sketch the layers (planning/Medium)
[x] 3 Build the domain (code/High)
[ ] 4 Wire persistence (code/Medium)
[ ] 6 Write the README (docs/Low)

5 tasks: 3 done, 2 open
```
