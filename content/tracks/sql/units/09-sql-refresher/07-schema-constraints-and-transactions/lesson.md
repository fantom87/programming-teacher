---
id: 07-schema-constraints-and-transactions
title: Schema, Constraints and Transactions
language: sql
runner: browser
estMinutes: 18
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Build a reviews table that defends itself with CHECK, UNIQUE and DEFAULT, load a batch where two rows bounce off the constraints, roll one transaction back and commit another, then add an index and read the index list out of sqlite_master."
docs: [sql/creating-tables, sql/constraints-and-keys, sql/indexes]
checks:
  - id: schema-drill-output
    type: stdout
    entry: query.sql
    match: exact
    value: "id | album_id | reviewer | rating | source\n------------------------------------------\n1 | 1 | dara | 5 | web\n2 | 1 | priya | 4 | web\n3 | 2 | dara | 3 | web\n\nreviewer | album_id | rating\n----------------------------\ndara | 1 | 5\ndara | 2 | 3\npriya | 1 | 4\n\nsource | reviews\n----------------\nin-store | 3\nweb | 1\n\nname\n----\nidx_reviews_album\nsqlite_autoindex_reviews_1\n"
  - id: constraints-do-the-work
    type: ai-judge
    rubric: "The CREATE TABLE declares the rules in the schema, not in the queries: album_id NOT NULL with a REFERENCES albums(id) foreign key, reviewer NOT NULL, rating NOT NULL with a CHECK constraining it to 1..5, source NOT NULL DEFAULT 'web', and a UNIQUE constraint over (album_id, reviewer). The batch is one INSERT OR IGNORE with all five rows in a single VALUES list — the duplicate and the out-of-range rating are rejected by the constraints, not filtered out by the author omitting them or adding a WHERE. Step 3 wraps its UPDATE in BEGIN ... ROLLBACK and step 4 in BEGIN ... COMMIT, with the ids and sources never hardcoded in the verification SELECTs, which read from the reviews table."
hints:
  - "Constraints are part of the column definition; UNIQUE over two columns is a table-level clause: rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5), source TEXT NOT NULL DEFAULT 'web', and then UNIQUE (album_id, reviewer) on its own line before the closing paren."
  - "INSERT OR IGNORE keeps the script alive: a row that violates a CHECK or UNIQUE constraint is skipped instead of raising. Omit source from the column list and the DEFAULT fills it in."
  - "BEGIN; UPDATE reviews SET rating = 1; ROLLBACK; — then a plain SELECT shows the original ratings. The second transaction is the same shape with COMMIT at the end, and holds two statements that must land together."
---
## Rules that live in the schema

A constraint is a rule the database enforces no matter which client
connects, which is a different thing from a rule your application
remembers to check.

```sql
rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5)
source TEXT    NOT NULL DEFAULT 'web'
UNIQUE (album_id, reviewer)
```

`NOT NULL` and `CHECK` constrain a value; `UNIQUE` constrains a
combination — one review per reviewer per album. `DEFAULT` fills a
column you leave out of the `INSERT` column list. `REFERENCES` declares
a foreign key, though SQLite only *enforces* it when
`PRAGMA foreign_keys = ON`, which is off by default and catches
everyone once.

Two SQLite specifics worth re-learning: `INTEGER PRIMARY KEY` is an
alias for the internal rowid and auto-assigns, so you rarely need
`AUTOINCREMENT`; and every `UNIQUE` constraint silently creates an index
to enforce itself — which is why the index listing at the end of this
drill has a row you did not write.

`INSERT OR IGNORE` says "skip rows that violate a constraint, keep
going" — the batch-load idiom, and here it lets two bad rows bounce off
without killing the script.

Indexes are the other half of schema design: they make lookups on a
column fast and every write slightly slower. Prefix a `SELECT` with
`EXPLAIN QUERY PLAN` to see whether SQLite says `SEARCH … USING INDEX`
or `SCAN` — worth trying once you are green, then deleting, since its
output is not part of the check.

A transaction makes several statements one unit: `BEGIN`, then `COMMIT`
to keep everything or `ROLLBACK` to keep nothing.

### Your goal

Five steps in `query.sql`, in this order:

1. `CREATE TABLE reviews` with all the constraints above.
2. Load five rows with `INSERT OR IGNORE`; two must bounce. Then list
   what landed.
3. Set every rating to 1 inside a transaction, `ROLLBACK`, and prove
   nothing changed.
4. In a committed transaction, add ines' in-store review and mark dara's
   reviews `in-store`. Then count reviews per source.
5. Create `idx_reviews_album`, then list the indexes on `reviews` from
   `sqlite_master`.

```
id | album_id | reviewer | rating | source
------------------------------------------
1 | 1 | dara | 5 | web
...

source | reviews
----------------
in-store | 3
web | 1

name
----
idx_reviews_album
sqlite_autoindex_reviews_1
```
