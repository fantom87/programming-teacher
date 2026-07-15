---
id: 05-loops
title: Loops
language: csharp
runner: local
estMinutes: 15
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Use all three loops: a for loop printing Lap 1..3, a foreach over a planets array, and a while countdown from 3 ending in Liftoff!"
docs: [csharp/control-flow, csharp/collections]
checks:
  - id: all-three-loops
    type: stdout
    entry: Program.cs
    match: exact
    value: "Lap 1\nLap 2\nLap 3\nMercury\nVenus\nEarth\n3\n2\n1\nLiftoff!\n"
hints:
  - "for (int i = 1; i <= 3; i++) { ... } — start, keep-going condition, step."
  - "foreach (string planet in planets) { ... } visits each element in order."
  - "In the while loop, decrement inside the body (countdown--) or it never ends."
---
## Three loops, three jobs

C# gives you three loops, and each has a natural habitat.

The `for` loop is for counting. Its header packs the whole plan into one line —
where to start, when to keep going, how to step:

```csharp
for (int i = 1; i <= 3; i++)
{
    Console.WriteLine($"Lap {i}");
}
```

The `foreach` loop is for walking a collection — no counter, no index, just
"give me each element in turn":

```csharp
string[] planets = { "Mercury", "Venus", "Earth" };
foreach (string planet in planets)
{
    Console.WriteLine(planet);
}
```

That `string[]` is an **array**: a fixed-size row of values, all the same type
(more on these in two lessons). Notice `foreach` even tells you the element
type — every `planet` is a `string`, guaranteed by the compiler.

The `while` loop runs as long as a condition holds — perfect when you don't
know the count in advance. It's also the easiest to get stuck in: if nothing
in the body changes the condition, the loop runs forever. The runner will cut
you off with a timeout if that happens; just fix the loop and re-run.

> **Heads-up**: first Run compiles (~10s). Later runs are quick.

### Your goal

Produce this exact output using all three loops:

```
Lap 1
Lap 2
Lap 3
Mercury
Venus
Earth
3
2
1
Liftoff!
```

1. A `for` loop printing `Lap 1` through `Lap 3`.
2. A `foreach` over the starter's `planets` array.
3. A `while` counting `3, 2, 1` down from the starter's `countdown` variable,
   then print `Liftoff!` after the loop.
