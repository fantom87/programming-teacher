---
id: 01-where-comparisons
title: Filtering with WHERE
language: sql
runner: browser
estMinutes: 10
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Add a WHERE clause that keeps only products priced under 20.00, and end the query with ORDER BY id so the rows come back in a guaranteed order."
docs: [sql/filtering-with-where, sql/what-is-a-database]
checks:
  - id: cheap-products
    type: stdout
    entry: query.sql
    match: exact
    value: "name | price\n------------\nBamboo Board | 18.75\nCeramic Mug | 9.45\nBeeswax Candle | 7.25\nKraft Notebook | 6.15\n"
  - id: filtered-by-the-database
    type: ai-judge
    rubric: "The single query selects name and price FROM products, filters with a WHERE clause comparing the price column to 20 (a bare number, not a quoted string), and ends with ORDER BY id. The four product names are not typed as literals anywhere — no SELECT of hardcoded values, no UNION of constructed rows, no filtering by id or name to pick the four rows by hand."
hints:
  - "The clause sits between FROM and ORDER BY: SELECT name, price FROM products WHERE <test> ORDER BY id;"
  - "The test compares a column to a number: price < 20. Numbers take no quotes — '20' with quotes is text, and SQL compares text differently."
  - "All together: SELECT name, price FROM products WHERE price < 20 ORDER BY id;"
---
## Asking for fewer rows

Every query you wrote in the last unit came back with the whole table.
That's fine for ten products and useless for ten million. `WHERE` is how
you tell the database which rows you actually care about — and it does
that work *before* a single row travels back to you.

```sql
SELECT name, price
FROM products
WHERE price < 20;
```

Read it as a sentence: *from products, keep the rows where price is
under 20, and show me name and price.* The clause order never changes —
`SELECT`, `FROM`, `WHERE` — even though the database evaluates `FROM`
and `WHERE` first and picks the columns last.

The comparison operators are the ones you'd guess: `=`, `<`, `<=`, `>`,
`>=`, and `<>` for "not equal" (`!=` works too). Note the *single*
equals sign. SQL has no assignment, so one `=` always means comparison.

Text goes in **single quotes**:

```sql
WHERE category = 'kitchen'
```

Double quotes mean something different in SQL — they quote *identifiers*,
the names of tables and columns. Write `"kitchen"` and SQLite will hunt
for a column by that name. Single quotes for text, always.

One habit to start right now: **finish every query with `ORDER BY`**. A
table is a set of rows, not a list, so the database is free to hand them
back in whatever order is cheapest today. Add an index tomorrow and that
order can quietly change. You'll study sorting properly in a few lessons;
until then, end each query with `ORDER BY id` and your results will be
reproducible.

### Your goal

The owner wants an impulse-buy shelf: everything under 20.00. Edit
`query.sql` so it returns `name` and `price` for those products, ordered
by `id`:

```
name | price
------------
Bamboo Board | 18.75
Ceramic Mug | 9.45
Beeswax Candle | 7.25
Kraft Notebook | 6.15
```

`schema.sql` is the shop's catalog — it runs before your query every
time. Read it, but leave it alone.
