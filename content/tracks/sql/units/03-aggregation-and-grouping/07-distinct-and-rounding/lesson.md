---
id: 07-distinct-and-rounding
title: Distinct Counts and Round Numbers
language: sql
runner: browser
estMinutes: 14
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Report each category's sale count next to COUNT(DISTINCT item) so the difference is visible, and hand the average unit price to ROUND so it prints as money instead of a decimal tail."
docs: [sql/aggregate-functions, sql/group-by-and-having]
checks:
  - id: distinct-items-per-category
    type: stdout
    entry: query.sql
    match: exact
    value: "category | sales | distinct_items | avg_price\n---------------------------------------------\nbread | 4 | 3 | 6.19\ndrink | 3 | 2 | 4.67\npastry | 5 | 4 | 3.75\n"
  - id: distinct-and-round-used
    type: ai-judge
    rubric: "One SELECT over sales with GROUP BY category and ORDER BY category. The sales column is COUNT(*), distinct_items is COUNT(DISTINCT item), and avg_price is ROUND(AVG(unit_price), 2). The distinct count is not obtained by a subquery over a GROUP BY item, the rounding is not done with printf or string trimming, and none of the reported numbers are typed as literals."
hints:
  - "Two counts, one query: COUNT(*) counts rows and COUNT(DISTINCT item) counts different values. DISTINCT goes inside the parentheses, not after SELECT."
  - "ROUND takes two arguments — the value and how many decimal places: ROUND(AVG(unit_price), 2). Wrap the aggregate; don't try to average the rounded values."
  - "Full shape: SELECT category, COUNT(*) AS sales, COUNT(DISTINCT item) AS distinct_items, ROUND(AVG(unit_price), 2) AS avg_price FROM sales GROUP BY category ORDER BY category;"
---
## Counting different things, and printing them nicely

Two small refinements this lesson, both of which turn a technically-correct
report into one you'd actually send to someone.

First, distinct counts. `COUNT(*)` tells you the bakery made five pastry sales.
It does not tell you whether that was five different pastries or the same
croissant five times — and those describe very different mornings. Put
`DISTINCT` **inside** the parentheses and `COUNT` switches from counting rows to
counting different values:

```sql
SELECT COUNT(*)              AS sales,
       COUNT(DISTINCT item)  AS items
FROM sales;
```

The two side by side is the useful bit. Equal numbers mean every sale was a
different product; a large gap means a few favourites doing the heavy lifting.
`DISTINCT` works inside `SUM` and `AVG` too, though it's rarely what you want
there — averaging the *distinct* prices quietly drops your repeat sellers.

Second, rounding. You met the honest ugliness of `AVG` a few lessons back:
`4.791666666666667`. Nobody wants that in a report. `ROUND` takes the value and
the number of decimal places you want:

```sql
ROUND(AVG(unit_price), 2)
```

Order matters, and it's the order you'd say aloud: average all the prices, then
round the answer. Rounding first — averaging a column of already-rounded values
— is a different, slightly wrong calculation, and the difference compounds as
the table grows.

One last thing to expect: `ROUND` gives you a number, not a formatted string.
If a rounded average lands on `4.50`, SQL prints `4.5`, because trailing zeros
aren't part of a number. Padding money to two characters is a job for whatever
displays the result.

### Your goal

One row per category: the category, its sale count, how many *different* items
it sold, and its average unit price to two decimals. Sorted by category.

```
category | sales | distinct_items | avg_price
---------------------------------------------
bread | 4 | 3 | 6.19
drink | 3 | 2 | 4.67
pastry | 5 | 4 | 3.75
```

Every category has a repeat seller — and drinks are down to just two products.
