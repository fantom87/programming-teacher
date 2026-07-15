---
id: 08-your-first-class
title: Your First Class
language: csharp
runner: local
estMinutes: 18
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Define a Dog class with name and age fields, a constructor that sets them, and a Describe method — then create two dogs and describe both."
docs: [csharp/classes-and-objects]
checks:
  - id: two-dogs-described
    type: stdout
    entry: Program.cs
    match: exact
    value: "Rex is 3 years old.\nBella is 5 years old.\n"
  - id: real-class
    type: ai-judge
    rubric: "The code defines a class with fields (or properties) that are set by a constructor taking parameters, plus an instance method that uses those fields; the top-level code creates at least two instances with new and calls the method on each — output is not hard-coded at the top level."
hints:
  - "Shape: class Dog { string name; int age; public Dog(string name, int age) { ... } }"
  - "Inside the constructor, this.name = name; tells the field apart from the parameter."
  - "Create instances with new Dog(\"Rex\", 3) and call rex.Describe(); the class goes below the top-level statements."
---
## Blueprints for your own types

`string`, `int`, `List<string>` — you've been using types other people
designed. A **class** is how you design your own. It bundles data (fields) with
behavior (methods) into a blueprint you can stamp out copies of:

```csharp
class Dog
{
    string name;
    int age;

    public Dog(string name, int age)
    {
        this.name = name;
        this.age = age;
    }

    public void Describe()
    {
        Console.WriteLine($"{name} is {age} years old.");
    }
}
```

Three pieces to notice. The **fields** (`name`, `age`) are variables every dog
carries around. The **constructor** — the method named after the class — runs
once when a dog is built, and `this.name` means "the field, not the parameter".
And `Describe` is an **instance method**: it reads whichever dog it's called on.

Using the blueprint:

```csharp
Dog rex = new Dog("Rex", 3);
rex.Describe();
```

Each `new` stamps out an independent **instance** with its own field values —
two dogs, two names, no crosstalk. Placement rule, same as methods: the class
definition lives at the bottom of the file, below the top-level statements.

> **Heads-up**: first Run compiles (~10s). Later runs are quick.

### Your goal

1. Define the `Dog` class: `name` and `age` fields, a constructor that sets
   both, and a `Describe` method printing `{name} is {age} years old.`
2. At the top, create `Rex` (age 3) and `Bella` (age 5) and call `Describe` on
   each, producing:

```
Rex is 3 years old.
Bella is 5 years old.
```
