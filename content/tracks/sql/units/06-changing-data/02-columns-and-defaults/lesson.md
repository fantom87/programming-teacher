---
id: 02-columns-and-defaults
title: Columns and Defaults
language: sql
runner: browser
estMinutes: 12
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Insert two coffees whose paperwork is incomplete — supplying only the columns you actually know — and see exactly what the table fills in for the rest."
docs: [sql/inserting-and-updating, sql/constraints-and-keys]
checks:
  - id: defaults-filled-in
    type: stdout
    entry: query.sql
    match: exact
    value: "name | roast | price | bags | notes\n-----------------------------------\nFog Line | medium | 14.95 | 0 | NULL\nQuarry Road | dark | 21.55 | 0 | NULL\n"
  - id: relies-on-defaults
    type: ai-judge
    rubric: "The first INSERT lists only the name and origin columns; the second lists only name, origin, roast and price. Every other column is omitted from the column list rather than supplied, so the table's own DEFAULT and NULL rules fill them in — the values medium, 14.95, 0 and NULL are never typed anywhere in query.sql. The closing SELECT reads the two new rows from the coffees table with an ORDER BY."
hints:
  - "The column list is a promise about what you are supplying. Shorten it: INSERT INTO coffees (name, origin) VALUES ('Fog Line', 'Rwanda'); — the columns you left out are the table's problem, not yours."
  - "Read schema.sql before you write. roast, price and bags each declare a DEFAULT; notes declares none, so an omitted notes becomes NULL."
  - "The verifying SELECT wants the new rows only: SELECT name, roast, price, bags, notes FROM coffees WHERE id > 4 ORDER BY id;"
---
## The columns you leave out

The column list in an `INSERT` isn't a formality — it's a promise about
what you're supplying. Anything not on that list, you're handing to the
table to decide. And the table has opinions, written into its schema:

```sql
CREATE TABLE coffees (
  id     INTEGER PRIMARY KEY,
  name   TEXT    NOT NULL,
  origin TEXT    NOT NULL,
  roast  TEXT    NOT NULL DEFAULT 'medium',
  price  REAL    NOT NULL DEFAULT 14.95,
  bags   INTEGER NOT NULL DEFAULT 0,
  notes  TEXT
);
```

Leave a column out and exactly one of three things happens:

1. **It has a DEFAULT** — that value goes in. `roast` becomes `'medium'`,
   `bags` becomes `0`. Nobody had to type them.
2. **It has no DEFAULT and allows NULL** — it becomes `NULL`. That's
   `notes`: the honest way to say *we don't know yet*.
3. **It has no DEFAULT and is NOT NULL** — the insert is rejected. Try
   adding a coffee with no `name` and SQLite refuses outright. The
   constraint is doing its job: some facts are not optional.

So this is a complete, legal statement:

```sql
INSERT INTO coffees (name, origin) VALUES ('Fog Line', 'Rwanda');
```

Two facts in, five columns filled. That's a feature, not a shortcut.
Defaults are where a schema encodes what "normal" means — a new coffee is
medium roast at the house price with nothing in stock until a pallet
arrives — and every insert that omits the column inherits that decision.
Change the default later and you change it in one place.

One SQLite quirk worth knowing: there is no `DEFAULT` keyword you can
type inside a `VALUES` list, the way some other databases allow. You get
a default by *omitting the column*, and only that way.

And be careful what you wish for with `NULL`: it isn't zero and isn't an
empty string. It's the absence of a value, and it will spread through
comparisons and arithmetic in ways you'll meet again soon.

### Your goal

Insert `Fog Line` from Rwanda knowing nothing else, then `Quarry Road`
from Yemen — dark roast, 21.55, no bag count — and show what landed:

```
name | roast | price | bags | notes
-----------------------------------
Fog Line | medium | 14.95 | 0 | NULL
Quarry Road | dark | 21.55 | 0 | NULL
```
