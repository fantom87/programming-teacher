---
id: 08-returning
title: RETURNING What Changed
language: sql
runner: browser
estMinutes: 14
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Make three silent writes talk: an INSERT that hands back the id the database assigned, an UPDATE that reports the new bag count, and a DELETE that shows the row on its way out."
docs: [sql/inserting-and-updating, sql/deleting-data]
checks:
  - id: three-receipts
    type: stdout
    entry: query.sql
    match: exact
    value: "id | name\n---------\n6 | Harbor Light\n\nname | bags\n-----------\nDeep Well | 24\n\nname | origin\n-------------\nNight Shift | Brazil\n\nid | name | bags\n----------------\n1 | Morning Ritual | 24\n2 | Deep Well | 24\n3 | Half Past Four | 40\n5 | Cloud Cover | 15\n6 | Harbor Light | 20\n"
  - id: receipts-from-returning
    type: ai-judge
    rubric: "Each of the three write statements carries its own RETURNING clause — the INSERT returns id and name, the UPDATE returns name and bags, the DELETE returns name and origin. None of those three result sets is produced by a separate SELECT run before or after the write, and the id 6 is never typed as a literal. The UPDATE targets Deep Well by name and adds 12 to the existing bags rather than assigning 24."
hints:
  - "RETURNING goes at the very end of the statement, listing columns the way a SELECT would: INSERT INTO coffees (...) VALUES (...) RETURNING id, name;"
  - "An UPDATE ... RETURNING reports the row as it is AFTER the change, so UPDATE coffees SET bags = bags + 12 WHERE name = 'Deep Well' RETURNING name, bags; prints 24, not 12."
  - "A DELETE ... RETURNING is your only chance to see the row — it is gone the moment the statement finishes. Then close with SELECT id, name, bags FROM coffees ORDER BY id;"
---
## Making a write talk back

Writes are silent. An `INSERT` that adds a row and an `INSERT` that adds
nothing look identical from the outside: no output, no complaint. That's
why every script in this unit has ended with a verifying `SELECT`.

But a follow-up `SELECT` has a blind spot. Consider:

```sql
INSERT INTO coffees (name, origin, roast, price, bags)
VALUES ('Harbor Light', 'Honduras', 'medium', 15.95, 20);
```

The database just assigned this row an `id`. What is it? You didn't
choose it, and you can't reliably ask afterwards — querying for the
highest id is a guess that breaks the moment anyone else is inserting
too.

`RETURNING` closes the gap. Bolt it onto any write and the statement
hands back the rows it touched:

```sql
INSERT INTO coffees (name, origin, roast, price, bags)
VALUES ('Harbor Light', 'Honduras', 'medium', 15.95, 20)
RETURNING id, name;
```

One statement: the row goes in, and its brand-new `id` comes straight
back. This is how applications learn the key of the thing they just
created — the single most useful thing `RETURNING` does.

It works on all three writes, and each one answers a different question:

- `UPDATE ... RETURNING name, bags` shows the row **after** the change,
  so you see the result of `bags = bags + 12` without computing it
  yourself.
- `DELETE ... RETURNING name, origin` shows the row as it goes. This is
  your only chance to look at it — a receipt for something that no longer
  exists.

Two notes before you use it. A `RETURNING` clause can't take an `ORDER
BY`, so when a write touches many rows their order isn't guaranteed;
treat multi-row output as a set, not a list. And `RETURNING` reports only
what your own statement did — for the state of the whole table, you still
want a closing `SELECT`.

### Your goal

Three writes, each with its own receipt, then the shelf:

```
id | name
---------
6 | Harbor Light

name | bags
-----------
Deep Well | 24

name | origin
-------------
Night Shift | Brazil

id | name | bags
----------------
1 | Morning Ritual | 24
2 | Deep Well | 24
3 | Half Past Four | 40
5 | Cloud Cover | 15
6 | Harbor Light | 20
```
