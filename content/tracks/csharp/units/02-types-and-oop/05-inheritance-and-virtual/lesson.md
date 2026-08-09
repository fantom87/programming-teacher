---
id: 05-inheritance-and-virtual
title: Inheritance and virtual/override
language: csharp
runner: local
estMinutes: 18
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Derive Dog and Cat from Animal, overriding the virtual Speak method, then put a Dog, a Cat, and a plain Animal in one List<Animal> and make them all speak in a loop."
docs: [csharp/classes-and-objects, csharp/collections]
checks:
  - id: polymorphic-voices
    type: stdout
    entry: Program.cs
    match: exact
    value: "Rex says woof!\nMittens says meow!\nBlob makes a sound.\n"
  - id: real-inheritance
    type: ai-judge
    rubric: "Dog and Cat derive from Animal with : Animal, forward their constructors with : base(name), and each declares its Speak with the override keyword (the base Speak being virtual — neither shadowing with new nor overloading). The top-level code stores all three animals in a single List<Animal> (or Animal[]) and calls Speak inside a loop over that collection — the three lines are produced polymorphically, not by three direct WriteLine or per-variable calls."
hints:
  - "class Dog : Animal — the colon means 'Dog is an Animal, plus whatever it adds'."
  - "Dog's constructor has nothing new to store, so it just forwards: public Dog(string name) : base(name) { }"
  - "Override the base's virtual method: public override void Speak() { Console.WriteLine($\"{Name} says woof!\"); } — then foreach (Animal a in shelter) { a.Speak(); }"
---
## Family trees

Sometimes types genuinely nest: every dog *is an* animal, plus dog-specific
extras. C# writes that relationship with a colon:

```csharp
class Dog : Animal
{
    public Dog(string name) : base(name)
    {
    }
}
```

`Dog : Animal` means Dog **inherits** everything Animal has — its `Name`
property arrives free of charge. Constructors aren't inherited though, so
Dog declares its own and forwards the work with `: base(name)` — same
chaining idea as `: this(...)`, aimed one floor up.

Now the interesting part. The starter's `Animal.Speak` is marked `virtual`:

```csharp
public virtual void Speak() { ... }
```

`virtual` means "children may replace this." A child does so with
`override`:

```csharp
public override void Speak()
{
    Console.WriteLine($"{Name} says woof!");
}
```

Both keywords are mandatory, and that's a feature — the compiler catches you
overriding something that doesn't exist, or accidentally hiding a method you
meant to replace.

Why bother? Because of what it unlocks: a `List<Animal>` can hold dogs, cats,
and plain animals together, and when the loop calls `a.Speak()`, *each object
answers with its own version* — the dog woofs even though the variable's type
is just `Animal`. That's **polymorphism**, and it's the beating heart of OOP:
code that talks to the family can stay blissfully ignorant of which family
member showed up.

### Your goal

The starter gives you `Animal` complete. Add `Dog` and `Cat`, each
overriding `Speak` (`{Name} says woof!` / `{Name} says meow!`), then build a
`List<Animal>` holding `Dog "Rex"`, `Cat "Mittens"`, and `Animal "Blob"`,
and `foreach` over it calling `Speak()`:

```
Rex says woof!
Mittens says meow!
Blob makes a sound.
```
