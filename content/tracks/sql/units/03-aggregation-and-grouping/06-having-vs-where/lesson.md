---
id: 06-having-vs-where
title: HAVING Versus WHERE
language: sql
runner: browser
estMinutes: 15
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Use both filters in one query: WHERE keeps only counter sales before grouping, and HAVING keeps only the categories whose grouped revenue clears 100."
docs: [sql/group-by-and-having, sql/filtering-with-where]
checks:
  - id: strong-counter-categories
    type: stdout
    entry: query.sql
    match: exact
    value: "category | sales | revenue\n--------------------------\nbread | 3 | 102\ndrink | 2 | 160\n"
  - id: right-filter-in-the-right-place
    type: ai-judge
    rubric: "One SELECT over sales with GROUP BY category. The channel = 'counter' restriction is in a WHERE clause (before grouping) and the revenue > 100 restriction is in a HAVING clause containing the aggregate SUM(qty * unit_price). The aggregate condition is not moved into WHERE, the channel condition is not moved into HAVING, and pastry is not excluded by naming it in a filter or by a LIMIT — it drops out because its grouped revenue is below the threshold."
hints:
  - "Two filters, two clauses. Row-level facts (channel = 'counter') belong in WHERE; group-level facts (a summed revenue) belong in HAVING."
  - "The clause order is fixed: FROM, WHERE, GROUP BY, HAVING, ORDER BY. Writing HAVING before GROUP BY is a syntax error."
  - "HAVING SUM(qty * unit_price) > 100 — repeat the aggregate expression there. Some databases let you use the alias instead; SQLite does, but spelling out the aggregate always works."
---
## Filtering rows, then filtering groups

You already know `WHERE`. Here's the thing nobody tells you until it bites:
`WHERE` cannot see an aggregate. Try to keep only the busy categories like this
and SQLite stops you cold:

```sql
WHERE SUM(qty * unit_price) > 100   -- error: misuse of aggregate
```

The refusal makes sense once you know when each clause runs. `WHERE` runs
**before** grouping — it's deciding which individual rows are even allowed into
the piles. At that moment no group exists yet, so no group total exists either.
Asking for a sum there is asking a question about something that hasn't been
built.

`HAVING` is the filter that runs **after** the aggregates:

```sql
SELECT category, SUM(qty * unit_price) AS revenue
FROM sales
GROUP BY category
HAVING SUM(qty * unit_price) > 100;
```

Same syntax as `WHERE`, different moment. It's the only place an aggregate is
allowed in a condition, and it throws away whole groups rather than individual
rows.

The two work happily together, and a query using both reads like a pipeline:

```sql
WHERE channel = 'counter'    -- keep these rows
GROUP BY category            -- pile them up
HAVING SUM(...) > 100        -- keep these groups
```

Which is why the choice is never really about syntax. Ask yourself what the
condition is *about*. "This sale happened at the counter" is a fact about one
row — `WHERE`. "This category earned over 100" is a fact about a whole pile —
`HAVING`. Put a row condition in `HAVING` and it usually still works but scans
more data than it needs to; put a group condition in `WHERE` and it simply
won't run.

### Your goal

Counter sales only. One row per category with its sale count and revenue,
keeping just the categories that cleared 100. Sorted by category.

```
category | sales | revenue
--------------------------
bread | 3 | 102
drink | 2 | 160
```

Pastry made just as many counter sales as bread and still missed the cut — its
tickets are simply smaller.
