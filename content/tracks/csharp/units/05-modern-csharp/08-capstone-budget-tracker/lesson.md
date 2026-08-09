---
id: 08-capstone-budget-tracker
title: "Capstone: Budget Tracker"
language: csharp
runner: local
estMinutes: 35
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Turn a seeded month of Transaction records into a fully computed budget report — fix a typo with a with expression, format money with your own extension method, label every line with one pattern-matching switch, and break spending down with GroupBy."
docs: [csharp/classes-and-objects, csharp/control-flow, csharp/linq-basics]
checks:
  - id: report-header
    type: stdout
    entry: Program.cs
    match: contains
    value: "== Budget Report =="
  - id: income-line
    type: stdout
    entry: Program.cs
    match: contains
    value: "Income: +2600.00"
  - id: spent-line
    type: stdout
    entry: Program.cs
    match: contains
    value: "Spent: -1619.25"
  - id: net-line
    type: stdout
    entry: Program.cs
    match: contains
    value: "Net: +980.75"
  - id: category-food
    type: stdout
    entry: Program.cs
    match: contains
    value: "food: 444.25"
  - id: corrected-coffee
    type: stdout
    entry: Program.cs
    match: contains
    value: "Day 24 Coffee: -8.00 [everyday]"
  - id: big-ticket-label
    type: stdout
    entry: Program.cs
    match: contains
    value: "Day 12 Concert tickets: -180.00 [big ticket]"
  - id: avoidable-label
    type: stdout
    entry: Program.cs
    match: contains
    value: "Day 28 Late fee: -35.00 [avoidable]"
  - id: modern-csharp-throughout
    type: ai-judge
    rubric: "The Day 24 correction happens in code with a `with` expression replacing that ledger entry (the seed literal still reads -80.00m, and Transaction remains an immutable positional record — no setters added). Income, Spent, and Net are computed from the ledger with LINQ (Where/Sum or equivalent), with Net derived from the data, and the numbers 2600.00, 1619.25, 980.75, 444.25 never typed inside output strings. The category section iterates a GroupBy over the expense transactions, printing each group's Key with its absolute summed amount formatted :F2. Signed is a genuine extension method on decimal (top-level static class, `this` modifier) used for the signed amounts in both the headline and ledger sections. Label is one switch expression using property/relational patterns — an Amount > 0 arm for income, a Category \"fees\" arm for avoidable, an Amount below -150 arm for big ticket, and a discard for everyday — with no if/else chain, and the ledger section is one loop over the ledger calling it."
hints:
  - "Part 0 first and alone, then run: ledger[6] = ledger[6] with { Amount = -8.00m }; — replace the record, don't edit the seed line. The coffee row should now show -8.00."
  - "Signed: public static string Signed(this decimal amount) => amount >= 0 ? $\"+{amount:F2}\" : $\"{amount:F2}\"; — negatives already carry their minus sign, so only the plus needs adding."
  - "Label(Transaction t) => t switch { { Amount: > 0m } => \"income\", { Category: \"fees\" } => \"avoidable\", { Amount: < -150m } => \"big ticket\", _ => \"everyday\" }; — decimal constants in patterns need the m suffix."
---
## The budget tracker

This unit's features aren't party tricks — together they're a *style*.
Records shape the data, `with` corrects it, patterns classify it,
extensions give it vocabulary, and LINQ does the arithmetic. The capstone
is one month of `Transaction` records turned into a report where — as
always — **every number is computed**. The seed ledger is the only data.

**Part 0 — the correction.** The Day 24 coffee was fat-fingered as
`-80.00`; it was really `-8.00`. Records are immutable, so you don't edit
it — you *replace* it with a changed copy: `ledger[6] = ledger[6] with
{ Amount = -8.00m };`. Leave the seed literal exactly as it is; the fix
happens in code, the way an audit trail would want it.

**Part 1 — headline.** `Income:` (sum of positive amounts), `Spent:` (sum
of negatives), `Net:` — every figure printed through `Signed`, an extension
method on `decimal` you'll write: `+2600.00` for positives, `-1619.25`
style for negatives, always two decimals.

**Part 2 — by category.** `GroupBy` over the *expense* transactions only:
each category with its absolute total, `:F2`, in first-seen order.

**Part 3 — the ledger.** Every transaction on one line, labeled by
`Label(t)` — a single switch expression: positive amount `income`;
category `"fees"` `avoidable`; below `-150` `big ticket`; otherwise
`everyday`.

### Your goal

Produce exactly (blank line between sections):

```
== Budget Report ==
Income: +2600.00
Spent: -1619.25
Net: +980.75

-- By category --
housing: 900.00
food: 444.25
transport: 60.00
fun: 180.00
fees: 35.00

-- Ledger --
Day 1 Paycheck: +2600.00 [income]
Day 3 Rent: -900.00 [big ticket]
Day 5 Groceries: -240.50 [big ticket]
Day 9 Bus pass: -60.00 [everyday]
Day 12 Concert tickets: -180.00 [big ticket]
Day 18 Groceries: -195.75 [big ticket]
Day 24 Coffee: -8.00 [everyday]
Day 28 Late fee: -35.00 [avoidable]
```

Work in order: correction, `Signed`, headline, categories, `Label`,
ledger — running after each part. An AI reviewer will confirm the `with`
expression, the extension method, the patterns, and that nothing is
hardcoded. Ship it, and the Intermediate tier is yours.
