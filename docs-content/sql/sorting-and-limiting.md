# Sorting and limiting

Rows come back in no guaranteed order unless you ask for one. `ORDER BY` asks.

## ORDER BY

```sql
SELECT name, price
FROM products
ORDER BY price;
```

Ascending (smallest first) is the default. Add `DESC` for descending, `ASC` if you want to be explicit:

```sql
SELECT name, price
FROM products
ORDER BY price DESC;    -- most expensive first
```

## Sorting by multiple columns

Later columns break ties in earlier ones:

```sql
SELECT name, country, age
FROM users
ORDER BY country, age DESC;
```

That groups users by country alphabetically, and *within* each country puts the oldest first. Each column gets its own direction.

## Sorting by expressions and aliases

You can sort by something you computed — including an alias from the SELECT list:

```sql
SELECT name, price * quantity AS total
FROM order_items
ORDER BY total DESC;
```

`ORDER BY LENGTH(name)` and similar expressions work too. NULLs sort *first* in ascending order in SQLite — they count as smaller than everything.

## LIMIT: top-N queries

`ORDER BY` plus `LIMIT` is the classic "top N" pattern:

```sql
-- the 5 most expensive products
SELECT name, price
FROM products
ORDER BY price DESC
LIMIT 5;
```

Without the `ORDER BY`, `LIMIT 5` gives you *some* five rows — fine for previewing, meaningless for ranking.

## OFFSET: skipping rows

`OFFSET` skips rows before counting the limit, which gives you pagination:

```sql
-- page 1: rows 1-10
SELECT name FROM products ORDER BY name LIMIT 10;

-- page 2: rows 11-20
SELECT name FROM products ORDER BY name LIMIT 10 OFFSET 10;

-- page 3: rows 21-30
SELECT name FROM products ORDER BY name LIMIT 10 OFFSET 20;
```

## Clause order matters

SQL is strict about the order you write clauses:

```sql
SELECT columns
FROM table
WHERE conditions
ORDER BY sort_columns
LIMIT n OFFSET m;
```

`WHERE` before `ORDER BY`, `ORDER BY` before `LIMIT`. Swap them and you get a syntax error — the database wants its sentence in a fixed shape.
