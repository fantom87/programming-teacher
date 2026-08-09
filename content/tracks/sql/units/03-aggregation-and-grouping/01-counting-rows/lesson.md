---
id: 01-counting-rows
title: Counting Rows
language: sql
runner: browser
estMinutes: 10
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Return one row with two counts from the sales table: COUNT(*) as sales for the row count, and COUNT(rating) as rated for the rows that actually carry a rating."
docs: [sql/aggregate-functions, sql/select-basics]
checks:
  - id: two-counts
    type: stdout
    entry: query.sql
    match: exact
    value: "sales | rated\n-------------\n12 | 8\n"
  - id: counted-not-typed
    type: ai-judge
    rubric: "Both numbers come from aggregate functions applied to the sales table in a single SELECT: COUNT(*) for the row count and COUNT(rating) for the rated count. Neither 12 nor 8 appears as a literal in the query, and the rated figure is not produced by a WHERE rating IS NOT NULL filter or a nested subquery — the point is that COUNT(column) skips NULLs by itself."
hints:
  - "Both answers fit in one SELECT list: SELECT COUNT(*) AS sales, ... FROM sales; — aggregates are expressions, so they take AS aliases like any other column."
  - "COUNT(*) counts rows without looking inside them. To count only the sales that carry a rating, hand COUNT the column itself: COUNT(rating)."
  - "The full query is SELECT COUNT(*) AS sales, COUNT(rating) AS rated FROM sales; — no WHERE clause anywhere, because COUNT(rating) already ignores the NULLs."
---
## One number instead of twelve rows

Every query so far handed you back rows — one line per record that matched.
Aggregate functions do the opposite: they **collapse** many rows into a single
answer. Twelve sales go in, one number comes out.

For this whole unit you're the analyst at Bluebird Bakery, and `sales` is your
table — one week, twelve rows:

```
id  item            category  channel  qty  unit_price  rating
1   croissant       pastry    counter   12  3.25        5
5   almond tart     pastry    online     4  5.50        NULL
10  latte           drink     counter   20  4.50        5
```

Three categories (`pastry`, `bread`, `drink`), two channels (`counter`,
`online`), and a `rating` that is sometimes missing. Open `schema.sql` any time
you want the rest; `query.sql` has a commented-out peek line too.

The simplest aggregate is `COUNT`:

```sql
SELECT COUNT(*) FROM sales;
```

`COUNT(*)` means *count the rows*. It never looks inside them, so nothing about
the columns can change the answer. What comes back is one row, one column.

Now the twist that catches people. Give `COUNT` a column name instead of `*`
and it counts something subtly different:

```sql
SELECT COUNT(rating) FROM sales;
```

That counts rows **where `rating` is not NULL**. Some bakery customers never
left a star rating, so this number is smaller. And the gap between the two
counts is itself a finding: it tells you how much of that column is missing —
usually the first thing worth knowing about unfamiliar data.

Ask for both at once and the comparison is right there in one row:

```sql
SELECT COUNT(*) AS total, COUNT(phone) AS with_phone FROM customers;
```

### Your goal

Write one query against `sales` returning a single row with two columns:
`sales` — how many rows the table holds — and `rated`, how many of those carry
a rating.

```
sales | rated
-------------
12 | 8
```
