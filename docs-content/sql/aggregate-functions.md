# Aggregate functions

Aggregates collapse many rows into one answer: a count, a total, an average. This is where SQL starts feeling like a superpower — questions about *all* the data in one line.

## The big five

```sql
SELECT COUNT(*) FROM orders;         -- how many orders?
SELECT SUM(total) FROM orders;       -- revenue
SELECT AVG(price) FROM products;     -- average price
SELECT MIN(price) FROM products;     -- cheapest
SELECT MAX(price) FROM products;     -- priciest
```

Each returns a single row. You can compute several at once:

```sql
SELECT COUNT(*) AS orders,
       SUM(total) AS revenue,
       AVG(total) AS avg_order
FROM orders;
```

## COUNT(*) vs COUNT(column)

They answer different questions:

- `COUNT(*)` — how many *rows*.
- `COUNT(email)` — how many rows where `email` is *not NULL*.

```sql
SELECT COUNT(*), COUNT(phone) FROM users;
-- 100 | 73   → 27 users have no phone number
```

## Aggregates ignore NULL

`SUM`, `AVG`, `MIN`, and `MAX` skip NULLs entirely. That's usually what you want, but note the subtlety: `AVG(score)` divides by the number of rows *with* a score, not all rows. A student with no grade doesn't drag the average down — they're simply not in it.

If every input is NULL (or there are no rows), `SUM` and `AVG` return NULL, while `COUNT` returns 0.

## COUNT(DISTINCT ...)

Count unique values instead of all values:

```sql
SELECT COUNT(DISTINCT country) FROM users;
-- how many different countries, not how many users
```

## Rounding the output

Averages love ugly decimals. `ROUND` cleans them up:

```sql
SELECT ROUND(AVG(price), 2) AS avg_price FROM products;
-- 24.99 instead of 24.98765432
```

## Aggregates and WHERE play well together

`WHERE` filters rows *first*, then the aggregate summarizes the survivors:

```sql
SELECT AVG(total) FROM orders
WHERE country = 'Canada';
```

One thing you can't do: mix an aggregate with a plain column, like `SELECT name, MAX(price) FROM products` — SQL can't line up one name with one summary of all rows. For "the row with the max", sort and limit instead: `ORDER BY price DESC LIMIT 1`. For per-group summaries, that's `GROUP BY` — the next page.
