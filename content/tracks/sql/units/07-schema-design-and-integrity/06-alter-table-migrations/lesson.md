---
id: 06-alter-table-migrations
title: ALTER TABLE and Migrations
language: sql
runner: browser
estMinutes: 15
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Migrate the live members table without losing a row: add a nullable email column, add a NOT NULL status column that carries a DEFAULT, backfill both with UPDATE, and read the new shape back from PRAGMA table_info."
docs: [sql/creating-tables, sql/inserting-and-updating]
checks:
  - id: migration-lands
    type: stdout
    entry: query.sql
    match: exact
    value: "id | name | email | status\n--------------------------\n1 | Ada Fern | ada.fern@fernwood.example | lapsed\n2 | Marcus Wood | marcus.wood@fernwood.example | lapsed\n3 | Priya Rao | priya.rao@fernwood.example | active\n4 | Dana Okoye | dana.okoye@fernwood.example | active\n\ncid | name | type | notnull | dflt_value | pk\n---------------------------------------------\n0 | id | INTEGER | 0 | NULL | 1\n1 | name | TEXT | 1 | NULL | 0\n2 | card_no | TEXT | 1 | NULL | 0\n3 | joined_on | TEXT | 1 | NULL | 0\n4 | email | TEXT | 0 | NULL | 0\n5 | status | TEXT | 1 | 'active' | 0\n"
  - id: altered-not-rebuilt
    type: ai-judge
    rubric: "The two columns arrive through ALTER TABLE members ADD COLUMN statements — the members table is never dropped, re-created, or re-inserted, and the four existing rows are never retyped. status is added as TEXT NOT NULL DEFAULT 'active'. Both backfills are UPDATE statements computed from data already in the row: email from the name column via lower/replace and string concatenation (not four literal addresses), and status set to 'lapsed' by a WHERE comparing joined_on against '2024-01-01'. The shape is read back with PRAGMA table_info(members)."
hints:
  - "One column per statement: ALTER TABLE members ADD COLUMN email TEXT; then a second ALTER for status."
  - "A NOT NULL column can only be added if it brings a value for the rows already on disk: ALTER TABLE members ADD COLUMN status TEXT NOT NULL DEFAULT 'active';"
  - "Build the address from the row, don't type it: UPDATE members SET email = lower(replace(name, ' ', '.')) || '@fernwood.example'; — || is SQL's string concatenation. Then a second UPDATE with WHERE joined_on < '2024-01-01' sets status = 'lapsed'."
---
## Changing a table that already has rows

Schemas are never finished. Fernwood wants to email renewal reminders,
so `members` needs an `email` column and a `status` column — and it needs
them without a maintenance window, because the desk is open and those
four rows are real people.

`ALTER TABLE ... ADD COLUMN` does exactly this, and it's cheap: SQLite
records the new column in the schema and moves on. It doesn't rewrite the
rows. Existing rows simply read back `NULL` for a column they were
written without.

Which explains the one rule that trips people up. If the new column is
`NOT NULL`, `NULL` is not an option — so SQLite refuses unless you supply
a `DEFAULT` for the rows already on disk:

```sql
ALTER TABLE members ADD COLUMN status TEXT NOT NULL DEFAULT 'active';
```

Adding is the easy half. Filling is the other half, and it's an ordinary
`UPDATE` — a migration is usually a small script: add the column, compute
its value from what you already have, and only then let the application
depend on it. Derive rather than retype whenever you can; four addresses
you type by hand are four chances to be wrong, while
`lower(replace(name, ' ', '.'))` is wrong or right exactly once.

SQLite's `ALTER TABLE` is deliberately narrow: add a column, drop a
column, rename a column, rename the table. That's it. There's no
"add a `CHECK`" or "make this column `NOT NULL`". For those you do the
rebuild dance — create the new table beside the old one, `INSERT INTO
new SELECT ... FROM old`, drop the old, rename the new — all inside a
transaction, which you'll meet in lesson 9.

To see what you actually ended up with, ask the database rather than
your memory: `PRAGMA table_info(members)` lists every column with its
type, whether it's `NOT NULL`, its default, and its primary-key position.

### Your goal

Add both columns, backfill both, then show the members and the shape:

```
id | name | email | status
--------------------------
1 | Ada Fern | ada.fern@fernwood.example | lapsed
...

cid | name | type | notnull | dflt_value | pk
---------------------------------------------
...
5 | status | TEXT | 1 | 'active' | 0
```

Anyone who joined before 2024 is `lapsed`; everyone else keeps the
default.
