---
id: 03-constructors-and-initialization
title: Constructors and Initialization
language: csharp
runner: local
estMinutes: 15
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Give Ticket two constructors — a parameterless one chaining defaults via : this(...) and a (name, price) one — then create a standard, a VIP, and (via object-initializer syntax) a Kids ticket, describing each."
docs: [csharp/classes-and-objects]
checks:
  - id: three-tickets
    type: stdout
    entry: Program.cs
    match: exact
    value: "General entry: $25\nVIP: $75\nKids: $10\n"
  - id: real-initialization
    type: ai-judge
    rubric: "Ticket defines two constructors: one taking name and price, and a parameterless one that supplies the General entry / 25 defaults — ideally by chaining with : this(\"General entry\", 25). The Kids ticket is created with object-initializer syntax (new Ticket { Name = ..., Price = ... }), not a third constructor. Each printed line comes from a method or interpolation reading the instance's own properties — the three output strings are not hard-coded WriteLines at the top level."
hints:
  - "Two constructors can share a name as long as their parameter lists differ — that's overloading."
  - "Chain defaults instead of repeating them: public Ticket() : this(\"General entry\", 25) { }"
  - "Object-initializer syntax sets properties right after construction: new Ticket { Name = \"Kids\", Price = 10 }"
---
## Three ways to build an object

You've written one constructor per class so far. Real classes are more
hospitable — they offer several doors in.

**Door one: overloaded constructors.** A class can define multiple
constructors as long as their parameter lists differ. The compiler picks by
what you pass:

```csharp
public Ticket() { ... }                          // new Ticket()
public Ticket(string name, double price) { ... } // new Ticket("VIP", 75)
```

**Door two: constructor chaining.** If the parameterless version just wants
defaults, don't repeat the assignment code — forward to the big constructor
with `: this(...)`:

```csharp
public Ticket() : this("General entry", 25)
{
}
```

Read it as "before my (empty) body runs, call my sibling with these
arguments." Defaults now live in exactly one place, which is where bugs
don't breed.

**Door three: object initializers.** For settable properties, C# offers
initialization *syntax* — no extra constructor required:

```csharp
Ticket kids = new Ticket { Name = "Kids", Price = 10 };
```

The order matters and is worth knowing: the parameterless constructor runs
first (setting the defaults), *then* the listed properties are overwritten.
You'll meet this syntax constantly in real codebases — it's the standard way
to configure options objects.

Which door when? Constructor parameters for things an object *can't exist
without*; initializers for optional knobs. Ticket price is arguably both —
today we're practicing all three doors on one small class.

### Your goal

Build `Ticket` (properties `Name`, `Price`, and a `Describe` method printing
`{Name}: ${Price}`), then create three tickets — `new Ticket()`,
`new Ticket("VIP", 75)`, and a Kids/$10 ticket via an object initializer —
and describe each:

```
General entry: $25
VIP: $75
Kids: $10
```
