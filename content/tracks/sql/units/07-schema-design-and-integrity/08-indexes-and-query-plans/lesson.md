---
id: 08-indexes-and-query-plans
title: Indexes and Query Plans
language: sql
runner: browser
estMinutes: 18
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Ask EXPLAIN QUERY PLAN how SQLite answers the desk's most frequent question, build the index that turns its SCAN into a SEARCH, ask again, and add a UNIQUE index that makes barcode lookups fast and duplicates impossible."
docs: [sql/indexes, sql/constraints-and-keys]
checks:
  - id: plan-starts-as-a-scan
    type: stdout
    entry: query.sql
    match: contains
    value: "SCAN loans"
  - id: plan-becomes-a-search
    type: stdout
    entry: query.sql
    match: contains
    value: "SEARCH loans USING INDEX idx_loans_member (member_id=?)"
  - id: rows-and-indexes
    type: stdout
    entry: query.sql
    match: contains
    value: "id | borrowed_on\n----------------\n2 | 2025-03-05\n6 | 2025-04-08\n7 | 2025-04-12\n9 | 2025-04-18\n11 | 2025-05-02\n\nname\n----\nidx_copies_barcode\nidx_loans_member\n"
  - id: measured-then-indexed
    type: ai-judge
    rubric: "The same SELECT id, borrowed_on FROM loans WHERE member_id = 2 is run under EXPLAIN QUERY PLAN twice — once before CREATE INDEX idx_loans_member ON loans(member_id) and once after — so the SCAN-to-SEARCH change is demonstrated rather than asserted. The barcode index is created as a UNIQUE index on copies(barcode). The closing list of index names is read from sqlite_master with a WHERE type = 'index' filter and ORDER BY, not typed out as literal rows."
hints:
  - "EXPLAIN QUERY PLAN is a prefix, not a separate statement: put it on the line above the SELECT and end the whole thing with one semicolon."
  - "CREATE INDEX idx_loans_member ON loans(member_id); — index the column the WHERE clause tests, then paste the same EXPLAIN QUERY PLAN again underneath it."
  - "UNIQUE goes before INDEX: CREATE UNIQUE INDEX idx_copies_barcode ON copies(barcode);. List what you built with SELECT name FROM sqlite_master WHERE type = 'index' AND name LIKE 'idx_%' ORDER BY name;"
---
## Ask before you optimize

"What has Marcus got out?" is the busiest question at Fernwood's desk.
To answer it, SQLite reads `loans` from the first row to the last,
checking `member_id` on each one. Twelve rows: instant. Twelve million:
a spinning cursor and a queue at the counter.

You don't have to guess at any of this. Put `EXPLAIN QUERY PLAN` in
front of a query and SQLite tells you how it intends to answer:

```
2 | 0 | 216 | SCAN loans
```

`SCAN` is the word to notice. It means *every row*. Its counterpart is
`SEARCH`, which means SQLite can jump straight to the rows it needs.

Turning one into the other is what an index does. An index is a sorted
copy of one column (plus a pointer back to the row), maintained by SQLite
on every write:

```sql
CREATE INDEX idx_loans_member ON loans(member_id);
```

Run the same `EXPLAIN QUERY PLAN` again and the plan now reads
`SEARCH loans USING INDEX idx_loans_member (member_id=?)`. Same query,
same data, different strategy — because you gave the planner an ordered
path to the rows instead of a pile.

Indexes are not free, and that's the whole judgement call. Every insert,
update and delete has to maintain them, and each one costs disk. So
index the columns you *filter*, *join* and *sort* on, in the queries you
actually run often — not every column, and not preemptively. Primary
keys are already indexed. So is every `UNIQUE` constraint, which is worth
remembering: `CREATE UNIQUE INDEX` gives you a rule and a fast lookup in
one statement.

The honest workflow is measure, then change, then measure again — which
is exactly the shape of this lesson.

### Your goal

Explain the desk's query, index it, explain it again, run it for real,
then add the unique barcode index and list what you've built:

```
... | SCAN loans

... | SEARCH loans USING INDEX idx_loans_member (member_id=?)

id | borrowed_on
----------------
2 | 2025-03-05
...

name
----
idx_copies_barcode
idx_loans_member
```

The middle number in the plan rows is SQLite's own estimate — ignore it;
`SCAN` becoming `SEARCH` is the result you came for.
