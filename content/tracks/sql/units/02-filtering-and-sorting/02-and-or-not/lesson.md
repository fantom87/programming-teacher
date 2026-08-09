---
id: 02-and-or-not
title: AND, OR, and Parentheses
language: sql
runner: browser
estMinutes: 12
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Combine two conditions into one WHERE clause — either the kitchen or the home aisle, and under 30.00 — using parentheses so AND cannot swallow the OR."
docs: [sql/filtering-with-where]
checks:
  - id: cheap-kitchen-and-home
    type: stdout
    entry: query.sql
    match: exact
    value: "name | category | price\n-----------------------\nBamboo Board | kitchen | 18.75\nEspresso Cups | kitchen | 22.25\nCeramic Mug | kitchen | 9.45\nBeeswax Candle | home | 7.25\nLinen Napkins | home | 26.55\n"
  - id: parenthesised-or
    type: ai-judge
    rubric: "One WHERE clause combines an OR over the two category values with an AND on price, and the OR is wrapped in parentheses so it is evaluated as a unit. The rows are not selected by listing ids, and the paper category is excluded by the condition rather than by hand."
hints:
  - "Two ideas joined by AND: (this aisle or that aisle) AND (cheap enough). Write the aisle test first, then AND the price test onto it."
  - "The aisle test is an OR of two equality checks: category = 'kitchen' OR category = 'home'. On its own that clause is fine — the trouble starts when you AND something onto it."
  - "AND binds tighter than OR, so without parentheses SQLite reads it as category = 'kitchen' OR (category = 'home' AND price < 30) — and the 34.95 skillet sneaks in. Wrap the OR: WHERE (category = 'kitchen' OR category = 'home') AND price < 30."
---
## When one test isn't enough

Real questions are rarely one comparison. *Cheap gifts from the kitchen
or home aisles* is three tests at once, and `AND`, `OR`, and `NOT` are how
you glue them together:

```sql
WHERE price < 30 AND stock > 0      -- both must hold
WHERE category = 'home' OR rating > 4.5   -- either will do
WHERE NOT category = 'paper'        -- flip a test
```

Here's the part that bites everyone exactly once. `AND` binds **tighter**
than `OR`, the same way `*` binds tighter than `+`. So this:

```sql
WHERE category = 'kitchen' OR category = 'home' AND price < 30
```

does not mean what it looks like. SQLite reads it as *kitchen at any
price, or home under 30* — the parentheses it supplies for you land in
the wrong place, and a 34.95 skillet strolls into your list of cheap
gifts. The query runs, returns rows, and is wrong. Those are the worst
bugs, because nothing complains.

The fix costs two characters:

```sql
WHERE (category = 'kitchen' OR category = 'home') AND price < 30
```

Now the `OR` is a single unit — *is this row in either aisle?* — and the
`AND` applies to the whole thing. The rule worth internalising: **the
moment you mix `AND` and `OR` in one clause, add parentheses.** Not
because you can't remember the precedence, but because the next person
reading the query shouldn't have to.

A long `WHERE` also reads better broken across lines, with each condition
on its own line and the operator leading. Whitespace is free in SQL and
your future self is not.

### Your goal

Build the cheap-gift shelf: products in the `kitchen` **or** `home`
category **and** priced under 30.00. Show `name`, `category`, `price`,
ordered by `id`:

```
name | category | price
-----------------------
Bamboo Board | kitchen | 18.75
Espresso Cups | kitchen | 22.25
Ceramic Mug | kitchen | 9.45
Beeswax Candle | home | 7.25
Linen Napkins | home | 26.55
```

Five rows. If you get six, the parentheses are missing.
