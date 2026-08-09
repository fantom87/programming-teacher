---
id: 01-inserting-rows
title: Inserting Rows
language: sql
runner: browser
estMinutes: 12
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Add three coffees to the roastery shelf — one with its own INSERT, two more in a single multi-row INSERT — then prove it happened with a SELECT ordered by id."
docs: [sql/inserting-and-updating, sql/creating-tables]
checks:
  - id: shelf-after-inserts
    type: stdout
    entry: query.sql
    match: exact
    value: "id | name | origin\n------------------\n1 | Morning Ritual | Ethiopia\n2 | Deep Well | Sumatra\n3 | Half Past Four | Colombia\n4 | Night Shift | Brazil\n5 | Sunday Slow | Kenya\n6 | Cold Snap | Guatemala\n7 | Last Call | Peru\n"
  - id: one-multi-row-insert
    type: ai-judge
    rubric: "query.sql adds the rows with INSERT INTO coffees ... VALUES statements. Cold Snap and Last Call arrive in ONE statement — a single VALUES clause holding two comma-separated tuples — not two separate INSERTs. No statement supplies an id value; the column is left out so SQLite assigns it. The script ends with a SELECT against the coffees table that carries ORDER BY id."
hints:
  - "The shape is INSERT INTO coffees (column, column, ...) VALUES (value, value, ...); — the two lists must be the same length, in the same order."
  - "Text goes in single quotes ('Kenya'), numbers do not (17.45). Leave id out of the column list entirely; SQLite assigns the next one."
  - "A multi-row insert writes the column list once, then follows VALUES with tuples separated by commas: VALUES ('Cold Snap', 'Guatemala', 'medium', 15.25, 30), ('Last Call', 'Peru', 'dark', 13.95, 6);"
---
## Writing, not just reading

Every query you've written so far has been a question. `SELECT` asks, the
database answers, and nothing on disk changes. This unit is about the
statements that *change* things — starting with the friendliest of them.

`INSERT` adds rows:

```sql
INSERT INTO coffees (name, origin, roast, price, bags)
VALUES ('Sunday Slow', 'Kenya', 'light', 17.45, 18);
```

Two lists, lined up one to one: the columns you intend to fill, then the
values that fill them. The order is yours to choose, as long as both
lists agree — `(origin, name)` with `('Kenya', 'Sunday Slow')` is the
very same row.

Adding several rows? Don't repeat the statement. One `VALUES` clause
takes as many parenthesised rows as you like:

```sql
INSERT INTO coffees (name, origin, roast, price, bags) VALUES
  ('Cold Snap', 'Guatemala', 'medium', 15.25, 30),
  ('Last Call', 'Peru',      'dark',   13.95,  6);
```

One trip to the database instead of two. On a real table that difference
is the whole afternoon.

Notice what you *didn't* type: `id`. The column is declared `INTEGER
PRIMARY KEY`, so SQLite hands out the next number itself. Let it.

An `INSERT` prints nothing at all. Silence means success — unnerving the
first few times — so build the habit right now: **a script that changes
data ends with a SELECT that shows the result.**

That closing SELECT needs one more thing. Without `ORDER BY`, SQL makes
*no promise whatsoever* about row order; you get rows in whatever order
was convenient. It may look sorted today and shuffle tomorrow. So every
verifying query in this unit ends with `ORDER BY` — usually `ORDER BY
id`, which shows new arrivals stacking up at the bottom.

### Your goal

Insert `Sunday Slow` (Kenya, light, 17.45, 18 bags) alone, then `Cold
Snap` (Guatemala, medium, 15.25, 30) and `Last Call` (Peru, dark, 13.95,
6) together, and print the shelf:

```
id | name | origin
------------------
1 | Morning Ritual | Ethiopia
2 | Deep Well | Sumatra
3 | Half Past Four | Colombia
4 | Night Shift | Brazil
5 | Sunday Slow | Kenya
6 | Cold Snap | Guatemala
7 | Last Call | Peru
```
