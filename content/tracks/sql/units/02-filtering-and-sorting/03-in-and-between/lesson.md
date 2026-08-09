---
id: 03-in-and-between
title: IN and BETWEEN
language: sql
runner: browser
estMinutes: 12
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Replace a chain of ORs with IN and a pair of comparisons with BETWEEN, then write a second query that uses BETWEEN on dates to list February's arrivals."
docs: [sql/filtering-with-where]
checks:
  - id: two-reports
    type: stdout
    entry: query.sql
    match: exact
    value: "name | category | price\n-----------------------\nBamboo Board | kitchen | 18.75\nEspresso Cups | kitchen | 22.25\nLeather Journal | paper | 24.75\n\nname | added\n------------\nBamboo Board | 2026-02-02\nWool Blanket | 2026-02-11\nFountain Pen | 2026-02-22\n"
  - id: used-in-and-between
    type: ai-judge
    rubric: "The first query uses IN with a list of the two category values and BETWEEN for the price range — no chained OR over categories, and no separate >= / <= pair for price. The second query uses BETWEEN on the added column with two quoted date strings. Both queries end with ORDER BY id, and neither hardcodes product names or dates in the SELECT list."
hints:
  - "IN takes a parenthesised list of values: category IN ('kitchen', 'paper'). It is exactly a chain of ORs, spelled once."
  - "BETWEEN takes two bounds joined by AND, and it includes both ends: price BETWEEN 10 AND 30 is the same as price >= 10 AND price <= 30."
  - "For the second query, dates are stored as 'YYYY-MM-DD' text, which sorts and compares like a calendar: WHERE added BETWEEN '2026-02-01' AND '2026-02-28'. Remember the ORDER BY id on both queries, and the semicolon that separates them."
---
## Saying it once

Look at what a three-aisle filter costs you with the tools you have:

```sql
WHERE category = 'kitchen' OR category = 'home' OR category = 'paper'
```

The column name appears three times, the operator three times, and if
you ever add a fourth aisle you'll edit the clause in a fourth place.
`IN` says the same thing once:

```sql
WHERE category IN ('kitchen', 'home', 'paper')
```

*Is this row's category one of these?* That's it — a parenthesised,
comma-separated list of values. `NOT IN` flips it, and the list can be as
long as you like. Later, when you meet subqueries, that list can even be
another query's results; the syntax you're learning now is the same.

Ranges get the same treatment. This pair of comparisons:

```sql
WHERE price >= 10 AND price <= 30
```

becomes:

```sql
WHERE price BETWEEN 10 AND 30
```

One thing to burn in: **`BETWEEN` includes both ends.** A product priced
at exactly 10.00 or exactly 30.00 is in. That's usually what you want for
prices and almost never what you want for timestamps, which is a trap for
another day.

`BETWEEN` isn't only for numbers. SQLite has no dedicated date type — it
stores dates as `'YYYY-MM-DD'` text — and that format was chosen
precisely so text comparison behaves like calendar comparison.
`'2026-02-11'` really is between `'2026-02-01'` and `'2026-02-28'`, so
date ranges are just `BETWEEN` on strings.

Neither keyword makes your query faster. They make it *shorter and
harder to get wrong*, which on a clause you'll re-read a hundred times is
the better trade.

### Your goal

Two queries in `query.sql`, each ending in `ORDER BY id`.

1. Kitchen or paper products priced from 10 to 30 — `name`, `category`,
   `price` — using `IN` and `BETWEEN`.
2. Everything the shop added in February 2026 — `name`, `added`.

```
name | category | price
-----------------------
Bamboo Board | kitchen | 18.75
Espresso Cups | kitchen | 22.25
Leather Journal | paper | 24.75

name | added
------------
Bamboo Board | 2026-02-02
Wool Blanket | 2026-02-11
Fountain Pen | 2026-02-22
```

Two result sets, blank line between — that's one run, two questions
answered.
