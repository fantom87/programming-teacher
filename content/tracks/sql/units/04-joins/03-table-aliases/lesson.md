---
id: 03-table-aliases
title: Table Aliases
language: sql
runner: browser
estMinutes: 12
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Rewrite the join with short table aliases, qualify every column, name the output columns customer / order_id / placed, and filter to the Austin customers."
docs: [sql/joins, sql/select-basics, sql/filtering-with-where]
checks:
  - id: austin-orders
    type: stdout
    entry: query.sql
    match: exact
    value: "customer | order_id | placed\n----------------------------\nDevon | 2 | 2026-03-05\nDevon | 5 | 2026-03-19\nTom | 6 | 2026-03-22\n"
  - id: aliased-and-qualified
    type: ai-judge
    rubric: "The FROM and JOIN clauses declare short table aliases (customers AS c, orders AS o, or the same names without AS). Every column reference in SELECT, ON, WHERE and ORDER BY is qualified with a table alias, and the three output columns are renamed with AS to customer, order_id and placed. The Austin filter is a WHERE on the city column, not a hardcoded list of ids or names."
hints:
  - "Declare the aliases where the tables appear: FROM customers AS c INNER JOIN orders AS o ON ..., then use c. and o. everywhere else."
  - "Both tables have an id column, so o.id and c.id are different columns. The one you want in the output — and in ORDER BY — is the order's: o.id AS order_id."
  - "The whole query: SELECT c.name AS customer, o.id AS order_id, o.order_date AS placed FROM customers AS c INNER JOIN orders AS o ON o.customer_id = c.id WHERE c.city = 'Austin' ORDER BY o.id;"
---
## Short names, no ambiguity

Try adding `id` to last lesson's query and SQLite refuses:

```
Error: ambiguous column name: id
```

Fair enough — `customers` has an `id` and so does `orders`. Once two
tables are in play, a bare column name is only safe when exactly one
table has it, and that's a guarantee that evaporates the moment someone
adds a column. So you **qualify**: say which table you mean.

Writing `customers.customer_id` everywhere gets long fast. Give each
table a short alias right where it enters the query:

```sql
SELECT c.name, o.order_date
FROM customers AS c
INNER JOIN orders AS o ON o.customer_id = c.id
```

`AS c` renames the table *for this query only*. From that point on `c`
is the customers table — in `SELECT`, in `ON`, in `WHERE`, in
`ORDER BY`. The convention is a letter or two that hints at the table:
`c`, `o`, `oi` for order_items. Once you're aliasing, qualify
everything, even the unambiguous columns: `o.order_date` tells the next
reader (you, in a month) which table a column came from without
scrolling up to the schema.

The same `AS` renames output columns, and that's worth doing too — a
report column headed `placed` reads better than `order_date`, and
`order_id` says something `id` doesn't. One catch: a column alias
labels the *result*, and standard SQL builds that result after `WHERE`
has already run, so most engines reject a filter that mentions an
alias. SQLite is lenient and allows it — write the real expression in
`WHERE` anyway, and the query still works the day it moves to Postgres.
`ORDER BY` is safe everywhere, because sorting happens last of all.

`AS` is optional for table aliases — `FROM customers c` works
identically. Pick one style and hold it.

### Your goal

One statement, restricted to the Austin customers, producing exactly:

```
customer | order_id | placed
----------------------------
Devon | 2 | 2026-03-05
Devon | 5 | 2026-03-19
Tom | 6 | 2026-03-22
```

Alias both tables, qualify every column reference, and rename all three
output columns.
