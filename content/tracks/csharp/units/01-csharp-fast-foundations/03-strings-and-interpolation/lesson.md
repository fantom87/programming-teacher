---
id: 03-strings-and-interpolation
title: Strings and Interpolation
language: csharp
runner: local
estMinutes: 12
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Use string interpolation to print three lines: Hello, Ada!, Next year you'll be 37. (computed from age 36), and Total: 39.98 (price 19.99 doubled, formatted with :F2)."
docs: [csharp/types-and-variables]
checks:
  - id: interpolated-output
    type: stdout
    entry: Program.cs
    match: exact
    value: "Hello, Ada!\nNext year you'll be 37.\nTotal: 39.98\n"
hints:
  - "An interpolated string starts with a dollar sign: $\"Hello, {name}!\""
  - "The braces can hold any expression: {age + 1} computes before printing."
  - "{price * 2:F2} formats the result with exactly two decimal places."
---
## Building strings the readable way

Gluing text together with `+` gets ugly fast: `"Hello, " + name + "!"` is a
punctuation minefield. C#'s answer is **string interpolation** — put a `$`
before the opening quote, and anything inside `{braces}` gets evaluated and
dropped into the text:

```csharp
string city = "Oslo";
int temp = -3;
Console.WriteLine($"It's {temp} degrees in {city}.");
```

The braces take *any expression*, not just variable names — `{temp + 10}`,
`{name.ToUpper()}`, whatever you need. The computation happens right where the
value appears in the sentence, which makes the code read like the output.

Interpolation also handles formatting. After the expression, a colon
introduces a **format specifier**:

```csharp
double total = 7.5;
Console.WriteLine($"Owed: {total:F2}");   // Owed: 7.50
```

`F2` means "fixed-point, two decimal places" — essential for money, where
`7.5` looks like a typo and `7.50` looks like a price.

> **Heads-up**: the first Run compiles first — give it ~10 seconds. Later
> runs are quicker, but still take a few seconds.

### Your goal

Starting from the three variables in the starter file (`name`, `age`,
`price`), print exactly:

```
Hello, Ada!
Next year you'll be 37.
Total: 39.98
```

Rules of the game: line 2 must *compute* `{age + 1}`, and line 3 must compute
`{price * 2}` and format it with `:F2`. No hard-coded 37 or 39.98 allowed.
