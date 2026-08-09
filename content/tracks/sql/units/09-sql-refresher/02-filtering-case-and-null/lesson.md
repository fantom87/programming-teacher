---
id: 02-filtering-case-and-null
title: Filtering, CASE and NULL
language: sql
runner: browser
estMinutes: 15
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Three filtering drills: BETWEEN plus IN on the catalog, a not-US query that deliberately survives the NULL country, and a CASE expression that buckets every album into a price tier."
docs: [sql/filtering-with-where, sql/sorting-and-limiting, sql/select-basics]
checks:
  - id: filtering-output
    type: stdout
    entry: query.sql
    match: exact
    value: "title | year | price\n--------------------\nSlow Tide | 2022 | 28.75\nVerre | 2021 | 21.45\nPaper Lantern | 2019 | 23.95\n\nname | country\n--------------\nMarek Duval | NULL\nSolaine | FR\nThe Ember Hours | UK\n\ntitle | year | tier\n-------------------\nAsh & Ivory | 2018 | budget\nPaper Lantern | 2019 | budget\nVerre | 2021 | budget\nBleu Nuit | 2023 | premium\nLong Winter | 2023 | premium\nNocturne | unknown | standard\nSlow Tide | 2022 | standard\n"
  - id: null-aware-filtering
    type: ai-judge
    rubric: "Query 1 expresses the range with BETWEEN and the artist set with IN — not a chain of >= / <= comparisons and not artist_id = 1 OR artist_id = 2. Query 2 keeps the NULL-country artist by testing IS NULL explicitly (country IS NULL OR country <> 'US', or an equivalent such as COALESCE(country,'') <> 'US'); it does not rely on <> 'US' alone, which would silently drop that row. Query 3 uses a single searched CASE expression whose WHEN branches are ordered high threshold first, with an ELSE for the remainder, and replaces the missing year with COALESCE (or IFNULL) rather than a second CASE. Album titles, tiers and years are never hardcoded as literal result rows."
hints:
  - "BETWEEN is inclusive on both ends, and IN takes a value list: WHERE year BETWEEN 2019 AND 2022 AND artist_id IN (1, 2). The NULL year fails the range test, so Nocturne drops out on its own."
  - "country <> 'US' is UNKNOWN for the NULL row, and WHERE only keeps TRUE — so the row vanishes. Say what you mean: WHERE country IS NULL OR country <> 'US'."
  - "One searched CASE, most specific threshold first: CASE WHEN price >= 30 THEN 'premium' WHEN price >= 24 THEN 'standard' ELSE 'budget' END AS tier. And COALESCE(year, 'unknown') AS year — SQLite is happy to return a number from one branch and text from the other."
---
## Three-valued logic, still waiting to bite you

`WHERE` keeps rows where the predicate is **TRUE**. Not TRUE-or-UNKNOWN
— TRUE. That one sentence explains every NULL bug you have ever
shipped:

```sql
WHERE country <> 'US'   -- drops the artist whose country is NULL
WHERE country IS NULL OR country <> 'US'   -- what you meant
```

`NULL` is not a value you can compare to; it is the absence of one.
`= NULL` and `<> NULL` are both UNKNOWN, which is why `IS NULL` exists.
The same trap sits inside `NOT IN`: if the list contains a single
`NULL`, `x NOT IN (...)` can never be TRUE, and the query returns
nothing at all. `NOT EXISTS` does not have that problem — you will use
it in lesson five.

The rest is vocabulary you already own, worth typing once more:

- `BETWEEN a AND b` — inclusive at both ends.
- `IN (…)` — set membership, and its list can be a subquery.
- `LIKE` — `%` for any run, `_` for exactly one; ASCII-case-insensitive
  in SQLite by default.
- `COALESCE(x, fallback)` — the first non-NULL argument wins.

And `CASE` is an **expression**, not a statement: it belongs anywhere a
value belongs — the projection, `ORDER BY`, even inside an aggregate.
Branches are tested top to bottom, so order them most specific first.

### Your goal

Three queries in `query.sql`, in this order:

1. `title`, `year`, `price` for 2019–2022 albums by artist 1 or 2 —
   `BETWEEN` and `IN`, newest first, ties broken by title.
2. `name`, `country` for every artist who is not a US artist. The
   unknown country counts as not-US.
3. `title`, `year` (`unknown` when missing), and a `tier`: `premium` at
   30 and up, `standard` at 24 and up, otherwise `budget` — ordered by
   tier, then title.

```
title | year | price
--------------------
Slow Tide | 2022 | 28.75
...

name | country
--------------
Marek Duval | NULL
...

title | year | tier
-------------------
Ash & Ivory | 2018 | budget
...
```
