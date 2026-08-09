---
id: 04-group-by
title: One Row Per Group
language: sql
runner: browser
estMinutes: 14
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Break the bakery's totals out by category with GROUP BY: one row per category showing its sale count and its revenue (qty * unit_price summed), sorted by category so the result is reproducible."
docs: [sql/group-by-and-having, sql/aggregate-functions]
checks:
  - id: revenue-by-category
    type: stdout
    entry: query.sql
    match: exact
    value: "category | sales | revenue\n--------------------------\nbread | 4 | 124.5\ndrink | 3 | 182.5\npastry | 5 | 141.5\n"
  - id: grouped-and-ordered
    type: ai-judge
    rubric: "A single SELECT over sales using GROUP BY category, with COUNT(*) for the sale count and SUM(qty * unit_price) for revenue, plus an explicit ORDER BY on the category. The revenue is summed from the qty and unit_price columns rather than typed, no per-category totals are hardcoded, and the three categories are not fetched with three separate WHERE-filtered queries combined by UNION."
hints:
  - "Start from the whole-table version — SELECT COUNT(*), SUM(qty * unit_price) FROM sales; — then add GROUP BY category and put category first in the SELECT list."
  - "Revenue per row is qty * unit_price, so the group's revenue is SUM(qty * unit_price). Aggregates happily take an expression, not just a bare column."
  - "Finish with ORDER BY category. Without it SQLite may hand the groups back in any order, and an exact-output check will fail on a whim."
---
## From one answer to one answer per group

So far every aggregate has crushed the whole table down to a single row. Useful
— but "the bakery took 448.50 this week" isn't a decision you can act on. You want it
split: how much came from pastry, from bread, from drinks?

`GROUP BY` does the splitting. It sorts the rows into piles by the value of a
column, then runs your aggregates **once per pile**:

```sql
SELECT category, COUNT(*) AS sales
FROM sales
GROUP BY category;
```

Three distinct categories, three groups, three rows out. Read `GROUP BY` as
*"one row per..."* and the whole clause stops being mysterious: one row per
category, one row per customer, one row per month.

There's a rule attached, and it's the one beginners bump into. Every column in
your SELECT list must either appear in the `GROUP BY` or sit inside an
aggregate. Ask for `item` alongside `GROUP BY category` and the question is
incoherent — the pastry group contains four different items, so which one did
you want? Group it, or aggregate it.

Aggregates also take expressions, not just bare columns. Revenue lives in two
columns here, so multiply first and sum the result:

```sql
SUM(qty * unit_price) AS revenue
```

The multiplication happens per row, the sum happens per group.

**One habit to build now: always `ORDER BY` a grouped query.** SQL results have
no inherent order. Your groups might come back alphabetically today and in a
different order after the table grows, purely because the engine chose a
different plan. If a query's output is going into a report — or a checker —
say what order you want out loud.

### Your goal

One row per category: the category, how many sales it made, and its revenue.
Sorted by category.

```
category | sales | revenue
--------------------------
bread | 4 | 124.5
drink | 3 | 182.5
pastry | 5 | 141.5
```

Five sales made pastry the busiest counter — but drinks quietly out-earned it.
