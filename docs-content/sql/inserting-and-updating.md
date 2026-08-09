# Inserting and updating

`SELECT` reads. `INSERT` and `UPDATE` write. Same language, higher stakes.

## INSERT: adding rows

```sql
INSERT INTO users (name, email, age)
VALUES ('Ada', 'ada@example.com', 36);
```

The column list and the values line up one-to-one. Columns you omit get their `DEFAULT` value if one is defined, otherwise NULL (or an error, if the column is `NOT NULL` with no default). Insert several rows at once:

```sql
INSERT INTO users (name, email) VALUES
  ('Grace', 'grace@example.com'),
  ('Linus', 'linus@example.com');
```

## INSERT ... SELECT: copying data

The values can come from a query — great for archiving, seeding, or transforming:

```sql
INSERT INTO archived_orders (id, customer_id, total)
SELECT id, customer_id, total
FROM orders
WHERE order_date < '2020-01-01';
```

## UPDATE: changing rows

```sql
UPDATE products
SET price = price * 1.1
WHERE category = 'book';
```

`SET` says what changes; `WHERE` says which rows. **The WHERE is what stands between you and updating every row in the table.** `UPDATE products SET price = 0` — no WHERE — zeroes all prices. Before any UPDATE, run the same WHERE as a SELECT to see exactly which rows you're about to touch:

```sql
SELECT * FROM products WHERE category = 'book';  -- check first
```

Multiple columns update in one statement: `SET price = 9.99, in_stock = 1`.

## Upsert: INSERT or UPDATE, whichever fits

"Insert this row, unless it already exists — then update it instead." SQLite spells that `ON CONFLICT`:

```sql
INSERT INTO settings (key, value)
VALUES ('theme', 'dark')
ON CONFLICT(key) DO UPDATE SET value = excluded.value;
```

`excluded` refers to the row you *tried* to insert. The conflict target (`key` here) must have a UNIQUE or PRIMARY KEY constraint.

## RETURNING: see what you changed

Add `RETURNING` to any write to get the affected rows back:

```sql
INSERT INTO users (name) VALUES ('Ada')
RETURNING id;                      -- the new auto-assigned id

UPDATE products SET price = price * 1.1
WHERE category = 'book'
RETURNING name, price;             -- each book's new price
```

End every data-changing script with a verifying SELECT. Trust, but verify.
