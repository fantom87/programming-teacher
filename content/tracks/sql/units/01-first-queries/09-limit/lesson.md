---
id: 09-limit
title: Just a Peek with LIMIT
language: sql
runner: browser
estMinutes: 10
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Cap a result set with LIMIT 3, returning title and price for only the first three rows in id order."
docs: [sql/sorting-and-limiting, sql/select-basics]
checks:
  - id: first-three-rows
    type: stdout
    entry: query.sql
    match: exact
    value: "title | price\n-------------\nDune | 12.95\nNeuromancer | 9.25\nThe Left Hand of Darkness | 11.75\n"
hints:
  - "The clause that caps the row count is the last one in the query, after ORDER BY."
  - "LIMIT takes a number: LIMIT 3 stops after three rows."
  - "SELECT title, price FROM books ORDER BY id LIMIT 3;"
---
## Stop after three

The `books` table has eight rows, so every query so far has printed a
tidy little block. Real tables aren't like that. A shop's sales table
holds a few million rows, and `SELECT * FROM sales` on that is a mistake
you make once: the database dutifully assembles millions of rows, ships
them across the network, and your tool locks up trying to draw them.

The seatbelt is one clause at the very end:

```sql
SELECT title, price
FROM books
ORDER BY id
LIMIT 3;
```

Three rows, then the database stops. `LIMIT` is the last clause in a
query, and it takes a plain number.

The order matters more than it looks. The engine sorts first and *then*
takes the top rows, so `ORDER BY id LIMIT 3` means "the first three by
id" — a stable, repeatable answer. Drop the `ORDER BY` and you've asked
for "any three", which the database is free to answer differently
tomorrow. `LIMIT` without `ORDER BY` is one of the great sources of "but
it worked yesterday" in data work.

Once you've got both clauses, you also have the top-N report:

```sql
SELECT title, price
FROM books
ORDER BY price DESC
LIMIT 3;
```

Sort by price, highest first, keep three — the three most expensive books
in the shop. Next unit takes `ORDER BY` apart properly (`DESC`, several
columns, sorting by expressions) and adds `OFFSET`, which skips rows before
counting and turns `LIMIT` into pagination.

Make this your reflex with any table you've never met: `SELECT * FROM
whatever LIMIT 10`. You learn the column names, the shape of the values,
and whether the data is what you were promised — at no cost, however
enormous the table turns out to be.

### Your goal

Take a peek at the shop: `title` and `price`, ordered by `id`, first
three rows only.

```
title | price
-------------
Dune | 12.95
Neuromancer | 9.25
The Left Hand of Darkness | 11.75
```
