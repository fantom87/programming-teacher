# SELECT basics

`SELECT` is how you ask a database questions. Every query returns a *result set* — a temporary table of rows built to your order.

## SELECT and FROM

The minimal query: which columns, from which table.

```sql
SELECT name, age
FROM users;
```

Columns come back in the order you list them, so `SELECT age, name` flips them. To get every column, use `*`:

```sql
SELECT * FROM users;
```

`SELECT *` is great for exploring a table, but in real code prefer naming columns — it documents what you actually need and doesn't break when the table grows.

## Expressions, not just columns

The SELECT list can compute things:

```sql
SELECT name, price, price * 0.9
FROM products;
```

That third column is calculated per row. Arithmetic (`+ - * /`), string functions, and more all work here:

```sql
SELECT UPPER(name), LENGTH(email)
FROM users;
```

Concatenate text with `||`:

```sql
SELECT name || ' <' || email || '>' FROM users;
-- Ada <ada@example.com>
```

## Aliases with AS

Computed columns get ugly auto-generated names. `AS` renames them:

```sql
SELECT name, price * 0.9 AS sale_price
FROM products;
```

You can alias plain columns too (`SELECT name AS product`). The `AS` keyword is optional — `price * 0.9 sale_price` also works — but keeping it makes queries easier to read.

## DISTINCT: collapse duplicates

`DISTINCT` removes duplicate rows from the result:

```sql
SELECT DISTINCT country FROM users;
```

Without it you'd get one `country` per user — with it, each country appears once. It applies to the whole row: `SELECT DISTINCT city, country` keeps each unique *pair*.

## LIMIT: preview safely

Big tables can have millions of rows. `LIMIT` caps how many come back:

```sql
SELECT * FROM orders LIMIT 10;
```

Make this a habit when exploring an unfamiliar table: `SELECT * ... LIMIT 10` shows you the shape of the data without drowning you in it.
