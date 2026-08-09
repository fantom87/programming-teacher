---
id: 07-upsert-on-conflict
title: Upsert with ON CONFLICT
language: sql
runner: browser
estMinutes: 16
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Merge a whole delivery in one statement: INSERT the three arriving coffees with ON CONFLICT(name) DO UPDATE, so known names have their bags added and the new name is simply inserted."
docs: [sql/inserting-and-updating, sql/constraints-and-keys]
checks:
  - id: delivery-merged
    type: stdout
    entry: query.sql
    match: exact
    value: "id | name | bags\n----------------\n1 | Morning Ritual | 24\n2 | Deep Well | 22\n3 | Half Past Four | 40\n4 | Night Shift | 14\n5 | Cloud Cover | 15\n6 | Harbor Light | 20\n"
  - id: one-upsert-statement
    type: ai-judge
    rubric: "All three delivered coffees arrive in a single INSERT INTO coffees statement with one multi-row VALUES clause and an ON CONFLICT(name) DO UPDATE SET clause that adds the incoming bags to the existing ones using the excluded pseudo-table (bags = bags + excluded.bags). There is no separate UPDATE statement, no SELECT that checks whether a row exists first, and the totals 22 and 14 are never typed as literals."
hints:
  - "Append the upsert clause to a normal INSERT: ... VALUES (...), (...), (...) ON CONFLICT(name) DO UPDATE SET ...;"
  - "Inside DO UPDATE, a bare column name means the row already in the table, and excluded.column means the row you just tried to insert. So bags = bags + excluded.bags adds the delivery to the shelf."
  - "ON CONFLICT(name) works only because name is declared UNIQUE in schema.sql — that constraint is what tells SQLite the two rows are the same coffee. Finish with SELECT id, name, bags FROM coffees ORDER BY id;"
---
## Insert it, or top it up

Here's a job you'll meet constantly. A delivery arrives: three coffees,
each with a bag count. Two are already on the shelf and need their stock
increased. One is new and needs a row of its own. And you don't get to
know in advance which is which — the feed just shows up.

The naive answer is a loop in your application: for each coffee, `SELECT`
to see if it exists, then `INSERT` or `UPDATE` accordingly. Three round
trips per row, and a race condition hiding in the gap between the check
and the write.

SQL has a single statement for this, and its nickname is *upsert*:

```sql
INSERT INTO coffees (name, origin, roast, price, bags) VALUES
  ('Deep Well',    'Sumatra',  'dark',   18.25, 10),
  ('Harbor Light', 'Honduras', 'medium', 15.95, 20)
ON CONFLICT(name) DO UPDATE SET bags = bags + excluded.bags;
```

Try to insert every row. If a row collides with an existing one, don't
fail — run the `DO UPDATE` instead. `Harbor Light` is new, so it's simply
inserted. `Deep Well` collides, so its `bags` go from 12 to 22.

Two details carry the whole idea.

**`ON CONFLICT(name)`** names the constraint that defines "the same
row". It only works because `name` is declared `UNIQUE` in the schema —
without a unique index there is no conflict to detect, and SQLite will
tell you so. The constraint isn't red tape here; it's the thing that
makes the statement possible.

**`excluded`** is the row you *tried* to insert — the one that got
excluded by the conflict. So in `bags = bags + excluded.bags`, the bare
`bags` is what's on the shelf and `excluded.bags` is what just arrived.
Read that expression aloud and it says what it does: add the delivery to
the stock.

There's a quieter sibling, `ON CONFLICT DO NOTHING`, for when a duplicate
is simply uninteresting — importing a feed that may overlap yesterday's,
say. Skip and move on, no error.

### Your goal

One statement for the whole pallet, then the shelf:

```
id | name | bags
----------------
1 | Morning Ritual | 24
2 | Deep Well | 22
3 | Half Past Four | 40
4 | Night Shift | 14
5 | Cloud Cover | 15
6 | Harbor Light | 20
```
