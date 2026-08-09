# Subqueries

A subquery is a query inside another query, wrapped in parentheses. The inner query runs, its result gets used by the outer one.

## Scalar subqueries: one value

When a subquery returns a single value, use it anywhere a value fits:

```sql
-- products more expensive than average
SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);
```

You can't write `WHERE price > AVG(price)` directly — aggregates aren't allowed in WHERE — so the subquery computes the average first, then the outer query compares against it.

## Subqueries with IN

A subquery returning one column works with `IN`:

```sql
-- customers who placed an order in 2024
SELECT name FROM customers
WHERE id IN (SELECT customer_id FROM orders
             WHERE order_date >= '2024-01-01');
```

Careful with `NOT IN`: if the subquery returns any NULL, `NOT IN` matches *nothing* (NULL logic strikes again). Filter NULLs out, or use `NOT EXISTS`.

## Correlated subqueries: once per row

A subquery can reference the outer row — then it conceptually reruns for each one:

```sql
-- each product's rank within its category, the hard way:
-- products cheaper than their own category's average
SELECT name, price
FROM products p
WHERE price < (SELECT AVG(price)
               FROM products
               WHERE category = p.category);
```

The inner query's answer depends on `p.category`, so each row gets its own comparison.

## EXISTS: does a match exist?

`EXISTS` asks a yes/no question — "is there at least one matching row?" — without fetching data:

```sql
SELECT name FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o
              WHERE o.customer_id = c.id);

-- and its mirror: customers with no orders
WHERE NOT EXISTS (SELECT 1 FROM orders o
                  WHERE o.customer_id = c.id);
```

`NOT EXISTS` is the NULL-safe way to find missing things.

## Derived tables: subqueries in FROM

A subquery in `FROM` acts as a temporary table (it needs an alias):

```sql
SELECT country, avg_age
FROM (SELECT country, AVG(age) AS avg_age
      FROM users GROUP BY country) AS stats
WHERE avg_age > 30;
```

When these get deep, they get unreadable — that's exactly the problem CTEs solve, on the next page.
