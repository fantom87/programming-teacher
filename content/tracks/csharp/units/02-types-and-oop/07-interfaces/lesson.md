---
id: 07-interfaces
title: Interfaces
language: csharp
runner: local
estMinutes: 15
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Declare an IAlarm interface with a Ring method, implement it in three unrelated classes (Rooster, Phone, Neighbor), and ring them all from one List<IAlarm>."
docs: [csharp/interfaces, csharp/collections]
checks:
  - id: alarms-ring
    type: stdout
    entry: Program.cs
    match: exact
    value: "Wake-up service:\nCock-a-doodle-doo!\nBeep beep beep!\nVrrrrrm. Vrrrrrm.\n"
  - id: real-interface
    type: ai-judge
    rubric: "An interface named IAlarm is declared with the interface keyword containing a void Ring() signature. Rooster, Phone, and Neighbor each implement it via : IAlarm with a public Ring method, and none of the three classes inherits from a shared base class. The top-level code collects all three into one List<IAlarm> and rings them by looping over that list — not by calling Ring on three separate variables line by line."
hints:
  - "interface IAlarm { void Ring(); } — signatures only, no bodies, no fields."
  - "Implementing looks like inheriting: class Phone : IAlarm { public void Ring() { ... } } — the method must be public."
  - "The payoff: List<IAlarm> alarms = new List<IAlarm>(); add all three, then foreach (IAlarm alarm in alarms) { alarm.Ring(); }"
---
## Contracts, not family

Inheritance says "Dog *is an* Animal" — a family relationship with shared
machinery. But some abilities cut across families entirely. A rooster, a
phone, and your neighbor's lawnmower share no ancestor worth naming, yet all
three can wake you up. For "these types can do X, never mind what they
*are*," C# has the **interface**:

```csharp
interface IAlarm
{
    void Ring();
}
```

An interface is a pure contract: method signatures with no bodies, no
fields, no constructors. (The `I` prefix is a C# naming convention — you'll
see `IEnumerable`, `IDisposable` everywhere in .NET.) A class signs the
contract with the same colon syntax as inheritance:

```csharp
class Phone : IAlarm
{
    public void Ring()
    {
        Console.WriteLine("Beep beep beep!");
    }
}
```

Signing means *promising*: implement every member the interface lists, as
`public`, or the compiler rejects the class. There's nothing to inherit —
the interface gave you obligations, not machinery.

So when do you reach for which? An **abstract class** is for a real family
that shares code (`Describe` written once). An **interface** is for a
capability that unrelated types can each promise in their own way — and
since a class can implement *many* interfaces but extend only one base
class, capabilities compose freely.

The polymorphism payoff is identical, and just as sweet: a `List<IAlarm>`
happily holds a bird, a gadget, and a neighbor, and a single loop rings
whatever showed up.

### Your goal

Produce:

```
Wake-up service:
Cock-a-doodle-doo!
Beep beep beep!
Vrrrrrm. Vrrrrrm.
```

1. Declare `interface IAlarm` with `void Ring();`.
2. Implement it in three unrelated classes: `Rooster`
   (`Cock-a-doodle-doo!`), `Phone` (`Beep beep beep!`), and `Neighbor`
   (`Vrrrrrm. Vrrrrrm.`).
3. Print the `Wake-up service:` header, then ring all three from a single
   `List<IAlarm>` loop.
