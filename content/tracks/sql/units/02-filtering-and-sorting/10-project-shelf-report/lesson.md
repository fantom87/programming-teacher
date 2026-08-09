---
id: 10-project-shelf-report
title: "Project: The Monday Shelf Report"
language: sql
runner: browser
estMinutes: 25
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Write the shop's three-part Monday report in one file — a featured shelf filtered with IN and BETWEEN and labeled by CASE, a restock list sorted by scarcity, and a top-three rated table that excludes the unreviewed."
docs: [sql/filtering-with-where, sql/sorting-and-limiting]
checks:
  - id: part-1-featured-shelf
    type: stdout
    entry: query.sql
    match: contains
    value: "name | price | tier\n-------------------\nFountain Pen | 45.35 | premium\nCast Iron Skillet | 34.95 | premium\nLeather Journal | 24.75 | standard\nBamboo Board | 18.75 | standard\n"
  - id: part-2-restock-list
    type: stdout
    entry: query.sql
    match: contains
    value: "name | stock\n------------\nEspresso Cups | 0\nWool Blanket | 5\nFountain Pen | 8\n"
  - id: part-3-top-rated
    type: stdout
    entry: query.sql
    match: contains
    value: "name | rating\n-------------\nWool Blanket | 4.9\nCast Iron Skillet | 4.8\nLeather Journal | 4.6\n"
  - id: whole-report-in-order
    type: stdout
    entry: query.sql
    match: exact
    value: "name | price | tier\n-------------------\nFountain Pen | 45.35 | premium\nCast Iron Skillet | 34.95 | premium\nLeather Journal | 24.75 | standard\nBamboo Board | 18.75 | standard\n\nname | stock\n------------\nEspresso Cups | 0\nWool Blanket | 5\nFountain Pen | 8\n\nname | rating\n-------------\nWool Blanket | 4.9\nCast Iron Skillet | 4.8\nLeather Journal | 4.6\n"
  - id: every-row-earned
    type: ai-judge
    rubric: "Three SELECT statements over the products table, in report order, with no product name, price, stock, rating, or tier typed as a literal anywhere in a SELECT list. Query 1 filters with category IN over the two aisles, price BETWEEN its two bounds, and a stock test, and builds tier from a single CASE expression with an ELSE arm — not chained ORs, not a >= plus <= pair, not a hardcoded label per row. Query 2 filters on the stock column and sorts by stock then name. Query 3 excludes unrated products with rating IS NOT NULL (never rating <> NULL or a comparison to 0), sorts by rating descending with name as a tiebreaker, and takes exactly three rows with LIMIT rather than by naming the winners. Every query ends with an ORDER BY that leaves no two rows tied."
hints:
  - "Build it one query at a time and hit Run after each — the first check turns green on its own, and a broken query 2 can't hide a working query 1. Part 1 reuses last lesson's CASE verbatim; the only new work is the three-condition WHERE."
  - "Part 1: WHERE category IN ('kitchen', 'paper') AND price BETWEEN 10 AND 50 AND stock > 0, ORDER BY price DESC. Four rows — the 9.45 mug misses the range, and the espresso cups are out of stock. Part 2: WHERE stock < 10, ORDER BY stock, name."
  - "Part 3 is the top-N pattern with a NULL guard: WHERE rating IS NOT NULL ORDER BY rating DESC, name LIMIT 3. Without the guard the unrated products sort to the bottom under DESC and never reach the top three anyway — but say it out loud, because the day a rating of 5.0 arrives, silence becomes a bug."
---
## The report the owner actually asks for

Monday morning at the Corner Shelf. The owner wants to know three
things before opening: *what should be on the front table, what am I
about to run out of, and what are people actually loving?* You've built
every piece of that answer over the last nine lessons — filtering,
ranges, `NULL`, sorting, top-N, `CASE`. This is where they stop being
nine exercises and become one deliverable.

Three queries, one file, in order. Each ends with a semicolon and gets
its own result block in the output; the blank lines between them come
free. The rule for the whole thing: **the database decides every row and
every label.** If a product name or a tier appears as text in your
`SELECT` list, you've written a report that lies the moment stock
changes.

And every query ends with a **total** `ORDER BY` — enough keys that no
two rows can tie — because a report you can't reproduce byte for byte
isn't a report, it's a screenshot.

### Your goal

**Part 1 — the featured shelf.** Products from the `kitchen` or `paper`
aisles, priced from 10 to 50, with stock on hand. Show `name`, `price`,
and the `tier` label from the last lesson (`budget` under 10, `standard`
under 30, `premium` otherwise). Priciest first.

**Part 2 — the restock list.** Anything with fewer than 10 units left:
`name` and `stock`, scarcest first, `name` breaking ties.

**Part 3 — top rated.** The three highest-rated products, unreviewed ones
excluded: `name` and `rating`, best first, `name` breaking ties.

```
name | price | tier
-------------------
Fountain Pen | 45.35 | premium
Cast Iron Skillet | 34.95 | premium
Leather Journal | 24.75 | standard
Bamboo Board | 18.75 | standard

name | stock
------------
Espresso Cups | 0
Wool Blanket | 5
Fountain Pen | 8

name | rating
-------------
Wool Blanket | 4.9
Cast Iron Skillet | 4.8
Leather Journal | 4.6
```

Note the pen: featured *and* nearly gone. That's the report doing its
job. Ship it, and Filtering and Sorting is behind you.
