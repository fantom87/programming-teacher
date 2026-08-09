---
id: 02-inner-join
title: INNER JOIN
language: sql
runner: browser
estMinutes: 12
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Replace last lesson's two-step lookup with a single INNER JOIN that pairs every order with the name of the customer who placed it, ordered by order id."
docs: [sql/joins, sql/what-is-a-database]
checks:
  - id: orders-with-names
    type: stdout
    entry: query.sql
    match: exact
    value: "name | order_date\n-----------------\nMara | 2026-03-02\nDevon | 2026-03-05\nMara | 2026-03-11\nInes | 2026-03-14\nDevon | 2026-03-19\nTom | 2026-03-22\nMara | 2026-04-01\n"
  - id: really-a-join
    type: ai-judge
    rubric: "One statement that gets both columns from a real join: FROM customers with INNER JOIN orders (or JOIN orders) and an ON condition matching orders.customer_id to customers.id. Not two separate queries, not a subquery, not a comma-separated FROM list with the match written in WHERE, and no customer names typed as literals."
hints:
  - "The shape is FROM customers INNER JOIN orders ON <how a row of one matches a row of the other>."
  - "The matching rule is the foreign key you followed by hand last lesson: ON orders.customer_id = customers.id."
  - "Full query: SELECT customers.name, orders.order_date FROM customers INNER JOIN orders ON orders.customer_id = customers.id ORDER BY orders.id;"
---
## One query instead of two

Last lesson you carried an id from one query to the next in your head.
`JOIN` does that for you — and does it for every row at once:

```sql
SELECT customers.name, orders.order_date
FROM customers
INNER JOIN orders ON orders.customer_id = customers.id
ORDER BY orders.id;
```

Read it as an instruction to the database: *take the customers table,
bring in the orders table, and pair a customer row with an order row
whenever `orders.customer_id` equals `customers.id`.* Each pairing
becomes one output row, wide enough to hold columns from both tables.
The `ON` clause is the whole game — it is the rule that decides which
rows belong together.

Two things worth noticing in your result. Mara appears three times: she
placed three orders, and a join produces **one row per match**, not one
row per customer. And the result has seven rows, not eight — the shop
has eight orders.

Both facts come from the same rule. `INNER` means *keep only rows that
found a partner*. Order 7 was a guest checkout with `customer_id NULL`,
so it matches no customer and drops out. Priya has never ordered, so
she matches no order and drops out too. An inner join silently narrows
your data to the rows that pair up on both sides — which is exactly
what you want here, and exactly what will bite you the day you're
counting customers and quietly lose the ones with nothing to count.
The next lesson keeps them.

`JOIN` on its own means `INNER JOIN`; you'll see both in the wild.
Spell out `INNER` while you're learning — later, when `LEFT JOIN` is in
your fingers too, the contrast is what makes the code readable.

### Your goal

One statement in `query.sql`, producing exactly:

```
name | order_date
-----------------
Mara | 2026-03-02
Devon | 2026-03-05
Mara | 2026-03-11
Ines | 2026-03-14
Devon | 2026-03-19
Tom | 2026-03-22
Mara | 2026-04-01
```

Order by `orders.id` — the dates come out chronological because the
shop's ids grew that way, not by accident.
