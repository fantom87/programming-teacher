---
id: 01-records
title: Records
language: csharp
runner: local
estMinutes: 15
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Declare a one-line positional record, prove its value equality and free ToString, then use a with expression to make a changed copy while the original stays untouched."
docs: [csharp/classes-and-objects, csharp/types-and-variables]
checks:
  - id: record-behaviors
    type: stdout
    entry: Program.cs
    match: exact
    value: "True\nSong { Title = Clair de Lune, Artist = Debussy, Seconds = 300 }\nSong { Title = Clair de Lune, Artist = Debussy, Seconds = 312 }\n300\n"
  - id: real-record
    type: ai-judge
    rubric: "Song is declared as a one-line positional record — record Song(string Title, string Artist, int Seconds); — not a class with hand-written properties, Equals, or ToString. The True line comes from comparing two separately constructed Song instances with ==. remaster is built with a `with` expression on the original (not by calling the constructor again with 312), and the final 300 is printed by reading the original record's Seconds property after the with expression ran."
hints:
  - "One line, no body, placed after the top-level code: record Song(string Title, string Artist, int Seconds); — the compiler writes the constructor, the properties, equality, and ToString."
  - "Records compare by content: construct the same song twice and Console.WriteLine(original == cover) prints True. With a class it would print False."
  - "The copy: Song remaster = original with { Seconds = 312 }; — then Console.WriteLine(original.Seconds) still prints 300, because with never touches the original."
---
## The class you never wanted to write

Think about how much C# you have written for types that just *hold data*:
three properties, a constructor to set them, and if you wanted two equal
values to *compare* equal, an `Equals` override too. Forty lines of ceremony
for "a title, an artist, and a length." Modern C# compresses the whole thing
into one line:

```csharp
record Song(string Title, string Artist, int Seconds);
```

That's a **record** — a class whose job is *being data*. The compiler
generates the constructor and the properties, plus three behaviors an
ordinary class doesn't get:

**Value equality.** Two records with the same contents are equal — `==`
compares fields, not references. Two `Song`s of the same recording *are* the
same song, the way two `int` 5s are the same number.

**Immutability.** The generated properties are `init`-only: set at
construction, read-only forever after. Nothing can quietly change a `Song`
you're holding.

**Non-destructive mutation.** Immutable doesn't mean frozen — you change a
record by making a *changed copy*:

```csharp
Song remaster = original with { Seconds = 312 };
```

`remaster` is a new record, identical except `Seconds`; `original` is
untouched, which everyone else holding it will appreciate. Records even
print themselves — `Console.WriteLine(song)` gives
`Song { Title = ..., Artist = ... }`, free readable output.

When to reach for which? The working rule: **record for data, class for
behavior and identity**. A song, a transaction, a point — records. A bank
account with rules and a lifetime — still a class.

### Your goal

Produce exactly:

```
True
Song { Title = Clair de Lune, Artist = Debussy, Seconds = 300 }
Song { Title = Clair de Lune, Artist = Debussy, Seconds = 312 }
300
```

1. Declare the one-line `Song` record (after the top-level code).
2. Construct the same song twice — `original` and `cover`, both
   `("Clair de Lune", "Debussy", 300)` — and print `original == cover`.
3. Print `original` itself.
4. Build `remaster` with a `with` expression setting `Seconds` to `312`,
   and print it.
5. Print `original.Seconds` — proof the copy never touched it.
