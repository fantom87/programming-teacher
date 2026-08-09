---
id: 10-acid-in-practice
title: ACID in Practice
language: sql
runner: browser
estMinutes: 25
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Put the whole unit to work in one script: an atomic checkout that commits, a destructive cleanup that gets rolled back, two impossible rows the constraints refuse, and a closing audit that proves loans and shelf agree."
docs: [sql/constraints-and-keys, sql/deleting-data, sql/indexes]
checks:
  - id: acid-script
    type: stdout
    entry: query.sql
    match: exact
    value: "barcode | on_shelf | borrower\n-----------------------------\nFW-1006 | 0 | Priya Rao\n\nloans_after | off_shelf_after\n-----------------------------\n7 | 4\n\ncopies_total\n------------\n7\n\ntable | rowid | parent | fkid\n-----------------------------\n(no rows)\n\nout_now | off_shelf\n-------------------\n4 | 4\n"
  - id: four-letters-four-mechanisms
    type: ai-judge
    rubric: "query.sql begins with PRAGMA foreign_keys = ON;. Part 1's INSERT into loans and UPDATE of copies sit inside BEGIN ... COMMIT. Part 2's DELETE and UPDATE sit inside BEGIN ... ROLLBACK, and are undone by that ROLLBACK rather than skipped, re-inserted or defused with a never-matching WHERE. Part 3 offers both impossible copies through INSERT OR IGNORE so the CHECK and UNIQUE constraints reject them. Part 4 runs PRAGMA foreign_key_check and derives out_now and off_shelf with COUNT subqueries over loans and copies — none of the reported numbers (7, 4, 7, 4, 4) are typed as literals anywhere."
hints:
  - "Work part by part, running after each one — the output grows a block at a time, so a mismatch tells you exactly which part to look at."
  - "Part 2 is the one people get wrong by being careful: actually run the DELETE and the UPDATE inside the transaction, then ROLLBACK. Proving the undo works is the point of the exercise."
  - "Part 4's two numbers must be computed, each from its own subquery: SELECT (SELECT COUNT(*) FROM loans WHERE returned_on IS NULL) AS out_now, (SELECT COUNT(*) FROM copies WHERE on_shelf = 0) AS off_shelf; — if they ever disagree, the library has lost a book."
---
## What the database promises

Four letters get thrown around whenever transactions come up, and by now
you've built every one of them by hand.

**A — atomic.** A transaction happens completely or not at all. You saw
this last lesson: `BEGIN`, two statements, `COMMIT`. No observer, and no
crash, ever catches the library with a loan recorded and the copy still
on the shelf.

**C — consistent.** Every transaction leaves the database obeying its own
rules. That's not magic; it's the constraints you wrote. `NOT NULL`,
`UNIQUE`, `CHECK` and `FOREIGN KEY` are checked as part of the
transaction, so a change that would break an invariant fails instead of
landing. Rules in the schema are the only rules a transaction can
guarantee.

**I — isolated.** Concurrent transactions don't see each other's
half-finished work. Your connection sees its own uncommitted changes —
that's why the count inside last lesson's rollback showed four — but
nobody else does until you commit.

**D — durable.** Once `COMMIT` returns, the change survives power loss —
SQLite's journal records it somewhere recoverable before the database
file is declared updated.

One caveat you'll need in real work: these guarantees are about
*committed transactions*, not about wisdom. `DELETE FROM loans;`
committed inside a perfect ACID transaction is durably, irreversibly
gone. Atomicity protects you from crashes, not from a bad `WHERE` —
that's what `BEGIN` plus a look-before-you-commit `SELECT` is for, and
what backups are for.

### Your goal

One script, four parts, run after each.

**Part 1 — atomic.** Inside `BEGIN ... COMMIT`, check copy 6 out to
member 3 on `'2025-04-22'`: insert the loan, set `on_shelf = 0`. Then
show the newest loan's barcode, shelf flag and borrower.

**Part 2 — or nothing.** A volunteer decides to "tidy up": delete every
returned loan and put every copy back on the shelf. Run both statements
inside a transaction, then `ROLLBACK`, and show the library untouched.

**Part 3 — consistent.** Offer two impossible copies with
`INSERT OR IGNORE` — one with `on_shelf = 7`, one reusing barcode
`'FW-1001'` — then count the copies.

**Part 4 — the audit.** `PRAGMA foreign_key_check`, then the invariant
that has to hold in a library: books out on loan must equal copies off
the shelf.

```
barcode | on_shelf | borrower
-----------------------------
FW-1006 | 0 | Priya Rao
...
out_now | off_shelf
-------------------
4 | 4
```

Four out, four off the shelf, no orphans. That's a database you can
trust — and that's the unit.
