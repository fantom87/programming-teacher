---
id: 06-order-by
title: Sorting with ORDER BY
language: sql
runner: browser
estMinutes: 12
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Sort the whole catalog by two keys at once — category alphabetically, and within each category price from high to low — so every aisle prints priciest first."
docs: [sql/sorting-and-limiting]
checks:
  - id: aisle-then-price
    type: stdout
    entry: query.sql
    match: exact
    value: "name | category | price\n-----------------------\nWool Blanket | home | 89.95\nLinen Napkins | home | 26.55\nBeeswax Candle | home | 7.25\nCast Iron Skillet | kitchen | 34.95\nEspresso Cups | kitchen | 22.25\nBamboo Board | kitchen | 18.75\nCeramic Mug | kitchen | 9.45\nFountain Pen | paper | 45.35\nLeather Journal | paper | 24.75\nKraft Notebook | paper | 6.15\n"
  - id: two-sort-keys
    type: ai-judge
    rubric: "A single unfiltered query over products with one ORDER BY naming two keys: category ascending (ASC written or left implicit) then price with DESC. The direction is attached per column rather than applied to both, there is no WHERE clause, and the row order is produced by the database rather than by UNION-ing hand-ordered literal rows."
hints:
  - "ORDER BY takes a comma-separated list of keys: ORDER BY category, price. The first key decides the order; the second only breaks ties within it."
  - "ASC (smallest or A-first) is the default; DESC reverses. The direction belongs to one column, so ORDER BY category, price DESC leaves category ascending."
  - "All together: SELECT name, category, price FROM products ORDER BY category ASC, price DESC; — the ASC is optional, but writing it makes the mixed directions obvious to a reader."
---
## Deciding the order yourself

You've been ending queries with `ORDER BY id` on faith. Here's the
payoff. Rows come out of a table in whatever order the database finds
convenient — that order is not part of your data, and it can change when
an index is added or a row is rewritten. `ORDER BY` is the only promise
you'll ever get:

```sql
SELECT name, price
FROM products
ORDER BY price;
```

Ascending is the default: smallest number first, `'A'` before `'Z'`, and
`NULL` before everything (a hole counts as smaller than any value in
SQLite). `DESC` flips it, `ASC` says the default out loud:

```sql
ORDER BY price DESC     -- most expensive first
```

The real power is sorting by **several keys**. List them comma-separated,
and each one only matters when everything before it has tied:

```sql
ORDER BY category, price DESC
```

*Alphabetical by aisle; inside each aisle, priciest first.* Read it left
to right as a series of tiebreakers — that's exactly how the database
reads it too.

The direction attaches to a single column, not to the list. In
`ORDER BY category, price DESC` only `price` is descending; `category` is
still ascending. If you want both reversed, both need `DESC`.

One habit worth keeping for life: **make your sort total**. If you sort
only by `category`, the order of rows *within* a category is once again
up to the database — reproducible today, quietly different tomorrow. Add
enough tiebreakers that no two rows can tie, and your output becomes
something you can diff, test, and paste into a report without fear.

### Your goal

Print the whole catalog — no filter — as `name`, `category`, `price`,
sorted by `category` ascending and then `price` descending:

```
name | category | price
-----------------------
Wool Blanket | home | 89.95
Linen Napkins | home | 26.55
Beeswax Candle | home | 7.25
Cast Iron Skillet | kitchen | 34.95
Espresso Cups | kitchen | 22.25
Bamboo Board | kitchen | 18.75
Ceramic Mug | kitchen | 9.45
Fountain Pen | paper | 45.35
Leather Journal | paper | 24.75
Kraft Notebook | paper | 6.15
```

Three aisles, each one walking downhill in price.
