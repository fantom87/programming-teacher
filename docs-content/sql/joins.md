# Joins

Real data is split across tables: customers in one, orders in another, linked by an id. A *join* stitches them back together for a query.

```
customers                orders
id | name                id | customer_id | total
---+------               ---+-------------+------
1  | Ada                 1  | 1           | 50
2  | Grace               2  | 1           | 30
3  | Linus               3  | 2           | 99
```

`customers.id` is a **primary key** (uniquely identifies a row); `orders.customer_id` is a **foreign key** pointing at it.

## INNER JOIN: matching rows

```sql
SELECT customers.name, orders.total
FROM customers
INNER JOIN orders ON orders.customer_id = customers.id;
```

The `ON` condition says how rows pair up. Each order finds its customer; the result has one row per match. Linus, who has no orders, doesn't appear at all — inner joins keep *only* matches.

Table aliases keep this readable, and qualify columns when names collide:

```sql
SELECT c.name, o.total
FROM customers AS c
INNER JOIN orders AS o ON o.customer_id = c.id;
```

## LEFT JOIN: keeping unmatched rows

A `LEFT JOIN` keeps every row from the left table, matched or not. Unmatched rows get NULLs on the right side:

```sql
SELECT c.name, o.total
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id;
-- Linus | NULL   ← still here
```

That NULL is useful — it's how you find what's *missing*:

```sql
-- customers who have never ordered
SELECT c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;
```

(SQLite also supports `RIGHT` and `FULL OUTER JOIN`, but you can always rewrite them with `LEFT JOIN` by swapping table order.)

## Joining more tables

Chain joins to walk across relationships:

```sql
SELECT c.name, p.title, oi.quantity
FROM customers c
JOIN orders o      ON o.customer_id = c.id
JOIN order_items oi ON oi.order_id = o.id
JOIN products p    ON p.id = oi.product_id;
```

`order_items` here is a *junction table* — it turns a many-to-many relationship (orders contain many products, products appear in many orders) into two one-to-many links.

One warning: forget the `ON` (or use `CROSS JOIN`) and you get every row paired with every row — a small typo, an enormous result.
