---
id: 01-query-anatomy-sprint
title: Query Anatomy Sprint
language: sql
runner: browser
estMinutes: 15
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Three single-table drills against the Nightjar Records catalog: a 10%-off sale sheet with printf money, a DISTINCT country list, and a top-3 by price — every one with a deterministic ORDER BY."
docs: [sql/select-basics, sql/sorting-and-limiting, sql/what-is-a-database]
checks:
  - id: sprint-output
    type: stdout
    entry: query.sql
    match: exact
    value: "title | year | sale_price\n-------------------------\nBleu Nuit | 2023 | 31.28\nLong Winter | 2023 | 28.13\nSlow Tide | 2022 | 25.88\nNocturne | NULL | 24.25\nPaper Lantern | 2019 | 21.55\n\ncountry\n-------\nNULL\nFR\nUK\nUS\n\nid | title | price\n------------------\n7 | Bleu Nuit | 34.75\n5 | Long Winter | 31.25\n2 | Slow Tide | 28.75\n"
  - id: computed-not-typed
    type: ai-judge
    rubric: "Three separate single-table SELECT statements. The sale price is computed in SQL as price * 0.9 wrapped in printf('%.2f', ...) and aliased sale_price — no literal prices typed into the query and no ROUND-then-hope. Query 2 uses DISTINCT (not GROUP BY, not a hand-written list of countries). Query 3 gets its three rows from ORDER BY price DESC plus LIMIT, not from a WHERE clause naming prices or ids. Every query ends in an explicit ORDER BY, and each sort key is unambiguous — either unique on its own or followed by a tie-breaking column."
hints:
  - "Aliases and arithmetic both live in the SELECT list: SELECT title, year, price * 0.9 AS sale_price FROM albums WHERE price > 22. Then ORDER BY price DESC — dearest first, and prices are unique here so nothing is left to chance."
  - "Two decimals is a formatting job, not a rounding job: printf('%.2f', price * 0.9). SQLite prints the REAL 31.5 as \"31.5\" — printf is what gets you 31.50."
  - "DISTINCT applies to the whole projection: SELECT DISTINCT country FROM artists ORDER BY country;. NULL is a value here and sorts first. For the top three: ORDER BY price DESC, id LIMIT 3."
---
## The whole shape, in one pass

You know this shape. This unit's job is to put it back in your fingers —
eight drills, minimal talking, output checked byte for byte.

```sql
SELECT   -- the projection: expressions and aliases live here
FROM     -- where the rows come from
WHERE    -- which rows survive
ORDER BY -- the only reason your output has an order
LIMIT    -- how many you keep
```

Three habits worth re-fixing before anything else:

**Rows have no natural order.** SQLite hands back whatever the query
plan produced, and that can change the day someone adds an index. Any
query whose output you care about gets an explicit `ORDER BY` — and if
the sort key has ties, add a second column to break them. `LIMIT`
without `ORDER BY` is a coin flip. Every drill in this unit enforces
that.

**`SELECT` is a projection, not a column list.** Arithmetic, function
calls, concatenation — all legal, all nameable with `AS`.

**Money needs `printf`.** SQLite renders the REAL `31.5` as `31.5`, not
`31.50`. `printf('%.2f', x)` is how you get currency formatting out of
SQLite, and it is what these checks expect.

One more: `DISTINCT` de-duplicates the *whole projection*, not the
column it happens to sit next to.

### Your goal

Three queries in `query.sql`, in this order:

1. **Sale sheet** — `title`, `year`, and `sale_price` (10% off, two
   decimals) for albums over 22, dearest first.
2. **Countries** — the distinct `country` values in `artists`, sorted.
3. **Top three** — `id`, `title`, `price` of the three priciest albums.

```
title | year | sale_price
-------------------------
Bleu Nuit | 2023 | 31.28
...

country
-------
NULL
FR
...

id | title | price
------------------
7 | Bleu Nuit | 34.75
...
```
