---
id: 07-linq-aggregation-and-grouping
title: Aggregation and Grouping
language: csharp
runner: local
estMinutes: 18
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Collapse an order list into answers: Count with a condition, Sum, Max, a formatted Average — then GroupBy category and print a computed summary line per group."
docs: [csharp/linq-basics]
checks:
  - id: aggregation-output
    type: stdout
    entry: Program.cs
    match: exact
    value: "3\n24\n9\n4.80\ndrink: 3 orders, 11 dollars\nfood: 2 orders, 13 dollars\n"
  - id: computed-with-linq
    type: ai-judge
    rubric: "The four statistics are computed by LINQ aggregation operators on the orders list — Count with a lambda predicate, Sum, Max, and Average with selector lambdas — and the per-category lines come from iterating orders.GroupBy(...) and using each group's Key, Count(), and Sum(). None of the printed numbers (3, 24, 9, 4.80, 11, 13) are hardcoded literals in output strings, and the group lines are not two hand-typed WriteLines."
hints:
  - "Count can take a lambda: orders.Count(o => o.Price >= 4) — it counts only the matches."
  - "Sum/Max/Average take a selector telling them WHICH number: orders.Sum(o => o.Price). Format the average with {...:F2} inside an interpolated string."
  - "foreach (var group in orders.GroupBy(o => o.Category)) — inside, group.Key is the category, and group itself is a sequence you can Count() and Sum(o => o.Price)."
---
## From many to one

`Where` and `Select` turn sequences into other sequences. But reports want
*answers*: how many, how much, what's the biggest? LINQ's **aggregation**
operators collapse a whole sequence into a single value:

```csharp
orders.Count(o => o.Price >= 4)     // how many match?
orders.Sum(o => o.Price)            // total
orders.Max(o => o.Price)            // biggest
orders.Average(o => o.Price)       // mean — returns double
```

The lambdas play a new role here. In `Sum`, the lambda is a *selector*: "for
each order, **which number** should I add up?" And `Count` with a predicate
counts only matches — a filter and a tally in one call. `Average` always
comes back as a `double`, so give it the `:F2` treatment when printing money.

Then there's the operator that powers half the reports in the world:
`GroupBy` sorts elements into labeled buckets.

```csharp
foreach (var group in orders.GroupBy(o => o.Category))
{
    Console.WriteLine($"{group.Key}: {group.Count()} items");
}
```

Each `group` is a small sequence of its own carrying a `.Key` (the category
that bucket shares) — which means every aggregation you just learned works
*per bucket*: `group.Count()`, `group.Sum(o => o.Price)`. Buckets appear in
the order their first member appears in the source, so the output is
predictable.

Group, then aggregate each group — that two-step is the backbone of sales
summaries, log analyses, and leaderboards everywhere.

### Your goal

From the starter's café orders, produce exactly:

```
3
24
9
4.80
drink: 3 orders, 11 dollars
food: 2 orders, 13 dollars
```

1. Print how many orders cost 4 or more.
2. Print the `Sum` of all prices, then the `Max` price.
3. Print the `Average` price formatted with `:F2`.
4. `GroupBy` category; for each group print
   `<key>: <count> orders, <sum> dollars` — every number computed.
