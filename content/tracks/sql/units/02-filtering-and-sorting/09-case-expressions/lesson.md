---
id: 09-case-expressions
title: Labeling Rows with CASE
language: sql
runner: browser
estMinutes: 15
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Add a computed tier column with one CASE expression that labels each product budget, standard, or premium by price — letting the first matching WHEN do the work of the range checks."
docs: [sql/select-basics, sql/sorting-and-limiting]
checks:
  - id: price-tiers
    type: stdout
    entry: query.sql
    match: exact
    value: "name | price | tier\n-------------------\nKraft Notebook | 6.15 | budget\nBeeswax Candle | 7.25 | budget\nCeramic Mug | 9.45 | budget\nBamboo Board | 18.75 | standard\nEspresso Cups | 22.25 | standard\nLeather Journal | 24.75 | standard\nLinen Napkins | 26.55 | standard\nCast Iron Skillet | 34.95 | premium\nFountain Pen | 45.35 | premium\nWool Blanket | 89.95 | premium\n"
  - id: one-case-does-it
    type: ai-judge
    rubric: "The tier column is a single CASE expression in the SELECT list, aliased AS tier, with a WHEN for the budget cut-off, a WHEN for the standard cut-off, and an ELSE for premium. It relies on first-match-wins rather than repeating the lower bound in each WHEN, and the labels are produced by the expression rather than by hardcoding a tier per product name or id, by three separate queries, or by a UNION of literal rows."
hints:
  - "The shape is CASE WHEN <test> THEN <value> WHEN <test> THEN <value> ELSE <value> END, and it goes in the SELECT list like any other expression. Give it a name with AS tier."
  - "Arms are tried top to bottom and the first true one wins, so the second WHEN only ever sees rows the first one rejected. That means WHEN price < 30 is enough — no need to also say price >= 10."
  - "Order the arms cheapest first: WHEN price < 10 THEN 'budget' WHEN price < 30 THEN 'standard' ELSE 'premium' END AS tier, and sort the whole query with ORDER BY price."
---
## Deciding per row

Every query so far returned data that was already in the table, or
arithmetic over it. `CASE` returns a **judgement**: cheap or not, active
or lapsed, pass or fail. It is SQL's if/else, and like everything else in
the `SELECT` list it produces one value per row.

```sql
SELECT name,
       price,
       CASE
         WHEN price < 10 THEN 'budget'
         WHEN price < 30 THEN 'standard'
         ELSE 'premium'
       END AS tier
FROM products;
```

The arms are tested **top to bottom, first match wins**. That's the whole
trick, and it's what keeps the conditions short: by the time the second
`WHEN` is tried, the row has already failed `price < 10`, so
`price < 30` really means *between 10 and 30*. You never repeat the lower
bound. Reorder the arms and you change the answer — put `price < 30`
first and nothing is ever `budget`.

`ELSE` catches everything that fell through. Leave it out and unmatched
rows get `NULL` — which is legal, occasionally what you want, and much
more often the bug you spend twenty minutes finding. Write the `ELSE`.

Two things worth knowing now. `CASE` is an *expression*, so it can go
anywhere a value goes — including inside `ORDER BY`, to sort by a custom
priority that isn't alphabetical. And every arm should return the same
kind of thing; a `CASE` yielding a string on one branch and a number on
another will run, and will confuse whoever sorts by it.

There's a second form, `CASE price WHEN 10 THEN ...`, for testing one
expression against fixed values. It's shorter, but it only does equality —
the `WHEN <test>` form above handles anything, so learn that one first.

### Your goal

Label the whole catalog by price band. Return `name`, `price`, and a
`tier` column — `budget` under 10, `standard` under 30, `premium`
otherwise — sorted by `price` ascending:

```
name | price | tier
-------------------
Kraft Notebook | 6.15 | budget
Beeswax Candle | 7.25 | budget
Ceramic Mug | 9.45 | budget
Bamboo Board | 18.75 | standard
Espresso Cups | 22.25 | standard
Leather Journal | 24.75 | standard
Linen Napkins | 26.55 | standard
Cast Iron Skillet | 34.95 | premium
Fountain Pen | 45.35 | premium
Wool Blanket | 89.95 | premium
```

One query, one `CASE`, ten labels the table never stored.
