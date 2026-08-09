---
id: 03-correlated-subqueries
title: Correlated Subqueries
language: sql
runner: browser
estMinutes: 15
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Find every coffee that costs more than the average price of its own roast level, using a correlated subquery whose WHERE clause references the outer row's roast — sorted by roast, then name."
docs: [sql/subqueries, sql/aggregate-functions]
checks:
  - id: pricey-for-its-roast
    type: stdout
    entry: query.sql
    match: exact
    value: "name | roast | price\n--------------------\nNight Shift | dark | 16.35\nQuiet Hours | light | 20.95\nCopper Kettle | medium | 15.29\n"
  - id: really-correlated
    type: ai-judge
    rubric: "The subquery is correlated: the outer coffees table carries an alias (such as c) and the inner SELECT AVG(price) FROM coffees ... compares its roast column against that outer alias, e.g. WHERE roast = c.roast. The comparison is not against a literal roast name, there are no three separate hardcoded thresholds, and no roast group is spelled out with OR branches. The query ends with ORDER BY roast, name."
hints:
  - "Alias the outer table so the inner query can point at the current row: FROM coffees c. Now c.roast means \"this row's roast\"."
  - "Inside the parentheses, filter the same table down to that roast: (SELECT AVG(price) FROM coffees WHERE roast = c.roast)."
  - "Whole thing: SELECT name, roast, price FROM coffees c WHERE price > (SELECT AVG(price) FROM coffees WHERE roast = c.roast) ORDER BY roast, name;"
---
## The subquery that changes its mind

Every subquery so far was self-contained: it had one answer, computed
once, reused for every row. `(SELECT AVG(price) FROM coffees)` is `16.25`
no matter which row is being tested.

Now let the inner query peek at the outer row:

```sql
SELECT name, price
FROM coffees c
WHERE price > (SELECT AVG(price) FROM coffees WHERE roast = c.roast);
```

The `c` alias on the outer table is the whole trick. Inside the
parentheses, `c.roast` means *the roast of the row currently being
tested*. So the subquery no longer has one answer — it has one answer
**per row**. For `Night Shift` it computes the average dark roast; one
row later, for `Quiet Hours`, it computes the average light roast. That
is a **correlated subquery**: correlated because it depends on the query
around it.

The mental model is a loop. Walk the outer rows one at a time; for each,
run the inner query with that row's values filled in; keep the row if the
comparison holds. SQLite is cleverer than that in practice, but the loop
picture predicts the results exactly, and it explains the cost — a
correlated subquery does real work per row, so on a million-row table it
is something to think twice about.

What you get is a comparison *within a group* — each coffee measured
against its own peers rather than against the whole catalogue. `Copper
Kettle` at 15.29 is below the roastery average and still expensive for a
medium roast. Plain aggregation cannot express that; a correlated
subquery does it in one line.

Careful with names. If the inner query said `WHERE roast = roast`, both
sides would resolve to the inner table and every row would match. The
alias is what keeps the two apart.

### Your goal

Each coffee that beats the average price for its own roast level:

```
name | roast | price
--------------------
Night Shift | dark | 16.35
Quiet Hours | light | 20.95
Copper Kettle | medium | 15.29
```

One correlated subquery. No roast name typed into the comparison.
