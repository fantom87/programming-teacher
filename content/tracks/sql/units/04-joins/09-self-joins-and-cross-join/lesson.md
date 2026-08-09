---
id: 09-self-joins-and-cross-join
title: Self Joins and CROSS JOIN
language: sql
runner: browser
estMinutes: 15
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Join customers to itself to name each buyer's referrer — LEFT JOIN, so the un-referred keep a NULL — then measure the row explosion a deliberate CROSS JOIN produces."
docs: [sql/joins, sql/aggregate-functions]
checks:
  - id: referrers-and-explosion
    type: stdout
    entry: query.sql
    match: exact
    value: "customer | referred_by\n----------------------\nDevon | Mara\nInes | Mara\nMara | NULL\nPriya | NULL\nTom | Devon\n\npairs\n-----\n40\n"
  - id: self-join-and-cross-join
    type: ai-judge
    rubric: "The first statement joins the customers table to itself under two different aliases, matching the referrer alias's id to the referred_by column, and uses LEFT JOIN so customers with no referrer still appear with NULL. The second statement produces its number with a CROSS JOIN (or a comma-separated FROM with no join condition) between customers and orders, counted with COUNT(*) — the value 40 is not typed as a literal."
hints:
  - "A table can appear twice in one query as long as each copy has its own alias: FROM customers AS c LEFT JOIN customers AS r ON ... — c is the buyer, r is the referrer."
  - "The matching rule follows the foreign key that points back at the same table: ON r.id = c.referred_by. It has to be a LEFT JOIN, or Mara and Priya — nobody referred them — drop out of the list."
  - "Part 2 needs no ON at all: SELECT COUNT(*) AS pairs FROM customers CROSS JOIN orders; — 5 customers times 8 orders."
---
## A table meets itself

Look at `customers` again. `referred_by` holds a customer id — a
foreign key pointing at *its own table*. That's how a database stores
any relationship between rows of the same kind: employees and their
managers, comments and their parent comments, categories and
subcategories.

To show a name next to a name, you need the table twice. SQL is happy
to do that, as long as each copy gets its own alias:

```sql
SELECT c.name AS customer, r.name AS referred_by
FROM customers AS c
LEFT JOIN customers AS r ON r.id = c.referred_by
ORDER BY c.name;
```

Here aliases stop being a convenience and become the whole mechanism.
`c` is the buyer, `r` is the referrer, and the database treats them as
two independent tables that happen to hold identical data. `LEFT JOIN`
matters as much: nobody referred Mara or Priya, and an inner join would
quietly drop them from the list.

Now the other extreme. Leave out the `ON` entirely and you get a
`CROSS JOIN` — every row of one table paired with every row of the
other. Five customers, eight orders, forty meaningless rows. The
product is occasionally what you want (generating a grid of all
possible combinations), and much more often the sound of a mistake:

```sql
FROM customers, orders            -- old-style comma join, no condition: 40 rows
FROM customers c JOIN orders o ON o.id = o.id   -- a condition that matches everything
```

Both explode. With five rows apiece it's a curiosity; with two tables
of 50,000 rows it's 2.5 billion rows and a query that never returns.
**If a join returns far more rows than the table you started from,
suspect the `ON` before you suspect the data.** A correct join to a
child table multiplies rows by the number of children — never by the
whole table.

Write `CROSS JOIN` when you mean it, so the reader knows it wasn't an
accident.

### Your goal

Two statements, producing exactly:

```
customer | referred_by
----------------------
Devon | Mara
Ines | Mara
Mara | NULL
Priya | NULL
Tom | Devon

pairs
-----
40
```
