---
id: 07-sorting-by-expressions
title: Sorting by Expressions and Aliases
language: sql
runner: browser
estMinutes: 14
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Compute shelf value as price times stock, alias it, and sort by that alias descending with name as a tiebreaker — ranking products by a number that exists nowhere in the table."
docs: [sql/sorting-and-limiting, sql/select-basics]
checks:
  - id: shelf-value-ranking
    type: stdout
    entry: query.sql
    match: exact
    value: "name | shelf_value\n------------------\nKraft Notebook | 1230\nBeeswax Candle | 870\nBamboo Board | 750\nLeather Journal | 742.5\nCeramic Mug | 604.8\nLinen Napkins | 477.9\nWool Blanket | 449.75\nCast Iron Skillet | 419.4\nFountain Pen | 362.8\nEspresso Cups | 0\n"
  - id: computed-and-sorted
    type: ai-judge
    rubric: "The second column is computed in the query as ROUND(price * stock, 2) and given the alias shelf_value with AS. The ORDER BY sorts by that computed value descending (by the alias or by repeating the expression) with name as a secondary key. No shelf_value figures are typed as literals, and the ranking is not produced by hand-ordering rows or by an id list."
hints:
  - "Any expression can be a SELECT column: SELECT name, price * stock FROM products. Name it with AS so the header reads well: AS shelf_value."
  - "Floating-point multiplication leaves noise like 419.40000000000003 behind. ROUND(price * stock, 2) trims it to two decimals — and trailing zeros are not printed, so 750.00 shows as 750."
  - "ORDER BY runs after SELECT has named the columns, so it can use the alias: ORDER BY shelf_value DESC, name. Add the name key even though nothing ties here — a total sort is a habit, not a patch."
---
## Sorting by something you computed

The catalog stores `price` and `stock`. It does not store *how much money
is sitting on that shelf* — but that's the number the owner actually
wants, and you can produce it on the fly:

```sql
SELECT name, price * stock AS shelf_value
FROM products;
```

The `SELECT` list isn't limited to columns. It takes **expressions**:
arithmetic, function calls, string concatenation, anything that yields a
value per row. `AS` gives the result a name, which matters more than it
looks — without it the header is the raw expression text, and every
report built on the query inherits that mess.

Then the good part: `ORDER BY` can sort by that alias.

```sql
ORDER BY shelf_value DESC
```

This works because of the order the database does things. `FROM` and
`WHERE` pick the rows, `SELECT` computes the columns and names them, and
`ORDER BY` runs *last* — by which time `shelf_value` exists. `WHERE` runs
*before* the alias is born, so `WHERE shelf_value > 500` asks for a name
that doesn't exist yet. SQLite is generous and lets it slide; PostgreSQL
and SQL Server reject it flatly. Repeat the expression in `WHERE` and
your query travels.

You can also sort by an expression you never selected —
`ORDER BY LENGTH(name)` is perfectly legal, and the column stays hidden.

Two practical notes. `price * stock` is floating-point arithmetic, so
`34.95 * 12` comes back as `419.40000000000003`; `ROUND(x, 2)` cleans it
up. And trailing zeros aren't printed — `750.00` shows as `750` — because
the value is a number, not formatted text.

### Your goal

Rank every product by shelf value. Return `name` and
`ROUND(price * stock, 2)` aliased as `shelf_value`, sorted by
`shelf_value` descending with `name` as the tiebreaker:

```
name | shelf_value
------------------
Kraft Notebook | 1230
Beeswax Candle | 870
Bamboo Board | 750
Leather Journal | 742.5
Ceramic Mug | 604.8
Linen Napkins | 477.9
Wool Blanket | 449.75
Cast Iron Skillet | 419.4
Fountain Pen | 362.8
Espresso Cups | 0
```

The 6.15 notebook tops a list the 89.95 blanket sits eighth in. Two
hundred units will do that — and no column in the table could have told
you.
