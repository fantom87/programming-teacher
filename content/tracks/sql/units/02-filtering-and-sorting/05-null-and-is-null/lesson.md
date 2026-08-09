---
id: 05-null-and-is-null
title: NULL and Three-Valued Logic
language: sql
runner: browser
estMinutes: 14
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Find the unreviewed products with IS NULL instead of = NULL, then see for yourself that a rating < 4.5 filter silently drops every NULL row."
docs: [sql/filtering-with-where]
checks:
  - id: null-and-comparison
    type: stdout
    entry: query.sql
    match: exact
    value: "name\n----\nEspresso Cups\nLinen Napkins\n\nname | rating\n-------------\nBamboo Board | 4.2\nBeeswax Candle | 4.1\nFountain Pen | 4.4\nKraft Notebook | 3.8\n"
  - id: is-null-not-equals-null
    type: ai-judge
    rubric: "The first query tests rating IS NULL — not rating = NULL, and not a comparison against a sentinel value like 0 or an empty string. The second query filters with the plain comparison rating < 4.5 and does nothing to add the NULL rows back in. Both queries end with ORDER BY id and neither hardcodes product names."
hints:
  - "= NULL is never true, not even for a NULL value, so that query returns nothing. NULL needs its own operator: WHERE rating IS NULL (and IS NOT NULL for the opposite)."
  - "The second query is a plain comparison: WHERE rating < 4.5. Run it and count — two products are missing, and their absence is the point of the lesson."
  - "Full shape: SELECT name FROM products WHERE rating IS NULL ORDER BY id; then a second statement SELECT name, rating FROM products WHERE rating < 4.5 ORDER BY id;"
---
## The value that isn't one

Two products in the catalog have no `rating`. Not a rating of zero, not
an empty rating — *no rating at all*, because nobody has reviewed them
yet. SQL writes that absence as `NULL`, and `NULL` is not a value. It's a
hole where a value would go.

That single idea explains every strange thing it does. Ask whether a hole
equals 4.5 and the honest answer isn't yes or no — it's **unknown**. So
SQL has three truth values, and comparisons with `NULL` all land on the
third one:

```sql
rating = 4.5     -- unknown
rating <> 4.5    -- unknown
rating = NULL    -- unknown, even when rating IS null
```

`WHERE` keeps only rows where the condition is **true**. Unknown is not
true, so `NULL` rows are quietly dropped by every one of those tests.
Nothing errors. Your row count is just smaller than you expected, and the
query looks perfectly reasonable.

Because `= NULL` can never be true, SQL gives absence its own operators:

```sql
WHERE rating IS NULL
WHERE rating IS NOT NULL
```

`IS` and `IS NOT` are the only way to ask about a hole. Reach for `=` and
you'll get an empty result and no complaint.

The habit that saves you: whenever you write a filter on a column that
allows `NULL`, ask *what should happen to the rows with nothing there?*
Sometimes dropping them is right. Sometimes you want them back, and then
`COALESCE(rating, 0)` will substitute a stand-in value — a tool for the
aggregation unit, once counting makes the stakes obvious.

### Your goal

Two queries, both ordered by `id`.

1. `name` of every product with no rating yet.
2. `name` and `rating` of every product rated below 4.5.

```
name
----
Espresso Cups
Linen Napkins

name | rating
-------------
Bamboo Board | 4.2
Beeswax Candle | 4.1
Fountain Pen | 4.4
Kraft Notebook | 3.8
```

Look hard at the second block. `Espresso Cups` is certainly not rated 4.5
or higher — and it isn't there. That's three-valued logic doing its job,
and it's why you check.
