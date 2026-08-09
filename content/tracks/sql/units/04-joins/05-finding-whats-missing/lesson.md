---
id: 05-finding-whats-missing
title: Finding What's Missing
language: sql
runner: browser
estMinutes: 14
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Use the anti-join pattern — LEFT JOIN, then WHERE the right side IS NULL — twice: once for customers who have never ordered, once for orders with no customer account behind them."
docs: [sql/joins, sql/filtering-with-where]
checks:
  - id: the-missing-rows
    type: stdout
    entry: query.sql
    match: exact
    value: "name\n----\nPriya\n\nid | order_date\n---------------\n7 | 2026-03-25\n"
  - id: anti-join-pattern
    type: ai-judge
    rubric: "Both statements use the anti-join pattern: a LEFT JOIN followed by a WHERE that tests a column of the right-hand table with IS NULL. The column tested is the right table's primary key (o.id in the first, c.id in the second) — not a nullable column such as o.customer_id. Neither answer is produced with NOT IN, a subquery, or literal values; the second statement starts FROM orders so the orders table is on the left."
hints:
  - "Start from the LEFT JOIN you already wrote: every customer, with NULLs where no order matched. The rows you want are exactly the ones showing NULL."
  - "Add WHERE o.id IS NULL. It runs after the join, so it can see the placeholder NULLs the join produced — a plain WHERE on the orders table alone could never find them."
  - "For part 2, swap which table is on the left: FROM orders AS o LEFT JOIN customers AS c ON c.id = o.customer_id WHERE c.id IS NULL ORDER BY o.id;"
---
## Absence is data

Some of the most valuable questions a database answers are about rows
that *aren't* there. Customers who never bought. Books nobody ordered.
Invoices with no payment. Each one is a hole, and holes don't show up
in an inner join — that's precisely what an inner join throws away.

But you already have the tool. A `LEFT JOIN` marks every hole with
NULLs; you just have to filter for them:

```sql
SELECT c.name
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.id
WHERE o.id IS NULL
ORDER BY c.name;
```

Three steps, in the order the database runs them: keep every customer,
attach orders where they exist, then throw away everyone who found one.
What's left is the customers who found nothing. This shape has a name —
the **anti-join** — and once you can see it you'll write it constantly.

Two details make it correct rather than nearly correct.

**Test the right table's primary key.** `WHERE o.id IS NULL` is safe
because `orders.id` can never be NULL in a real row: if it's NULL here,
the join invented it. Testing `o.customer_id` instead would be a bug —
the guest order has a genuine NULL there, so a real row would sneak
into your "no match" list.

**The filter has to run after the join.** `WHERE` sees the joined rows,
NULL placeholders and all. That's why an anti-join works at all, and
why moving the condition into `ON` would change the answer entirely —
`ON` decides what matches, `WHERE` decides what survives.

Flip the tables and the same pattern answers the mirror question: which
*orders* have no customer? Put `orders` on the left this time.

### Your goal

Two statements, producing exactly:

```
name
----
Priya

id | order_date
---------------
7 | 2026-03-25
```

Order 7 is the guest checkout — a real order with no account behind it.
