---
id: 01-syntax-and-types-sprint
title: Syntax and Types Sprint
language: csharp
runner: local
estMinutes: 15
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Six micro-drills, twelve exact lines: formatted interpolation, TryParse, integer vs cast division, a relational switch expression, default and named arguments, and null-coalescing — every value computed."
docs: [csharp/types-and-variables, csharp/control-flow, csharp/methods]
checks:
  - id: sprint-output
    type: stdout
    entry: Program.cs
    match: exact
    value: "pay: 290.00\nparse 42 -> 42\nparse 4x -> -1\nint: 3\ncast: 3.5\n91 -> A\n84 -> B\n70 -> C\n12 -> F\ncs:refresher\nunit:drill\nmaybe: -1\n"
  - id: idiomatic-csharp
    type: ai-judge
    rubric: "Drill 2 uses int.TryParse with an out variable and a conditional (?:) or equivalent — no try/catch, no int.Parse. Drill 3's 3.5 comes from casting exactly one int operand to double before dividing, not from double literals. Grade is a single switch expression with relational patterns (>= 90 etc.), not an if/else chain, and the four score lines come from looping a collection of scores — not four hand-typed WriteLines with letter literals. Tag declares prefix with a default value of \"cs\" and the second call passes it as a named argument (prefix: \"unit\"). The last line applies ?? to an int? that is actually null. pay is computed as hours * rate with :F2; none of the outputs 290.00, 3.5, A/B/C/F, or -1 (except as the ?? fallback and TryParse fallback operands) are typed inside output strings."
hints:
  - "Drill 2 in one line per input: int value = int.TryParse(raw, out int parsed) ? parsed : -1; — TryParse returns bool and fills the out variable only on success."
  - "Grade: score switch { >= 90 => \"A\", >= 80 => \"B\", >= 70 => \"C\", _ => \"F\" } — arms are tried top to bottom, discard catches the rest."
  - "Defaults live in the signature: string Tag(string name, string prefix = \"cs\") => $\"{prefix}:{name}\"; — call as Tag(\"refresher\") and Tag(\"drill\", prefix: \"unit\")."
---
## Shake the rust off

You knew all of this once. The sprint rebuilds finger memory: six drills,
each a single idea, all graded byte-for-byte.

The muscle list:

- **Interpolation carries expressions and formats**: `$"{hours * rate:F2}"`
  computes *and* formats in one go.
- **Parsing without exceptions**: `int.TryParse(text, out int n)` returns
  `bool` and never throws — pair it with `?:` for a fallback.
- **Integer division truncates**: `7 / 2` is `3`. Promote *one* operand —
  `(double)a / b` — and you get `3.5`.
- **Switch expressions** with relational patterns replaced the `if` ladder:
  `score switch { >= 90 => "A", ... }`.
- **Default + named arguments**: defaults sit in the signature; call sites
  can name any parameter to skip or clarify.
- **Nullable values**: `int?` may hold nothing; `??` supplies the answer
  when it does.

Local methods can sit below the code that calls them — top-level programs
read top-down, helpers last, like the rest of this track.

### Your goal

Work the starter's six drills in order to produce exactly:

```
pay: 290.00
parse 42 -> 42
parse 4x -> -1
int: 3
cast: 3.5
91 -> A
84 -> B
70 -> C
12 -> F
cs:refresher
unit:drill
maybe: -1
```

Drill 1 ships in the starter. The checker demands `TryParse` (no
`Parse`, no `try`), a one-operand cast, a relational switch expression
fed by a loop, a default parameter passed by name, and `??` — the fast
idioms, not workarounds.
