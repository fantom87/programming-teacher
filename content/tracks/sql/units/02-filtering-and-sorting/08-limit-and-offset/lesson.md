---
id: 08-limit-and-offset
title: Top-N with LIMIT and OFFSET
language: sql
runner: browser
estMinutes: 13
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Turn one sorted catalog into two pages: the three priciest products with LIMIT, then the next three with LIMIT and OFFSET together."
docs: [sql/sorting-and-limiting]
checks:
  - id: page-one-and-two
    type: stdout
    entry: query.sql
    match: exact
    value: "name | price\n------------\nWool Blanket | 89.95\nFountain Pen | 45.35\nCast Iron Skillet | 34.95\n\nname | price\n------------\nLinen Napkins | 26.55\nLeather Journal | 24.75\nEspresso Cups | 22.25\n"
  - id: paged-by-the-database
    type: ai-judge
    rubric: "Both queries select from products with ORDER BY price DESC. The first ends with LIMIT 3; the second ends with LIMIT 3 OFFSET 3. Neither query narrows the rows with a WHERE clause on price, name, or id to fake the page, and no product names or prices are typed as literals."
hints:
  - "LIMIT goes last, after ORDER BY: SELECT name, price FROM products ORDER BY price DESC LIMIT 3. The sort decides which rows are the top three; LIMIT just stops counting."
  - "OFFSET skips rows before LIMIT starts taking them. Page 2 of a 3-row page skips 3: LIMIT 3 OFFSET 3."
  - "Two statements in the file, each with its own semicolon — the same ORDER BY price DESC in both, differing only by the OFFSET on the second."
---
## Only the rows you need

`ORDER BY` puts the interesting rows at the top. `LIMIT` stops reading
once you have enough of them:

```sql
SELECT name, price
FROM products
ORDER BY price DESC
LIMIT 3;
```

That's the **top-N pattern**, and it is one of the most-used shapes in
SQL: sort by the thing that defines "best", take the first few. Top
sellers, slowest queries, most recent errors — all the same three lines.

`LIMIT` goes last, after `ORDER BY`, because it is last: the database
sorts, then hands over the first three. Without the `ORDER BY`, `LIMIT 3`
gives you *some* three rows — genuinely useful for peeking at an unfamiliar
table, and meaningless as a ranking. A "top 3" query with no sort is a bug
that looks like an answer.

`OFFSET` skips rows before `LIMIT` starts taking them:

```sql
ORDER BY price DESC
LIMIT 3 OFFSET 3;      -- rows 4, 5, 6
```

That's **pagination**, the machinery behind every "next page" button you
have ever clicked. Page *n* of size *s* is `LIMIT s OFFSET (n - 1) * s`.

Which makes the sort more than cosmetic. If the order isn't total, a row
can drift between pages — appearing twice, or never — because the
database resolved a tie differently on the second query. That's the
classic pagination bug, and the fix is the habit from last lesson: sort
by enough keys that no two rows can tie. Here every price is distinct, so
`price DESC` is already total.

One caveat for later: `OFFSET 100000` still makes the database walk and
discard a hundred thousand rows. Deep pages get slow, and real systems
eventually page by "everything after this key" instead. `LIMIT`/`OFFSET`
is right for the first few pages and for everything you'll do here.

### Your goal

Two queries over the price list, highest first.

1. The three priciest products — `name`, `price`.
2. The next three, using `OFFSET`.

```
name | price
------------
Wool Blanket | 89.95
Fountain Pen | 45.35
Cast Iron Skillet | 34.95

name | price
------------
Linen Napkins | 26.55
Leather Journal | 24.75
Espresso Cups | 22.25
```

Same sort, different window. That's all pagination ever is.
