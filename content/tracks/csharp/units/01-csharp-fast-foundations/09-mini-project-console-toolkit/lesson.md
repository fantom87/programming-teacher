---
id: 09-mini-project-console-toolkit
title: "Mini-Project: Console Toolkit"
language: csharp
runner: local
estMinutes: 25
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Build a unit-converter toolkit: a Toolkit class with three typed conversion methods, called from top-level code to print a header and three computed conversion lines."
docs: [csharp/methods, csharp/classes-and-objects, csharp/types-and-variables]
checks:
  - id: header
    type: stdout
    entry: Program.cs
    match: contains
    value: "== Console Toolkit =="
  - id: km-conversion
    type: stdout
    entry: Program.cs
    match: contains
    value: "100 km = 62.14 miles"
  - id: temperature-conversion
    type: stdout
    entry: Program.cs
    match: contains
    value: "100 C = 212 F"
  - id: time-conversion
    type: stdout
    entry: Program.cs
    match: contains
    value: "3 hours = 180 minutes"
  - id: computed-not-hardcoded
    type: ai-judge
    rubric: "The program defines a class (or at least two typed methods) whose methods take parameters and return the converted values, and the printed conversion lines are built by calling those methods inside interpolated strings — the numeric results (62.14, 212, 180) are computed, not typed literally into the output strings."
hints:
  - "Kilometers to miles: km * 0.621371 — return a double and format it with :F2 when printing."
  - "Celsius to Fahrenheit: c * 9 / 5 + 32. Hours to minutes: hours * 60."
  - "Shape: a Toolkit class below the top-level code, new Toolkit() at the top, then $\"100 km = {kit.KmToMiles(100):F2} miles\"."
---
## Ship something

Time to combine everything from this unit — typed variables, interpolation,
methods, and a class — into one small tool you could genuinely reuse: a
unit converter.

The architecture mirrors real programs in miniature. A `Toolkit` class owns
the knowledge (each conversion is a method with typed parameters and a typed
return value), and the top-level code is just the front desk: create the
toolkit, call methods, present results.

```csharp
Toolkit kit = new Toolkit();
Console.WriteLine($"100 km = {kit.KmToMiles(100):F2} miles");

class Toolkit
{
    public double KmToMiles(double km)
    {
        return km * 0.621371;
    }
}
```

Why bother with methods when you could just print `"62.14"`? Because the
number on the screen should be something the program *computed*, not something
you claimed. Change the input and the output stays honest. The AI reviewer
will check for exactly this — hard-coded results don't count.

The formulas you need: miles are `km * 0.621371`; Fahrenheit is
`c * 9 / 5 + 32`; minutes are `hours * 60`. Note the `:F2` format on the miles
line — real tools don't print `62.137100000000004`.

> **Heads-up**: first Run compiles (~10s). Later runs are quick.

### Your goal

Print a header line `== Console Toolkit ==` followed by three conversion
lines, each computed by a method on your `Toolkit` class:

```
== Console Toolkit ==
100 km = 62.14 miles
100 C = 212 F
3 hours = 180 minutes
```

1. `KmToMiles(double km)` — print for 100 km, formatted `:F2`.
2. `CelsiusToFahrenheit(double c)` — print for 100 C.
3. `HoursToMinutes(int hours)` — print for 3 hours.

Extra conversions are welcome — this is your toolkit, after all.
