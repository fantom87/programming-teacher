---
id: 03-aggregation-and-grouping
title: Aggregation and Grouping
language: sql
runner: browser
estMinutes: 16
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Three aggregate drills: a whole-catalog roll-up that shows COUNT(*) and COUNT(column) disagreeing, a GROUP BY filtered with HAVING, and an era report that counts a subset with CASE inside SUM."
docs: [sql/aggregate-functions, sql/group-by-and-having, sql/filtering-with-where]
checks:
  - id: aggregation-output
    type: stdout
    entry: query.sql
    match: exact
    value: "albums | dated | artists | avg_price | top_price\n------------------------------------------------\n7 | 6 | 4 | 26.48 | 34.75\n\nartist_id | titles | catalog_value\n----------------------------------\n2 | 2 | 56.20\n1 | 2 | 52.70\n3 | 2 | 49.50\n\nera | titles | premium | avg_price\n----------------------------------\nback catalog | 3 | 0 | 21.22\nrecent | 3 | 3 | 31.58\nundated | 1 | 1 | 26.95\n"
  - id: aggregates-not-arithmetic
    type: ai-judge
    rubric: "Query 1 is a single ungrouped SELECT over albums whose five columns are COUNT(*), COUNT(year), COUNT(DISTINCT artist_id), AVG(price) and MAX(price) — the NULL year is excluded by COUNT(year) itself, not by a WHERE clause, and no count or average is typed as a literal. Query 2 filters the GROUPS with HAVING COUNT(*) > 1 — not with a WHERE clause and not by listing artist ids. Query 3 groups by a CASE expression producing the three era labels and counts the premium albums with a conditional aggregate (SUM(CASE WHEN price >= 24 THEN 1 ELSE 0 END), or COUNT with a CASE that yields NULL otherwise) inside the same single grouped query — not with extra queries, a second pass, or a WHERE that would drop the non-premium rows from the titles count."
hints:
  - "COUNT(*) counts rows; COUNT(expr) counts non-NULL values — that is the whole difference between albums and dated. Wrap the two money columns in printf('%.2f', ...) as before."
  - "WHERE filters rows before grouping, HAVING filters groups after: GROUP BY artist_id HAVING COUNT(*) > 1. Sort on the raw SUM(price), not the printf'd text, or 9.50 would sort after 56.20."
  - "Conditional aggregation is CASE inside the aggregate: SUM(CASE WHEN price >= 24 THEN 1 ELSE 0 END) AS premium. SQLite lets you GROUP BY the alias era, so you write the CASE once."
---
## One row per group, and not one row more

An aggregate collapses many rows into one. `GROUP BY` decides how many
piles you collapse into; with no `GROUP BY`, the whole table is one
pile.

Rapid recall:

```sql
COUNT(*)              -- rows
COUNT(year)           -- rows where year IS NOT NULL
COUNT(DISTINCT x)     -- distinct non-NULL values of x
```

Every aggregate except `COUNT(*)` **ignores NULL**, which is usually
what you want and occasionally a trap: `AVG(price)` divides by the
number of non-NULL prices, not by the row count. An aggregate over zero
rows returns `NULL`, not `0` — `COALESCE` it when a report needs a
number.

`WHERE` and `HAVING` are not interchangeable. Filter *rows* before
grouping with `WHERE`; filter *groups* after with `HAVING`. Keeping that
straight is easier if you keep the logical order in mind, which is not
the order you type:

```
FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY
```

That order also explains two SQLite conveniences. Column aliases are
invented in `SELECT`, so standard SQL will not let you use them in
`WHERE` or `GROUP BY` — SQLite is lenient and allows it in `GROUP BY`,
`HAVING` and `ORDER BY`. Handy here; do not assume it elsewhere.

The move worth practising most is **conditional aggregation**: a `CASE`
*inside* the aggregate counts a subset without a second query, and
without a `WHERE` that would distort every other column.

### Your goal

Three queries in `query.sql`, in this order:

1. Whole-catalog row: `albums`, `dated`, `artists`, `avg_price`,
   `top_price`.
2. `artist_id`, `titles`, `catalog_value` for artists with more than one
   album, richest catalog first.
3. One row per era — `undated`, `recent` (2022+), `back catalog` — with
   `titles`, `premium` (how many priced 24 or more) and `avg_price`.

```
albums | dated | artists | avg_price | top_price
------------------------------------------------
7 | 6 | 4 | 26.48 | 34.75

artist_id | titles | catalog_value
----------------------------------
2 | 2 | 56.20
...

era | titles | premium | avg_price
----------------------------------
back catalog | 3 | 0 | 21.22
...
```
