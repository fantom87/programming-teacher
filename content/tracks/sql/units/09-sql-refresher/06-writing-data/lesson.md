---
id: 06-writing-data
title: Writing Data
language: sql
runner: browser
estMinutes: 18
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "A six-step write script against the shop database: multi-row INSERT with RETURNING, a targeted UPDATE, an ON CONFLICT upsert that merges a restock delivery, a DELETE, and two verification SELECTs."
docs: [sql/inserting-and-updating, sql/deleting-data, sql/joins]
checks:
  - id: write-script-output
    type: stdout
    entry: query.sql
    match: exact
    value: "id | title\n----------\n8 | Fathom\n9 | Undertow\n\nid | title | price | artist\n---------------------------\n1 | Paper Lantern | 26.35 | Nina Kestrel\n4 | Ash & Ivory | 20.08 | The Ember Hours\n8 | Fathom | 27.50 | Juno Vale\n9 | Undertow | 21.00 | Juno Vale\n\nalbum_id | on_hand\n------------------\n1 | 9\n2 | 2\n3 | 7\n5 | 3\n6 | 2\n"
  - id: writes-done-in-sql
    type: ai-judge
    rubric: "Step 2 is a single INSERT with two rows in one VALUES list and a RETURNING id, title clause — not two INSERTs, and not an INSERT followed by a SELECT to show what landed. Step 3 is an UPDATE with an arithmetic assignment (price = ROUND(price * 1.1, 2)) and a WHERE year < 2020 — the new prices are never typed as literals and the statement is never left unfiltered. Step 4 is one INSERT ... ON CONFLICT(album_id) DO UPDATE whose SET adds excluded.on_hand to the existing on_hand — not two statements, not a DELETE-then-INSERT, and not a hand-computed 9. Step 5 is a DELETE with a WHERE on_hand = 0. The verification SELECTs read the tables back rather than restating the expected values."
hints:
  - "One INSERT can carry many rows: INSERT INTO albums (id, artist_id, title, year, price) VALUES (8, ...), (9, ...) RETURNING id, title; — RETURNING makes the write itself produce the result set."
  - "UPDATE albums SET price = ROUND(price * 1.1, 2) WHERE year < 2020; — the album with a NULL year fails that comparison and is left alone, which is exactly right."
  - "Upsert: INSERT INTO stock (album_id, on_hand) VALUES (1, 5), (6, 2) ON CONFLICT(album_id) DO UPDATE SET on_hand = stock.on_hand + excluded.on_hand; — excluded is the row that could not be inserted, stock is the row already there."
---
## Statements that change things

Reads are forgiving; writes are not. Three habits keep write scripts
boring, which is the highest compliment a write script can earn.

**Every `UPDATE` and `DELETE` starts with its `WHERE`.** Type the filter
first, then the `SET`. An unqualified `UPDATE` touches every row in the
table and there is no undo outside a transaction.

**Let the database do the arithmetic.** `SET price = ROUND(price * 1.1,
2)` is one statement that stays correct as the data changes; a list of
new prices you calculated by hand is stale the moment someone else
writes a row. And `WHERE year < 2020` quietly skips the `NULL` year —
three-valued logic again, and here it is the behaviour you want.

**Upsert instead of check-then-write.** `INSERT … ON CONFLICT(col) DO
UPDATE` merges a delivery in one pass: rows that do not exist are
inserted, rows that do are updated. Inside the `DO UPDATE`, `excluded`
names the row that could not be inserted, so
`stock.on_hand + excluded.on_hand` reads as "what we had plus what
arrived". The alternative — select, branch, insert or update — is three
round trips and a race condition.

`RETURNING` closes the loop: the write hands back the rows it actually
touched, so you never guess at generated ids or wonder how many rows
matched.

Everything below runs against a fresh copy of the database, so you can
run as often as you like.

### Your goal

Six steps in `query.sql`, in this order:

1. Insert artist 6, `Juno Vale`, `CA`.
2. Insert albums 8 `Fathom` (2025, 27.50) and 9 `Undertow` (2025,
   21.00) for that artist — one statement, `RETURNING id, title`.
3. Raise every pre-2020 price by 10%, rounded to two decimals.
4. Upsert a restock delivery: 5 more of album 1, 2 of album 6.
5. Delete stock rows that have hit zero.
6. Verify: the new and repriced albums with their artist, then the whole
   stock table.

```
id | title
----------
8 | Fathom
...

id | title | price | artist
---------------------------
1 | Paper Lantern | 26.35 | Nina Kestrel
...

album_id | on_hand
------------------
1 | 9
...
```
