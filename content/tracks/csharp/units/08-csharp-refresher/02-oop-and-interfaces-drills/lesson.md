---
id: 02-oop-and-interfaces-drills
title: OOP and Interfaces Drills
language: csharp
runner: local
estMinutes: 18
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "The payroll driver is finished; you build the type system beneath it — an abstract base implementing an interface, two subclasses (one overriding a virtual), and an unrelated class signing the same contract."
docs: [csharp/classes-and-objects, csharp/interfaces]
checks:
  - id: payroll-output
    type: stdout
    entry: Program.cs
    match: exact
    value: "Ada: 7500.00 (employee)\nGrace: 4000.00 (hourly employee)\nCleanCo: 450.00 (vendor)\ntotal: 11950.00\n"
  - id: real-hierarchy
    type: ai-judge
    rubric: "Employee is an abstract class implementing IPayable: its constructor stores the name in a get-only property, MonthlyCost is declared abstract with no body, and Kind is a virtual property returning \"employee\". Salaried overrides MonthlyCost as the stored annual figure / 12 and does NOT override Kind; Hourly overrides both MonthlyCost (rate * hours) and Kind (\"hourly employee\") using the override keyword. Vendor implements IPayable directly with no Employee inheritance. The driver block and the IPayable declaration are unmodified. Derived figures (7500.00, 4000.00, 11950.00) are computed in properties or the driver loop, never typed as literals; no property has a public setter."
hints:
  - "The base holds the shared machinery: abstract class Employee : IPayable { protected Employee(string name) => Name = name; public string Name { get; } public abstract decimal MonthlyCost { get; } public virtual string Kind => \"employee\"; }"
  - "Subclasses store their own numbers and compute on demand: class Salaried : Employee { private readonly decimal annual; public Salaried(string name, decimal annual) : base(name) => this.annual = annual; public override decimal MonthlyCost => annual / 12; }"
  - "Vendor signs the contract from scratch — implement Name, MonthlyCost, and Kind itself (get-only, set in the constructor; Kind => \"vendor\"). No base class: interfaces are for capability, not family."
---
## Contract on top, family below

The classic .NET shape in one file: an **interface** names the capability
(`IPayable` — anything payroll can cut a check to), an **abstract class**
holds the shared machinery for one *family* of implementors, and unrelated
types sign the interface directly. The driver never learns which is which
— that's the point.

Rapid recap:

- `abstract` members declare *what* without *how*; subclasses **must**
  `override`. `virtual` members supply a default; subclasses *may*.
- A get-only auto-property (`public string Name { get; }`) can be assigned
  only in its constructor — immutability without ceremony.
- `: base(name)` forwards constructor arguments up the chain.
- A class implementing an interface repeats nothing from any hierarchy —
  `Vendor` is proof that capability cuts across family.

The driver at the top of the starter is done and off-limits: one
`List<IPayable>`, one loop, one computed total. Your types make it
compile.

### Your goal

Produce exactly:

```
Ada: 7500.00 (employee)
Grace: 4000.00 (hourly employee)
CleanCo: 450.00 (vendor)
total: 11950.00
```

1. `abstract class Employee : IPayable` — constructor stores the name,
   `MonthlyCost` stays abstract, `Kind` is virtual (`"employee"`).
2. `Salaried` — annual figure / 12; inherits `Kind`.
3. `Hourly` — rate × hours; overrides `Kind` to `"hourly employee"`.
4. `Vendor : IPayable` — no `Employee` blood, flat monthly cost,
   `"vendor"`.

Every number below the seed data is computed. No public setters anywhere.
