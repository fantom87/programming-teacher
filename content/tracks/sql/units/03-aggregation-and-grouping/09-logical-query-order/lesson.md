---
id: 09-logical-query-order
title: The Order SQL Really Runs In
language: sql
runner: browser
estMinutes: 18
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Write one query that exercises the whole pipeline in order — FROM, WHERE on rated sales, GROUP BY item, HAVING for repeat sellers, an aggregating SELECT, and ORDER BY on a SELECT alias — to see why each clause can only reach what already exists."
docs: [sql/group-by-and-having, sql/sorting-and-limiting]
checks:
  - id: repeat-seller-report
    type: stdout
    entry: query.sql
    match: exact
    value: "item | sales | revenue | avg_rating\n-----------------------------------\nlatte | 2 | 112.5 | 4\ncroissant | 2 | 68.25 | 4.5\nsourdough loaf | 2 | 67.5 | 4\n"
  - id: full-pipeline
    type: ai-judge
    rubric: "A single SELECT over sales using every clause in the standard order: WHERE rating IS NOT NULL (a row-level filter), GROUP BY item, HAVING COUNT(*) >= 2 (a group-level filter using an aggregate), a SELECT list of COUNT(*), SUM(qty * unit_price) and ROUND(AVG(rating), 2), and ORDER BY revenue descending. The unrated rows are not excluded inside HAVING or a CASE, the repeat-seller condition is not moved into WHERE, and no items, totals, or ratings are typed as literals."
hints:
  - "Build it clause by clause, running as you go: get the grouped report working first, then add WHERE, then HAVING, then the sort. Each step should still run."
  - "Decide where each condition belongs by what it is about. 'This sale has a rating' describes one row — WHERE. 'This item sold at least twice' describes a whole group — HAVING COUNT(*) >= 2."
  - "ORDER BY runs after SELECT, so it can see your aliases: ORDER BY revenue DESC works even though revenue is only named in the SELECT list."
---
## Six clauses, one pipeline

You now have every clause of an aggregate query. Time for the idea that makes
them click together — because SQL does **not** run them in the order you write
them. You write `SELECT` first; SQL runs it nearly last.

The real order:

```
FROM      →  get the rows
WHERE     →  throw some rows away
GROUP BY  →  pile the survivors up
HAVING    →  throw some piles away
SELECT    →  compute the output columns
ORDER BY  →  sort the finished rows
```

Every rule you've hit this unit falls out of that list.

*Why can't `WHERE` use an aggregate?* Because it runs before `GROUP BY` — at
that moment there are no groups, so `SUM` has nothing to sum. That's why
`HAVING` exists: same kind of condition, two stops later.

*Why can `ORDER BY` use a `SELECT` alias when `WHERE` can't?* Because sorting
happens after the SELECT list has been computed, so `revenue` is a real column
by then. Up in `WHERE`, that name hasn't been invented yet. (SQLite is
unusually forgiving and will let you use an alias in `WHERE` anyway. Most other
databases reject it, so treat it as a local dialect quirk rather than a habit.)

*Why must every SELECT column be grouped or aggregated?* Because by the time
`SELECT` runs, a row **is** a whole pile. There's no single `item` left to
return unless the pile was built from one.

Reading a query in pipeline order also makes unfamiliar SQL far easier: start
at `FROM`, follow the rows as they get filtered, gathered, filtered again, and
finally shaped. It's a conveyor belt, not a paragraph.

### Your goal

The bakery's repeat-seller report. Consider only sales that carry a rating; one
row per item; keep only items that sold at least twice; show the sale count,
the revenue, and the average rating to two decimals — best revenue first.

```
item | sales | revenue | avg_rating
-----------------------------------
latte | 2 | 112.5 | 4
croissant | 2 | 68.25 | 4.5
sourdough loaf | 2 | 67.5 | 4
```

Every clause you've learned, in one query, in order. That's the unit.
