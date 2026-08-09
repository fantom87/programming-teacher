---
id: 06-your-first-cte
title: Your First CTE
language: sql
runner: browser
estMinutes: 15
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Name a per-customer bags total as a CTE called customer_bags with WITH, then read that name twice in one statement — once for the rows, once inside a scalar subquery for the average — to list the customers above the average."
docs: [sql/ctes, sql/subqueries]
checks:
  - id: above-average-buyers
    type: stdout
    entry: query.sql
    match: exact
    value: "name | bags_total\n-----------------\nGrace Lin | 7\nTheo Brandt | 7\n"
  - id: cte-used-twice
    type: ai-judge
    rubric: "The statement begins with WITH and defines one CTE (customer_bags or similar) holding the per-customer SUM(o.bags) from a join of customers and orders. That CTE name is referenced at least twice: once in the main FROM and once inside a scalar subquery computing AVG of the bags total. The average threshold is not typed as a literal number, the GROUP BY logic appears only once in the file, and the query ends with ORDER BY bags_total DESC, name."
hints:
  - "WITH goes before the SELECT: WITH customer_bags AS ( SELECT ... GROUP BY c.name ) SELECT ... FROM customer_bags. No semicolon between the CTE and the main query."
  - "The average of a column in the CTE is itself a scalar subquery over that CTE: (SELECT AVG(bags_total) FROM customer_bags)."
  - "Put them together: WHERE bags_total > (SELECT AVG(bags_total) FROM customer_bags), then ORDER BY bags_total DESC, name. The average works out to 5.75."
---
## Give the subquery a name

Here is the same derived table from last lesson, written the other way:

```sql
WITH customer_bags AS (
  SELECT c.name AS name, SUM(o.bags) AS bags_total
  FROM customers c
  JOIN orders o ON o.customer_id = c.id
  GROUP BY c.name
)
SELECT name, bags_total
FROM customer_bags
WHERE bags_total >= 5;
```

Same rows, same work, one real difference: the step has a **name**, and
the name comes first. `WITH <name> AS ( ... )` defines a **common table
expression** — a CTE — which behaves like a temporary table that exists
for exactly one statement. Read top to bottom now: *build customer_bags,
then select from it.* The derived-table version reads inside-out, and
that gets worse with every layer.

The naming is not just tidiness. A well-chosen name — `customer_bags`,
`monthly_revenue`, `active_accounts` — tells the next reader what the
step *means*, which no amount of nested parentheses can.

The second advantage is bigger: **you can use the name more than once.**
A derived table lives in one `FROM` clause and nowhere else, so if you
need the same summary twice you write it twice. A CTE you just mention
again:

```sql
SELECT name, bags_total
FROM customer_bags
WHERE bags_total > (SELECT AVG(bags_total) FROM customer_bags);
```

Rows on the left, the yardstick on the right, one definition behind both.
Duplicating that `GROUP BY` would mean two places to edit and two places
to get wrong.

Syntax notes worth having: the `WITH` block comes *before* `SELECT`, no
semicolon separates them (it is one statement), and the CTE vanishes the
moment the statement ends — nothing is stored. Cheap to write, free to
name, so reach for it early.

### Your goal

Customers whose bag total beats the average bag total:

```
name | bags_total
-----------------
Grace Lin | 7
Theo Brandt | 7
```

One `WITH`, one CTE, referenced twice. No thresholds typed by hand.
