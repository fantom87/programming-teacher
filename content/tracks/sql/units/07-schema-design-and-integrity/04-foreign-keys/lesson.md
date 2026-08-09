---
id: 04-foreign-keys
title: Foreign Keys
language: sql
runner: browser
estMinutes: 18
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Turn on PRAGMA foreign_keys, build the loans table with REFERENCES pointing at copies and members, then use PRAGMA foreign_key_check to hunt down the orphaned hold that crept in while enforcement was off."
docs: [sql/constraints-and-keys, sql/joins]
checks:
  - id: orphan-found-and-cleared
    type: stdout
    entry: query.sql
    match: exact
    value: "table | rowid | parent | fkid\n-----------------------------\nholds | 3 | books | 1\n\ntable | rowid | parent | fkid\n-----------------------------\n(no rows)\n\nid | member | barcode\n---------------------\n1 | Ada Fern | FW-1001\n2 | Marcus Wood | FW-1004\n3 | Priya Rao | FW-1002\n4 | Ada Fern | FW-1005\n5 | Dana Okoye | FW-1007\n6 | Marcus Wood | FW-1003\n"
  - id: references-declared-and-enforced
    type: ai-judge
    rubric: "The script opens with PRAGMA foreign_keys = ON;. The loans table declares copy_id and member_id as NOT NULL columns carrying REFERENCES copies(id) and REFERENCES members(id) — real foreign key clauses, not bare integers or a comment. The orphan is located by running PRAGMA foreign_key_check (not by a hand-written NOT IN or LEFT JOIN hunt), removed with a DELETE targeting that hold, and the check is run a second time to show it clean. The closing report joins loans to members and copies with JOIN ... ON and ends with ORDER BY."
hints:
  - "PRAGMA foreign_keys = ON; is a per-connection switch, so it belongs at the top of query.sql — before the table exists, not after."
  - "The reference goes on the child column: copy_id INTEGER NOT NULL REFERENCES copies(id), and member_id INTEGER NOT NULL REFERENCES members(id)."
  - "PRAGMA foreign_key_check; scans every table and reports one row per broken link — table, rowid, parent, fkid. The rowid it names is the hold to DELETE; run the pragma again afterwards and you should see (no rows)."
---
## The link that means something

`copies.book_id` holds a number. Nothing so far has made that number
*mean* a row in `books` — it could be 99, it could be −4, and the
database would shrug. A foreign key is the sentence that gives it
meaning:

```sql
copy_id INTEGER NOT NULL REFERENCES copies(id)
```

Now the column has a promise attached: whatever sits here must exist over
there. With enforcement on, an insert naming a missing copy fails, and a
`DELETE` of a copy that loans still point at fails too. The database
stops you from creating a loan of a book that isn't in the building.

Here's the SQLite-specific trap, and it bites everyone once. For
backward compatibility, **foreign keys are off by default**. Every
`REFERENCES` clause you wrote is stored, parsed — and completely
ignored until each connection runs:

```sql
PRAGMA foreign_keys = ON;
```

It's per connection, not per database, so it belongs at the top of every
script that writes data. Miss it, and your schema *documents* an
invariant it isn't enforcing.

Which is exactly what happened here. Fernwood's `holds` table was filled
in by hand last winter with the switch off, and something in it now
points at a book that doesn't exist. Turning enforcement on today won't
retroactively find it — the check runs on writes, not on the rows already
sitting there. For that there's `PRAGMA foreign_key_check`, which walks
every table and reports each broken link: the child table, the offending
`rowid`, the parent table it was supposed to reach, and which foreign key
failed. It's the first thing to run against a database you've inherited.

### Your goal

Switch enforcement on, create `loans` with both `REFERENCES` clauses,
load the six loans from the desk, then find the orphan, delete it, and
prove the database is sound:

```
table | rowid | parent | fkid
-----------------------------
holds | 3 | books | 1

table | rowid | parent | fkid
-----------------------------
(no rows)
```

Finish with the desk report — loan id, member name, barcode — joined
across all three tables and ordered by loan id.
