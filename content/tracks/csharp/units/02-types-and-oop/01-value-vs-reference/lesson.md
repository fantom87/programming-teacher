---
id: 01-value-vs-reference
title: Value vs Reference Types
language: csharp
runner: local
estMinutes: 15
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Show the difference between copying a value type and copying a reference type: copy an int and change the copy, alias a Player and change it through the alias, then create a truly independent Player with new."
docs: [csharp/types-and-variables, csharp/classes-and-objects]
checks:
  - id: copy-semantics-output
    type: stdout
    entry: Program.cs
    match: exact
    value: "a = 5, b = 6\np1 score: 100, p2 score: 100\nAda: 100, Grace: 7\n"
  - id: real-copies-not-literals
    type: ai-judge
    rubric: "Part 1 copies one int into a second int and mutates only the copy. Part 2 assigns an existing Player variable to a second variable (no new) and mutates the object through the second variable. Part 3 creates a separate Player with new. All three printed lines read the live variables/fields through interpolation — the numbers 6, 100, and 7 are computed or assigned through the story above, not typed directly into the output strings."
hints:
  - "Part 1: int b = a; makes an independent copy — changing b never touches a."
  - "Part 2: Player p2 = p1; copies the reference, so p2.score = 100; changes the one shared object."
  - "Part 3: only new makes a new object — Player solo = new Player(\"Grace\"); solo.score = 7; then print p1.name/p1.score and solo.name/solo.score."
---
## Two kinds of copies

Here's a question that separates people who *use* C# from people who
*understand* it: what does `=` actually copy?

For **value types** — `int`, `double`, `bool` — it copies the value itself.
The copy is independent:

```csharp
int a = 5;
int b = a;     // b gets its own 5
b = b + 1;     // a is untouched
```

For **reference types** — every class, including `List<T>` and the ones you
write — the variable never holds the object itself. It holds a **reference**:
directions to where the object lives. Copying the variable copies the
directions, not the house:

```csharp
Player p1 = new Player("Ada");
Player p2 = p1;       // one object, two variables pointing at it
p2.score = 100;
Console.WriteLine(p1.score);   // 100 — p1 and p2 ARE the same player
```

That's not a bug; it's the design. Objects can be huge, so C# hands around
cheap references instead of copying furniture. The rule worth tattooing
somewhere: **for classes, only `new` creates an object.** Plain `=` never
does — it just points another label at an existing one.

Why care? Because the first time you pass a `List<int>` into a method and the
method sorts it, the *caller's* list is sorted too — same object, different
label. Bugs of this species are baffling until you've internalized today's
lesson, and trivial afterward.

The starter gives you a small `Player` class (with public fields — we'll
upgrade those next lesson).

### Your goal

Produce exactly:

```
a = 5, b = 6
p1 score: 100, p2 score: 100
Ada: 100, Grace: 7
```

1. Copy `int a = 5` into `b`, add 1 to `b`, print both.
2. Make `Player p1` ("Ada"), assign it to `p2`, set `p2.score = 100`, print
   both scores.
3. Make an independent `Player solo` ("Grace") with score 7, then print
   `{name}: {score}` for `p1` and `solo`.
