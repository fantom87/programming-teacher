---
id: 05-update-from-another-table
title: Updating From Another Table
language: sql
runner: browser
estMinutes: 16
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Apply the importer's price list to the shelf with one UPDATE whose new values come from a correlated subquery — and whose WHERE keeps the coffees that aren't on the list from being wiped to NULL."
docs: [sql/inserting-and-updating, sql/subqueries]
checks:
  - id: prices-applied
    type: stdout
    entry: query.sql
    match: exact
    value: "id | name | price\n-----------------\n1 | Morning Ritual | 16.95\n2 | Deep Well | 17.35\n3 | Half Past Four | 16.25\n4 | Night Shift | 13.45\n5 | Cloud Cover | 20.95\n"
  - id: values-read-not-typed
    type: ai-judge
    rubric: "A single UPDATE of coffees sets price from a correlated scalar subquery over price_changes, matched on the coffee id (something like SET price = (SELECT new_price FROM price_changes WHERE coffee_id = coffees.id)). It carries a WHERE that restricts the update to the ids present in price_changes — an IN subquery or EXISTS — so the unlisted coffees are never touched. The literals 17.35, 16.25 and 20.95 do not appear in query.sql, and there is no chain of one UPDATE per coffee."
hints:
  - "The value in a SET can be a whole query, as long as it returns one row and one column: SET price = (SELECT ... FROM price_changes WHERE ...)."
  - "The subquery has to know which row it is working on. Reference the outer table by name inside it: WHERE pc.coffee_id = coffees.id — that link is what makes it correlated."
  - "Without a WHERE, the subquery runs for the unlisted coffees too and returns nothing, which is NULL — it would erase their prices. Guard the statement with WHERE id IN (SELECT coffee_id FROM price_changes)."
---
## The new value lives somewhere else

Yesterday's update used arithmetic: `price + 1.50`, a rule that applied
to every matching row. Real corrections rarely arrive as a rule. They
arrive as a *list* — a supplier's price sheet, an overnight feed, a
spreadsheet someone loaded into a staging table — with a different value
for each row.

You could write one `UPDATE` per line of that sheet. Don't. The value in
a `SET` is allowed to be a query:

```sql
UPDATE coffees
SET price = (
  SELECT pc.new_price
  FROM price_changes pc
  WHERE pc.coffee_id = coffees.id
)
WHERE id IN (SELECT coffee_id FROM price_changes);
```

The inner query is **correlated**: it mentions `coffees.id`, a column of
the row currently being updated. So it isn't run once — it's run again
for every row the `UPDATE` touches, each time asking *what's the new
price for this particular coffee?* A scalar subquery like this must
return one row and one column; that's exactly what a lookup keyed on an
id gives you.

Now the trap, and it is a nasty one. Our price list only covers three of
the five coffees. Drop that final `WHERE` and the `UPDATE` visits all
five — and for `Morning Ritual`, the subquery finds nothing. A subquery
that matches nothing doesn't fail; **it returns NULL**. The statement
succeeds, reports no error, and quietly erases two prices.

That is why the guard is there. `WHERE id IN (SELECT coffee_id FROM
price_changes)` restricts the update to the rows the list actually
covers. Some people prefer `WHERE EXISTS (SELECT 1 FROM price_changes pc
WHERE pc.coffee_id = coffees.id)` — the same idea, spelled with the
correlation reused.

The rule worth carrying: whenever a `SET` reads from another table, ask
what happens to the rows that don't match. If the answer is "they get
NULL", you need a `WHERE`.

### Your goal

One `UPDATE`, then verify. Only ids 2, 3 and 5 should move:

```
id | name | price
-----------------
1 | Morning Ritual | 16.95
2 | Deep Well | 17.35
3 | Half Past Four | 16.25
4 | Night Shift | 13.45
5 | Cloud Cover | 20.95
```
