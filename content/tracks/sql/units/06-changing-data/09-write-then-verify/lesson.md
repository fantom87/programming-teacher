---
id: 09-write-then-verify
title: Write, Then Verify
language: sql
runner: browser
estMinutes: 16
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Write the roastery's closing-time script — an insert whose row a later update depends on, the day's sales, a retirement — and finish it with the two SELECTs that prove the whole thing landed."
docs: [sql/inserting-and-updating, sql/deleting-data]
checks:
  - id: end-of-day-receipt
    type: stdout
    entry: query.sql
    match: exact
    value: "name | bags\n-----------\nCloud Cover | 11\nDeep Well | 12\nHalf Past Four | 40\nHarbor Light | 24\nMorning Ritual | 20\n\nshelf_items | bags_on_hand\n--------------------------\n5 | 107\n"
  - id: ordered-script
    type: ai-judge
    rubric: "query.sql is a sequence of statements in a working order: Harbor Light is INSERTed with 0 bags before the UPDATE that adds 24 to it, and the Brazil DELETE comes after the sales update. Harbor Light's stock arrives via an UPDATE that adds to the existing bags, not by inserting 24 directly. The sales update targets roast = 'light' and subtracts from the existing bags rather than assigning a number per coffee. The script ends with exactly two SELECTs, the second aggregating with COUNT(*) AS shelf_items and SUM(bags) AS bags_on_hand, and the totals 5 and 107 are never typed."
hints:
  - "Statements run top to bottom against the database the previous statement left behind. Step 2 updates a row that only exists because step 1 inserted it — swap those two and the update silently matches nothing."
  - "Sales come off with subtraction across a group: UPDATE coffees SET bags = bags - 4 WHERE roast = 'light'; — two coffees are light roasts, and each loses 4."
  - "The receipt is two statements: SELECT name, bags FROM coffees ORDER BY name; then SELECT COUNT(*) AS shelf_items, SUM(bags) AS bags_on_hand FROM coffees;"
---
## A script is a sequence

Until now each lesson has been one idea and a statement or two to prove
it. Real work doesn't arrive that way. It arrives as a *script*: a
closing-time routine, a nightly import, a migration — a handful of
statements that run together and are meant to leave the database in one
particular state.

The thing to internalise is that **each statement sees the world the
previous one left behind.** The script is not a set of independent
commands submitted in a batch; it's a story with an order:

```sql
INSERT INTO coffees (name, origin, roast, price, bags)
VALUES ('Harbor Light', 'Honduras', 'medium', 15.95, 0);

UPDATE coffees SET bags = bags + 24 WHERE name = 'Harbor Light';
```

The `UPDATE` works only because the `INSERT` ran first. Reverse the two
lines and nothing breaks, nothing errors — the `UPDATE` simply matches
zero rows and moves on, and you're left wondering why the pallet never
landed. Writes that match nothing are silent. That silence is the reason
ordering bugs in SQL scripts are so easy to miss and so annoying to find.

Which is also why a script earns its keep only with the last statement:
the **receipt**. One or two `SELECT`s at the bottom that show, in a form
you can check at a glance, that the story ended where you meant it to.
The pattern is worth stating plainly:

> Change the data. Then ask the database to prove it.

A good receipt has two layers. The detail — every row and the column you
touched — and a summary that a human can compare against expectations:
`COUNT(*)` of what's left, `SUM(bags)` of what's in stock. Detail catches
*which* row went wrong; the summary catches *that* something did.

Here, each run starts from a fresh database and replays `schema.sql` from
the top, so your script always meets the same world. That's a luxury —
but writing every script as if it will be read by someone verifying your
work is not.

### Your goal

Insert, stock, sell, retire, verify — in that order:

```
name | bags
-----------
Cloud Cover | 11
Deep Well | 12
Half Past Four | 40
Harbor Light | 24
Morning Ritual | 20

shelf_items | bags_on_hand
--------------------------
5 | 107
```
