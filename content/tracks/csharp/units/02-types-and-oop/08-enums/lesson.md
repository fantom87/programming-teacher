---
id: 08-enums
title: Enums
language: csharp
runner: local
estMinutes: 15
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Declare a Priority enum (Low, Medium, High), write a ResponseTime method that switch-expressions over it, and print a triage line for three tickets."
docs: [csharp/types-and-variables, csharp/control-flow]
checks:
  - id: triage-lines
    type: stdout
    entry: Program.cs
    match: exact
    value: "Server down: High - respond within 1 hour\nSlow search: Medium - respond within 1 day\nTypo on homepage: Low - respond within 1 week\n"
  - id: real-enum-switch
    type: ai-judge
    rubric: "A Priority enum with members Low, Medium, and High is declared with the enum keyword (not string or int constants). The response time is chosen by a method (or local function) that uses a switch expression or switch statement on the Priority value — not if-chains comparing strings. Each printed line interpolates the enum value itself (so High prints from the variable, not a typed-out string) and the method's result — the words High/Medium/Low and the response times are not hard-coded inside the top-level WriteLines."
hints:
  - "enum Priority { Low, Medium, High } — declare it at the bottom of the file, after methods."
  - "Enums print their name: an interpolated {p} where p is Priority.High prints High."
  - "The mapping is a switch expression: string ResponseTime(Priority p) { return p switch { Priority.High => \"within 1 hour\", Priority.Medium => \"within 1 day\", Priority.Low => \"within 1 week\", _ => \"someday\" }; }"
---
## A type with a guest list

How would you store a support ticket's priority? A string invites disaster —
`"high"`, `"High"`, and `"hgih"` are all equally welcome, and the compiler
shrugs at every one. An int (1, 2, 3) is worse: what's 7? When a value has a
small, fixed menu of options, C# gives the menu its own type — an **enum**:

```csharp
enum Priority
{
    Low,
    Medium,
    High,
}
```

Now `Priority.High` is a real, compiler-checked value. `Priority p = Priority.Hgih`
won't compile. A method taking a `Priority` parameter *cannot* receive
`"banana"`. And enums print as their names — interpolating a variable
holding `Priority.High` prints `High` — which makes them lovely for output.

Enums and the `switch` expression (from the control-flow lesson) are a
matched set:

```csharp
string ResponseTime(Priority p)
{
    return p switch
    {
        Priority.High   => "within 1 hour",
        Priority.Medium => "within 1 day",
        Priority.Low    => "within 1 week",
        _ => "someday",
    };
}
```

Every arm is compiler-checked spelling, and if you leave out a member the
compiler *warns you a case is unhandled* — try deleting the `Medium` arm
and read the message. (The `_` arm stays anyway, because an enum variable
can technically hold unexpected values — belt and suspenders.)

One placement note: an `enum` is a type declaration like a class, so it
lives at the bottom of the file, below your methods.

### Your goal

Produce this triage report:

```
Server down: High - respond within 1 hour
Slow search: Medium - respond within 1 day
Typo on homepage: Low - respond within 1 week
```

1. Declare the `Priority` enum: `Low`, `Medium`, `High`.
2. Write `string ResponseTime(Priority p)` using a switch expression, as
   above.
3. For the three tickets — Server down (High), Slow search (Medium), Typo on
   homepage (Low) — print `{title}: {priority} - respond {ResponseTime(...)}`.
