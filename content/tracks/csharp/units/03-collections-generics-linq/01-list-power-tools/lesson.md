---
id: 01-list-power-tools
title: List Power Tools
language: csharp
runner: local
estMinutes: 12
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Grow, shrink, search, and sort a task list: Add and Remove items, print Count and a Contains check, then Sort the list and print every task."
docs: [csharp/collections]
checks:
  - id: list-operations-output
    type: stdout
    entry: Program.cs
    match: exact
    value: "3\nTrue\nCompile report\nEmail Dana\nFix login bug\n"
hints:
  - "tasks.Add(\"Compile report\") appends; tasks.Remove(\"Water plants\") deletes by value."
  - "Contains returns a bool — print it directly and C# writes True or False."
  - "tasks.Sort(); reorders the list in place (alphabetically for strings) — then foreach to print each one."
---
## Beyond Add

In Fast Foundations, your `List<T>` did two things: `Add` and `Count`. Real
lists lead busier lives — items leave, get looked up, get reordered. The good
news: it's all built in.

```csharp
List<string> crew = new List<string> { "Ada", "Grace" };

crew.Add("Linus");            // append to the end
crew.Remove("Ada");           // delete by value (first match)
crew.Insert(0, "Marge");      // squeeze in at an index
Console.WriteLine(crew.Contains("Grace"));   // True
Console.WriteLine(crew.IndexOf("Linus"));    // 2
```

Two of these deserve a closer look. `Remove` searches for the value and
deletes the first match — it returns `true` if it found one, so you can react
when it didn't. `Contains` answers "is it in there?" without telling you
where; when you *do* need the position, `IndexOf` gives it (or `-1` for "not
found").

Then there's the crowd-pleaser:

```csharp
crew.Sort();
```

One call, and the list rearranges itself in place — alphabetically for
strings, ascending for numbers. Notice what you *didn't* write: no loop, no
swapping, no algorithm. Collections carry their own power tools, and knowing
which tool exists is half of professional C#.

One habit to build now: when you print a `bool` like the result of
`Contains`, C# writes `True` and `False` with capital letters. Worth
remembering when output must match exactly.

### Your goal

Start from the three-item task list in the starter and produce exactly:

```
3
True
Compile report
Email Dana
Fix login bug
```

1. `Add` the task `Compile report`.
2. `Remove` the task `Water plants` — it can wait.
3. Print the list's `Count`, then print whether it `Contains` `Fix login bug`.
4. `Sort` the list, then `foreach`-print every task.
