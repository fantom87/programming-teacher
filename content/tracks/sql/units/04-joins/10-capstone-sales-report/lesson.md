---
id: 10-capstone-sales-report
title: "Capstone: Sales Report"
language: sql
runner: browser
estMinutes: 30
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Turn the five-table shop database into a four-part sales report — headline totals, a category breakdown that keeps the category nobody bought, a customer leaderboard that keeps the customer who never ordered, and the list of books no order has ever included — with every number computed by SQL."
docs: [sql/joins, sql/group-by-and-having, sql/aggregate-functions]
checks:
  - id: the-report
    type: stdout
    entry: query.sql
    match: exact
    value: "orders | copies | revenue\n-------------------------\n8 | 15 | 232.91\n\ncategory | copies | revenue\n---------------------------\nCooking | 5 | 87.65\nScience | 6 | 85.46\nFiction | 4 | 59.80\nPoetry | 0 | 0.00\n\ncustomer | orders | spent\n-------------------------\nMara | 3 | 114.02\nDevon | 2 | 62.94\nTom | 1 | 22.75\nInes | 1 | 14.95\nPriya | 0 | 0.00\n\ntitle | category\n----------------\nSmall Hours | Poetry\n"
  - id: every-number-computed
    type: ai-judge
    rubric: "Four statements, every figure derived from the tables. Part 1 joins orders to order_items to books and aggregates COUNT(DISTINCT o.id), SUM(quantity) and SUM(price * quantity). Part 2 starts FROM categories and reaches books and order_items with LEFT JOINs so the unsold category survives, groups by category, and turns its NULL sums into 0 and 0.00 (COALESCE, IFNULL or an equivalent). Part 3 starts FROM customers and LEFT JOINs orders, order_items and books so the customer with no orders survives with 0 and 0.00, counting orders with COUNT(DISTINCT o.id). Part 4 finds unsold books with an anti-join (LEFT JOIN order_items ... WHERE the item key IS NULL), not NOT IN or a literal title. Money is formatted to two decimals in SQL, every statement has a deterministic ORDER BY, and none of the numbers 8, 15, 232.91, 87.65, 85.46, 59.80, 114.02, 62.94 or the title Small Hours appear as literals."
hints:
  - "Part 1 is one inner-join chain plus aggregates over the whole result — no GROUP BY, because you want a single row. COUNT(DISTINCT o.id) counts orders even though the join gave some of them two rows."
  - "Parts 2 and 3 are outer-join reports: start FROM the table you must keep every row of, then LEFT JOIN your way out to the numbers. SUM over no matching rows is NULL, not 0, so wrap it: COALESCE(SUM(b.price * oi.quantity), 0). Sort by that same expression, not by the formatted text."
  - "Money: printf('%.2f', ...) — a bare SUM would print 59.8 and 0. Part 4 is the anti-join from lesson 5, one table wider: FROM books b JOIN categories cat ON cat.id = b.category_id LEFT JOIN order_items oi ON oi.book_id = b.id WHERE oi.book_id IS NULL."
---
## The sales report

This is the Core capstone, and it's the job joins exist for: five
tables, one report, four questions a shop owner would actually ask. No
new syntax — every piece is something you've used this unit. The
capstone rule holds: **every number is computed from the data.** Change
a price in `schema.sql` and the report should change with it.

Work part by part, running after each. The parts are independent, so a
broken one can't hide behind a working one.

**Part 1 — the headline.** One row: how many orders, how many copies,
how much money. Join `orders` to `order_items` to `books` and aggregate
the lot. Watch the order count: the join gives multi-book orders more
than one row, so `COUNT(*)` would flatter you — count distinct order
ids. This total includes the guest checkout, because nothing here joins
to `customers`.

**Part 2 — by category.** Every category, with copies sold and revenue,
best first. Poetry has sold nothing and must still appear, as `0` and
`0.00` — so this report starts `FROM categories` and reaches outward
with `LEFT JOIN`s. A `SUM` over no rows is NULL, not zero; that's what
`COALESCE` is for. Sort by the computed revenue, not by the formatted
string — compared as text, "9.99" outranks "87.65".

**Part 3 — by customer.** Same shape, mirrored: every customer, their
order count, their spend, biggest spender first. Priya has never
ordered and must show `0` and `0.00`.

**Part 4 — shelf-warmers.** Books no order has ever included. An
anti-join, plus the category so the buyer knows where to look.

### Your goal

`query.sql` prints exactly:

```
orders | copies | revenue
-------------------------
8 | 15 | 232.91

category | copies | revenue
---------------------------
Cooking | 5 | 87.65
Science | 6 | 85.46
Fiction | 4 | 59.80
Poetry | 0 | 0.00

customer | orders | spent
-------------------------
Mara | 3 | 114.02
Devon | 2 | 62.94
Tom | 1 | 22.75
Ines | 1 | 14.95
Priya | 0 | 0.00

title | category
----------------
Small Hours | Poetry
```

An AI reviewer checks that the zeros come from outer joins rather than
typing, and that no total is hardcoded. Ship it and the Core tier is
yours — you can now ask a relational database a real question.
