---
id: 09-transactions
title: Transactions
language: sql
runner: browser
estMinutes: 18
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Wrap a checkout — insert the loan, take the copy off the shelf — in BEGIN and COMMIT so the two statements land together, then start a second transaction, watch a careless DELETE take effect inside it, and undo the whole thing with ROLLBACK."
docs: [sql/deleting-data, sql/inserting-and-updating]
checks:
  - id: commit-lands-rollback-vanishes
    type: stdout
    entry: query.sql
    match: exact
    value: "id | barcode | on_shelf\n-----------------------\n6 | FW-1006 | 0\n\nloans_inside\n------------\n4\n\nloans_after\n-----------\n7\n\nid | barcode | on_shelf\n-----------------------\n4 | FW-1004 | 0\n5 | FW-1005 | 0\n6 | FW-1006 | 0\n7 | FW-1007 | 0\n"
  - id: real-transaction-boundaries
    type: ai-judge
    rubric: "The checkout's INSERT into loans and UPDATE of copies sit between an explicit BEGIN and COMMIT, so both statements form one unit. The second transaction opens with BEGIN, runs DELETE FROM loans WHERE returned_on IS NOT NULL, takes a COUNT(*) while still inside the transaction, and ends with ROLLBACK — the deletion is undone by ROLLBACK rather than avoided by skipping it, re-inserted afterwards, or neutralised by a WHERE clause that matches nothing. The counts and the shelf listing are read back with SELECT from the tables, not typed as literals."
hints:
  - "BEGIN; on its own line opens the transaction; COMMIT; on its own line closes it. Everything between them either all happens or none of it does."
  - "The checkout is two statements: INSERT INTO loans (copy_id, member_id, borrowed_on, returned_on) VALUES (6, 3, '2025-04-22', NULL); then UPDATE copies SET on_shelf = 0 WHERE id = 6; — then COMMIT."
  - "For the near-miss, run the SELECT COUNT(*) AS loans_inside FROM loans; before the ROLLBACK — that's the point: inside the transaction the rows really are gone. The COUNT after the ROLLBACK proves they came back."
---
## All of it, or none of it

Checking out a book is two statements. Record the loan, and take the copy
off the shelf. Between them there's a moment where the database says a
book is both borrowed and available — and if the process dies in that
moment, it says so forever.

A transaction closes that gap:

```sql
BEGIN;
INSERT INTO loans (...) VALUES (...);
UPDATE copies SET on_shelf = 0 WHERE id = 6;
COMMIT;
```

Everything between `BEGIN` and `COMMIT` becomes one indivisible unit.
Other readers never see the halfway state. If the power fails before the
`COMMIT`, SQLite finds no completed transaction on restart and the
database comes back as if you'd never started. There is no partial
checkout.

The other half of the power is deliberate: `ROLLBACK` throws the whole
transaction away. That makes a transaction the safest way to run a
statement you're not sure about — the classic being a `DELETE` whose
`WHERE` you haven't fully thought through:

```sql
BEGIN;
DELETE FROM loans WHERE returned_on IS NOT NULL;
SELECT COUNT(*) FROM loans;   -- look before you leap
ROLLBACK;
```

Inside the transaction the rows really are gone — your own connection
sees the deleted world, which is exactly what makes the check meaningful.
`ROLLBACK` puts every one of them back. Look, then decide, then commit or
undo.

Without `BEGIN`, every statement is its own tiny transaction that commits
the instant it finishes. That's why a lone `UPDATE` can't be taken back,
and why a script of twenty inserts is twenty separate commits — which is
also, incidentally, why wrapping a bulk load in one transaction makes it
dramatically faster.

Keep transactions short. They hold a lock on the database, so anything
slow inside one — a network call, a prompt, a coffee break — is time
nobody else can write.

### Your goal

Commit the checkout of copy 6 to member 3 on `'2025-04-22'`, then open a
second transaction, delete every returned loan, count what's left from
inside, and roll it all back:

```
id | barcode | on_shelf
-----------------------
6 | FW-1006 | 0

loans_inside
------------
4

loans_after
-----------
7
```

Four inside, seven outside. Finish by listing every copy that's off the
shelf.
