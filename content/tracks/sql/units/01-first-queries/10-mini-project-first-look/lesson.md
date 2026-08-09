---
id: 10-mini-project-first-look
title: "Mini-Project: First Look"
language: sql
runner: browser
estMinutes: 25
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Profile the unfamiliar trade_ins table with five first-look queries: list the tables, describe its columns, peek at three rows, collect its distinct conditions, and build an aliased listing with a computed shelf price."
docs: [sql/what-is-a-database, sql/select-basics, sql/sorting-and-limiting]
checks:
  - id: full-profile
    type: stdout
    entry: query.sql
    match: exact
    value: "name\n----\nbooks\ntrade_ins\n\ncid | name | type | notnull | dflt_value | pk\n---------------------------------------------\n0 | id | INTEGER | 0 | NULL | 1\n1 | title | TEXT | 0 | NULL | 0\n2 | condition | TEXT | 0 | NULL | 0\n3 | offer | REAL | 0 | NULL | 0\n\nid | title | condition | offer\n------------------------------\n1 | Kindred | good | 3.25\n2 | The Dispossessed | fair | 1.75\n3 | Station Eleven | good | 4.25\n\ncondition\n---------\nfair\ngood\nmint\npoor\n\nlisting | shelf_price\n---------------------\nKindred (good) | 8.13\nThe Dispossessed (fair) | 4.38\nStation Eleven (good) | 10.63\nWatership Down (poor) | 1.88\nThe Overstory (mint) | 15.63\nPiranesi (good) | 13.13\nSlaughterhouse-Five (fair) | 5.63\nThe Fifth Season (good) | 11.88\n"
  - id: right-tool-per-part
    type: ai-judge
    rubric: "Five statements, each using the intended tool against the database rather than typed-in results: (1) SELECT name FROM sqlite_master ordered by name; (2) PRAGMA table_info(trade_ins); (3) SELECT * FROM trade_ins with ORDER BY id and LIMIT 3 — the star, not four named columns; (4) SELECT DISTINCT condition FROM trade_ins ordered by condition; (5) a query over trade_ins whose listing column concatenates title, ' (', condition and ')' with || and whose shelf_price column is ROUND(offer * 2.5, 2), both named with AS and ordered by id. No result is hardcoded with VALUES or a UNION of literals."
hints:
  - "Work one numbered comment at a time and hit Run after each — a broken statement anywhere stops the whole script, so a small mistake is easiest to find while it's the newest thing you wrote."
  - "Parts 1 and 2 are schema questions: SELECT name FROM sqlite_master ORDER BY name; and PRAGMA table_info(trade_ins);. Parts 3 and 4 are lesson 9 and lesson 8 applied to a new table."
  - "Part 5 combines three lessons: title || ' (' || condition || ')' AS listing, then ROUND(offer * 2.5, 2) AS shelf_price, then FROM trade_ins ORDER BY id. Mind the spaces inside the quoted pieces."
---
## First look at a strange table

A crate of customer trade-ins turned up at The Bindery, and somebody
logged them into a new table called `trade_ins`. Nobody wrote down what's
in it. This is the normal condition of data work — you meet a dataset
before you meet its documentation — and there's a routine for it, made of
exactly the queries you've learned this unit.

One new tool first. SQLite keeps a table that describes its own tables,
called `sqlite_master`, and you can query it like anything else:

```sql
SELECT name
FROM sqlite_master
ORDER BY name;
```

That answers *"what's in here at all?"* — the question before every other
question. From there: what columns and types (`PRAGMA table_info`), what
a few rows actually look like (`SELECT *` with `LIMIT`), and what
vocabulary lives in the columns that matter (`DISTINCT`). Only then are
you ready to compute anything.

That last step is where the shop earns money. The Bindery shelves a
trade-in at **two and a half times** what it paid, so the crate needs a
listing: a readable label and a price, both built by the database rather
than by anyone with a calculator.

### Your goal

Five statements in `query.sql`, in this order — the starter file has a
numbered comment for each:

1. **What tables exist?** Just the `name` column of `sqlite_master`,
   alphabetical.
2. **What's in `trade_ins`?** Its column names, types, and key.
3. **Show me three rows.** Every column, ordered by `id`, capped at three.
4. **What conditions turn up?** Each one once, alphabetical.
5. **The listing.** For every trade-in, ordered by `id`: a `listing`
   column reading `Kindred (good)`, and a `shelf_price` column of
   `offer * 2.5` rounded to two places.

The result, all five sets in order:

```
name
----
books
trade_ins

cid | name | type | notnull | dflt_value | pk
---------------------------------------------
0 | id | INTEGER | 0 | NULL | 1
...

id | title | condition | offer
------------------------------
1 | Kindred | good | 3.25
...

condition
---------
fair
good
mint
poor

listing | shelf_price
---------------------
Kindred (good) | 8.13
The Dispossessed (fair) | 4.38
...
```

Nothing here is typed by hand — every value is the database answering.
That's the whole unit in one script: look before you ask, then ask well.
