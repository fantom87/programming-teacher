# Indexes

Without an index, `WHERE email = 'ada@example.com'` makes the database read *every row* and check it — a full table scan. Fine at 100 rows, painful at 10 million. An index is a sorted lookup structure, like a book's index, that jumps straight to the matching rows.

## Creating an index

```sql
CREATE INDEX idx_users_email ON users (email);
```

That's it. Queries don't change at all — the database notices the index exists and uses it when it helps:

```sql
SELECT * FROM users WHERE email = 'ada@example.com';
-- now a quick lookup instead of a scan
```

A `UNIQUE` index enforces uniqueness while it speeds things up:

```sql
CREATE UNIQUE INDEX idx_users_email ON users (email);
```

(Primary keys and `UNIQUE` constraints get indexes automatically — that's how they check duplicates fast.)

## Seeing what the database does: EXPLAIN QUERY PLAN

Don't guess whether an index is used — ask:

```sql
EXPLAIN QUERY PLAN
SELECT * FROM users WHERE email = 'ada@example.com';
```

```
SEARCH users USING INDEX idx_users_email (email=?)
```

`SEARCH ... USING INDEX` means the index is working. `SCAN users` means a full table scan — either no useful index exists, or the query can't use it (e.g. `WHERE LOWER(email) = ...` wraps the column in a function, hiding it from the index).

## Multi-column indexes

An index can cover several columns, sorted by the first, then the second:

```sql
CREATE INDEX idx_orders_cust_date ON orders (customer_id, order_date);
```

This serves `WHERE customer_id = 5` and `WHERE customer_id = 5 AND order_date > '2024-01-01'` — but *not* a query filtering on `order_date` alone. Like a phone book sorted by last name then first: useless for finding everyone named "Grace". Column order matters.

## The cost

Indexes aren't free. Every INSERT, UPDATE, and DELETE must also update each index, and they take disk space. The craft:

- Index columns you actually filter, join, or sort on frequently.
- Foreign key columns (like `orders.customer_id`) are almost always worth indexing.
- Don't index everything "just in case" — measure with `EXPLAIN QUERY PLAN` first.

Rule of thumb: write the query, check the plan, add the index the plan is begging for.
