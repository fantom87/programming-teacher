---
id: 08-joining-many-tables
title: Joining Many Tables
language: sql
runner: browser
estMinutes: 16
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Chain five tables into one line-item report — customer, title, category, computed line total — then widen the customer link to a LEFT JOIN so the guest order's line comes back."
docs: [sql/joins, sql/select-basics]
checks:
  - id: line-items
    type: stdout
    entry: query.sql
    match: exact
    value: "customer | title | category | line_total\n----------------------------------------\nMara | Deep Field | Science | 22.75\nMara | The Silent Tide | Fiction | 14.95\nDevon | Bread Alone | Cooking | 36.50\nMara | Orbit | Science | 29.97\nInes | The Silent Tide | Fiction | 14.95\nDevon | Night Kitchen | Cooking | 16.45\nDevon | Orbit | Science | 9.99\nTom | Deep Field | Science | 22.75\nMara | Night Kitchen | Cooking | 16.45\nMara | The Silent Tide | Fiction | 29.90\n\ncustomer | title | line_total\n-----------------------------\nMara | Deep Field | 22.75\nMara | The Silent Tide | 14.95\nDevon | Bread Alone | 36.50\nMara | Orbit | 29.97\nInes | The Silent Tide | 14.95\nDevon | Night Kitchen | 16.45\nDevon | Orbit | 9.99\nTom | Deep Field | 22.75\nNULL | Bread Alone | 18.25\nMara | Night Kitchen | 16.45\nMara | The Silent Tide | 29.90\n"
  - id: one-chain-one-widened-link
    type: ai-judge
    rubric: "Both statements are single queries that reach every table they need through JOIN clauses, each with an ON linking to a table already in the chain. The line total is computed as price times quantity in the query, never typed as a literal. The only difference in the second statement is that the customers join became a LEFT JOIN (the order_items and books joins stay inner), which is why the guest order's line reappears with a NULL customer."
hints:
  - "Add one table at a time and run after each: FROM orders AS o, then JOIN customers, then JOIN order_items, then JOIN books, then JOIN categories. Each new ON references a table already in the chain."
  - "The line total is arithmetic across two tables: printf('%.2f', b.price * oi.quantity) AS line_total — printf keeps the trailing zero that plain multiplication would drop."
  - "For part 2 change exactly one keyword: JOIN customers AS c becomes LEFT JOIN customers AS c. The order still joins its items and books normally, so the guest line survives with customer NULL."
---
## Walking the whole chain

Nothing new to learn here — just more of it. A query can join as many
tables as the question needs, and each `JOIN` adds one table with an
`ON` that links it to a table already in the chain:

```sql
FROM orders AS o
JOIN customers   AS c   ON c.id  = o.customer_id
JOIN order_items AS oi  ON oi.order_id = o.id
JOIN books       AS b   ON b.id  = oi.book_id
JOIN categories  AS cat ON cat.id = b.category_id
```

Read it as a path across the schema: an order knows its customer; an
order has items; an item names a book; a book sits in a category. Five
tables, one row per line item, every column you could want on it. This
is the shape of most real reporting queries — long, boring, and exactly
as wide as the question.

Write these one join at a time and run after each. A five-table query
built in one go and debugged afterwards is miserable; the same query
grown a line at a time tells you immediately which link is wrong.

Now the trap, and it's a good one. Count the rows: ten. But the shop
has eleven order lines. The guest order's line vanished — not because
anything is wrong with `order_items`, but because the chain passes
through `JOIN customers`, and order 7 has no customer to match. **A
chain is only as inclusive as its narrowest link.** One inner join
anywhere silently filters the entire result, however far away the
missing table is from the columns you asked for.

The fix is a single keyword: make that link a `LEFT JOIN` and the line
comes back, customer NULL. Inner and outer joins mix freely in one
chain — you choose, link by link, which relationships are required and
which are optional.

### Your goal

Two statements. First the five-table report — `customer`, `title`,
`category`, `line_total` (price times quantity, `printf('%.2f', ...)`),
ordered by order id then title: 10 rows. Then the same chain without
the category column and with the customer link widened, so the guest
line appears as `NULL | Bread Alone | 18.25`: 11 rows.
