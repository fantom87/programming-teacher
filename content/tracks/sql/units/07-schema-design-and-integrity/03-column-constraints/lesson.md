---
id: 03-column-constraints
title: Column Constraints
language: sql
runner: browser
estMinutes: 15
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Build the copies table so the rules live in the schema — NOT NULL, a UNIQUE barcode, a DEFAULT condition and a CHECK on the allowed words — then watch INSERT OR IGNORE hand two impossible rows back to the clerk."
docs: [sql/constraints-and-keys, sql/creating-tables]
checks:
  - id: constraints-hold-the-line
    type: stdout
    entry: query.sql
    match: exact
    value: "id | book_id | barcode | condition\n----------------------------------\n1 | 1 | FW-1001 | good\n2 | 2 | FW-1002 | good\n3 | 2 | FW-1003 | worn\n4 | 3 | FW-1004 | good\n5 | 4 | FW-1005 | good\n6 | 5 | FW-1006 | damaged\n7 | 6 | FW-1007 | good\n\ncopies_kept\n-----------\n7\n"
  - id: rules-in-the-schema
    type: ai-judge
    rubric: "The CREATE TABLE copies statement carries all four constraint kinds inline: book_id NOT NULL, barcode NOT NULL and UNIQUE, and condition NOT NULL with DEFAULT 'good' plus a CHECK restricting it to 'good', 'worn' and 'damaged'. Copy seven is inserted without a condition value so the DEFAULT supplies it (it is not written out as 'good'), and the two bad rows are offered through INSERT OR IGNORE so the constraints reject them — they are not simply left out of the script, and no filtering WHERE clause is used to pre-screen them."
hints:
  - "Constraints are written after the type, in the column definition: barcode TEXT NOT NULL UNIQUE — you can stack several on one column."
  - "The condition column needs three of them: NOT NULL DEFAULT 'good' CHECK (condition IN ('good', 'worn', 'damaged')). For copy seven, list only (book_id, barcode) in the INSERT so DEFAULT has a job to do."
  - "Plain INSERT would abort the whole script on a bad row. INSERT OR IGNORE INTO copies (book_id, barcode, condition) VALUES (3, 'FW-1004', 'good'), (5, 'FW-1008', 'chewed'); skips exactly the rows that violate a constraint and keeps going."
---
## Rules that travel with the data

An application can check that a barcode isn't already taken. So can the
next application, and the import script, and the intern's spreadsheet
macro — and one of them will forget. A constraint is that rule written
into the table, where every writer meets it, forever.

Four of them cover most of what a schema needs:

```sql
book_id   INTEGER NOT NULL,
barcode   TEXT NOT NULL UNIQUE,
condition TEXT NOT NULL DEFAULT 'good'
          CHECK (condition IN ('good', 'worn', 'damaged'))
```

`NOT NULL` says the fact is required — a copy with no book is nonsense,
so nonsense can't be stored. `UNIQUE` says no two rows may share this
value; SQLite enforces it with an index, which makes barcode lookups fast
as a side effect. `DEFAULT` supplies a value when the insert doesn't
mention the column, so the common case gets shorter instead of sloppier.
And `CHECK` runs a small boolean expression on every write: any
expression that reads only that row is fair game — `qty >= 0`,
`length(barcode) = 7`, `borrowed_on <= returned_on`.

Constraints don't ask nicely. A violating insert is an error, and an
error in the middle of a script kills everything after it. Sometimes
that's exactly right. Sometimes — an import from a clerk's messy CSV —
you'd rather keep the good rows and drop the bad ones. That's
`INSERT OR IGNORE`: the offending rows are skipped, the rest land, and
the script carries on. It's the polite way to prove a constraint fires,
and you'll use it in this lesson to watch two bad rows bounce off.

One warning: `OR IGNORE` covers `NOT NULL`, `UNIQUE`, `CHECK` and
`PRIMARY KEY` conflicts. Foreign keys are not on that list — those are
the next lesson's business.

### Your goal

Create `copies` with every rule in the schema, load the six labelled
copies, let `DEFAULT` fill in the seventh, then offer the clerk's two
mistakes — a duplicate barcode and a condition of `'chewed'` — and watch
the table refuse both:

```
id | book_id | barcode | condition
----------------------------------
1 | 1 | FW-1001 | good
...
7 | 6 | FW-1007 | good

copies_kept
-----------
7
```

Seven rows in, seven rows kept. The two that didn't belong never made it
to disk.
