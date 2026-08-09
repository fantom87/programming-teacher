---
id: 03-aggregates-and-null
title: How Aggregates Treat NULL
language: sql
runner: browser
estMinutes: 12
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Put SQL's NULL rule on screen: COUNT(*), COUNT(rating), SUM(rating) and AVG(rating) side by side, plus avg_if_zero — the same total divided by every row — to show what AVG is really dividing by."
docs: [sql/aggregate-functions, sql/filtering-with-where]
checks:
  - id: null-comparison-row
    type: stdout
    entry: query.sql
    match: exact
    value: "sales | rated | rating_sum | avg_rating | avg_if_zero\n-----------------------------------------------------\n12 | 8 | 33 | 4.125 | 2.75\n"
  - id: real-avg-and-real-division
    type: ai-judge
    rubric: "One SELECT over sales with five aliased columns. avg_rating is a genuine AVG(rating) call, and avg_if_zero divides the SUM(rating) by the full row count using a float-forcing form such as SUM(rating) * 1.0 / COUNT(*) or CAST(...AS REAL) — not integer division, and not a typed literal. None of 12, 8, 33, 4.125, or 2.75 appears as a constant."
hints:
  - "Four of the five columns are plain aggregate calls over the same table: COUNT(*), COUNT(rating), SUM(rating), AVG(rating). Only the last one needs arithmetic."
  - "avg_if_zero is the ratings total spread across every sale, rated or not: SUM(rating) / COUNT(*). Compare what you get to avg_rating."
  - "Two integers divided in SQLite give an integer — 33 / 12 is 2. Force real division by multiplying one side by 1.0: SUM(rating) * 1.0 / COUNT(*)."
---
## Missing isn't zero

Four bakery customers never left a star rating, so those rows hold `NULL` —
SQL's way of saying *no value here*. The question that decides whether your
numbers are trustworthy is: what does an aggregate do when it meets one?

The rule is short. **`SUM`, `AVG`, `MIN` and `MAX` skip NULLs entirely.** They
don't treat them as zero, they don't refuse to run, they simply act as though
those rows weren't there.

For `SUM`, `MIN` and `MAX` that's obviously right — a missing rating shouldn't
drag a total down or become the new minimum. For `AVG` it's the subtle one,
because averaging is a division and NULLs quietly change the denominator:

```sql
SELECT AVG(rating) FROM sales;
```

That is the total of the ratings divided by **the number of rows that have
one** — not by the number of sales. It's the average rating *among rated
sales*, which is usually exactly the question you meant. But say it out loud
before you publish it, because "our average rating" and "our average rating
among people who bothered to rate" are different claims.

Want the other number — the pessimistic one where every silent customer counts
as a zero? Then do the division yourself:

```sql
SELECT SUM(rating) * 1.0 / COUNT(*) FROM sales;
```

The `* 1.0` matters. Divide two integers in SQLite and you get an integer:
`33 / 12` is `2`, not `2.75`. Nudging one side into decimal territory keeps the
fraction alive.

Two aggregates opt out of the skip: `COUNT(*)` counts rows regardless, and
`COUNT(column)` counts non-NULLs. Between them you can always see how much is
missing.

### Your goal

Put the whole story in one row — the row count, the rated count, the ratings
total, SQL's average, and the average you'd get if missing meant zero.

```
sales | rated | rating_sum | avg_rating | avg_if_zero
-----------------------------------------------------
12 | 8 | 33 | 4.125 | 2.75
```

Same data, two very different averages. That's the lesson.
