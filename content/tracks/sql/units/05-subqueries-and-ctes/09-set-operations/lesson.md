---
id: 09-set-operations
title: Set Operations
language: sql
runner: browser
estMinutes: 16
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Combine result sets three ways: UNION ALL to stack Portland customers and the roastery leads into one labelled directory, INTERSECT for the light roasts that have sold, and EXCEPT for the coffees that have not."
docs: [sql/subqueries, sql/sorting-and-limiting]
checks:
  - id: union-intersect-except
    type: stdout
    entry: query.sql
    match: exact
    value: "kind | name\n-----------\ncustomer | Marisol Vega\ncustomer | Nadia Okafor\ncustomer | Owen Hale\nstaff | Marcus Bell\nstaff | Priya Raman\n\nname\n----\nMorning Anthem\nQuiet Hours\n\nname\n----\nCloud Ladder\nPaper Moon\n"
  - id: uses-set-operators
    type: ai-judge
    rubric: "The first statement uses UNION ALL between a customers SELECT filtered to Portland and a staff SELECT filtered with LIKE '%lead%', each supplying a literal kind label. The second statement uses INTERSECT and the third uses EXCEPT, in both cases against a SELECT of coffee names reached through orders. No names are listed as literals in a WHERE or VALUES clause to fake the results, and each statement ends with a single ORDER BY covering the whole combined result."
hints:
  - "Set operators sit between two complete SELECTs: SELECT ... UNION ALL SELECT ... — both halves need the same number of columns, in the same order. Column names come from the first half."
  - "A literal column labels each half: SELECT 'customer' AS kind, name FROM customers ... then SELECT 'staff' AS kind, name FROM staff ..."
  - "The coffees that have sold are SELECT k.name FROM coffees k JOIN orders o ON o.coffee_id = k.id. Put it on the right of INTERSECT for query 2 and on the right of EXCEPT for query 3."
---
## Stacking results instead of joining them

A join widens a result — more columns, side by side. A **set operation**
lengthens or trims one: same columns, different rows.

```sql
SELECT 'customer' AS kind, name FROM customers WHERE city = 'Portland'
UNION ALL
SELECT 'staff' AS kind, name FROM staff WHERE role LIKE '%lead%';
```

`UNION ALL` stacks the second result under the first. The two halves must
agree on column *count* and *order* — SQL pairs them by position, not by
name — and the column names come from the first `SELECT`. A literal like
`'customer'` is a perfectly good column, and here it earns its keep by
recording which half each row came from.

`UNION` without `ALL` does the same thing and then removes duplicate
rows, which costs a sort. When you know the halves cannot overlap, or you
*want* the duplicates, say `UNION ALL` and mean it.

Two more operators complete the set. `INTERSECT` keeps only rows present
in both results, and `EXCEPT` keeps rows from the first result that are
absent from the second:

```sql
SELECT name FROM coffees        -- everything
EXCEPT
SELECT k.name FROM coffees k    -- minus what has sold
JOIN orders o ON o.coffee_id = k.id;
```

You have answered that exact question twice already — with `NOT IN` and
with `NOT EXISTS`. `EXCEPT` is the third road there, and often the one
that reads most like the sentence in your head: *all of them, minus those
ones.* Both operators compare whole rows and both drop duplicates.

Last piece of syntax: `ORDER BY` applies to the **combined** result, so
it goes once, at the very end, after the final `SELECT`. Try to sort an
individual half and SQLite will tell you off.

### Your goal

Three statements, in this order:

```
kind | name
-----------
customer | Marisol Vega
customer | Nadia Okafor
customer | Owen Hale
staff | Marcus Bell
staff | Priya Raman

name
----
Morning Anthem
Quiet Hours

name
----
Cloud Ladder
Paper Moon
```

The directory, then the light roasts that sold, then the ones that never did.
