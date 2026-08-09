# Filtering with WHERE

`WHERE` keeps only the rows that pass a test. It sits between `FROM` and everything else:

```sql
SELECT name, age
FROM users
WHERE age >= 18;
```

The comparison operators: `=`, `<>` (not equal, `!=` also works), `<`, `<=`, `>`, `>=`. Text goes in single quotes:

```sql
SELECT * FROM users WHERE country = 'Canada';
```

## Combining conditions

`AND`, `OR`, and `NOT` build bigger tests:

```sql
SELECT * FROM products
WHERE price < 20 AND in_stock = 1;

SELECT * FROM users
WHERE country = 'Canada' OR country = 'Mexico';
```

`AND` binds tighter than `OR`, which causes classic bugs. Use parentheses whenever you mix them:

```sql
-- cheap items that are either books or games
WHERE price < 10 AND (category = 'book' OR category = 'game')
```

## IN and BETWEEN

`IN` tests membership in a set — cleaner than chained ORs:

```sql
WHERE country IN ('Canada', 'Mexico', 'Brazil')
```

`BETWEEN` tests a range, *inclusive on both ends*:

```sql
WHERE price BETWEEN 10 AND 20    -- includes 10 and 20
```

## LIKE: pattern matching

`LIKE` matches text patterns. `%` means "any characters (or none)", `_` means "exactly one character":

```sql
WHERE email LIKE '%@gmail.com'   -- ends with @gmail.com
WHERE name LIKE 'A%'             -- starts with A
WHERE code LIKE 'A__'            -- A plus exactly two characters
```

In SQLite, `LIKE` is case-insensitive for plain ASCII letters by default.

## NULL: the missing value

`NULL` means "no value here" — not zero, not empty text, just absent. And it's contagious: comparing anything to NULL with `=` gives neither true nor false, so the row silently fails the filter.

```sql
WHERE age = NULL      -- matches nothing, ever!
WHERE age IS NULL     -- correct: rows with no age
WHERE age IS NOT NULL -- rows that do have one
```

This trips everyone up eventually: `WHERE age <> 30` does *not* include rows where age is NULL. If you want them, say so: `WHERE age <> 30 OR age IS NULL`.
