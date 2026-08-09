---
id: 06-right-and-full-joins
title: RIGHT and FULL Joins
language: sql
runner: browser
estMinutes: 15
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Show every customer and every order in one result with FULL OUTER JOIN, then reproduce it row for row with the portable idiom: a LEFT JOIN plus a UNION ALL of the unmatched rows from the other side."
docs: [sql/joins, sql/filtering-with-where]
checks:
  - id: both-sides-twice
    type: stdout
    entry: query.sql
    match: exact
    value: "name | order_id\n---------------\nNULL | 7\nDevon | 2\nDevon | 5\nInes | 4\nMara | 1\nMara | 3\nMara | 8\nPriya | NULL\nTom | 6\n\nname | order_id\n---------------\nNULL | 7\nDevon | 2\nDevon | 5\nInes | 4\nMara | 1\nMara | 3\nMara | 8\nPriya | NULL\nTom | 6\n"
  - id: emulation-is-real
    type: ai-judge
    rubric: "The first statement uses FULL OUTER JOIN between customers and orders. The second reproduces it without any FULL or RIGHT join: a LEFT JOIN from customers to orders, combined with UNION ALL to a second SELECT that returns only the unmatched orders (orders LEFT JOIN customers WHERE the customer key IS NULL). A single ORDER BY at the end sorts the combined result. Neither statement lists rows as literal values."
hints:
  - "Part 1 is one keyword swap on the LEFT JOIN you already know: FULL OUTER JOIN keeps unmatched rows from both tables at once."
  - "Part 2 is two queries stacked: the LEFT JOIN gives you every customer plus their matches; the only rows still missing are orders that matched nobody — and you wrote that anti-join last lesson."
  - "Stack them with UNION ALL (not UNION — you want every row, and none of them are duplicates), keep the column names from the first branch, and put ORDER BY name, order_id after the second SELECT so it sorts the whole thing."
---
## When you need both sides

`LEFT JOIN` protects the left table. What protects the right one?

`RIGHT JOIN` — same idea, mirrored: every row of the right table
survives, unmatched left columns come back NULL. And it is almost
completely pointless, because `a RIGHT JOIN b` is just
`b LEFT JOIN a` with the tables written in the other order. Swap the
names and you have the same result set. That's why working SQL is full
of `LEFT JOIN` and nearly free of `RIGHT JOIN`: one direction is
plenty, and consistency reads better.

`FULL OUTER JOIN` earns its keep — it keeps unmatched rows from *both*
sides in one pass:

```sql
SELECT c.name, o.id AS order_id
FROM customers AS c
FULL OUTER JOIN orders AS o ON o.customer_id = c.id;
```

Every customer including Priya, every order including the guest
checkout, matched wherever a match exists. Nine rows: seven pairings,
plus a customer with no order, plus an order with no customer.

The catch is portability. SQLite only learned `RIGHT` and `FULL` joins
in version 3.39 (2022); MySQL still has no `FULL OUTER JOIN` at all.
Plenty of codebases can't use them — so the standard workaround is
worth knowing in your fingers:

```sql
SELECT ... FROM a LEFT JOIN b ON ...          -- all of a, plus matches
UNION ALL
SELECT ... FROM b LEFT JOIN a ON ...
WHERE a.key IS NULL                           -- only b's leftovers
ORDER BY ...;
```

The left join covers everything except one thing: rows of `b` that
matched nothing. Add exactly those with an anti-join and you've
rebuilt the full outer join. `UNION ALL` stacks two result sets that
have the same number of columns; use `ALL` unless you actually want
duplicate rows collapsed. The `ORDER BY` goes once, at the end — it
sorts the combined result, and it refers to the *first* branch's column
names.

### Your goal

Two statements that print the same nine rows twice:

```
name | order_id
---------------
NULL | 7
Devon | 2
Devon | 5
Ines | 4
Mara | 1
Mara | 3
Mara | 8
Priya | NULL
Tom | 6
```

First with `FULL OUTER JOIN`, then with `LEFT JOIN` + `UNION ALL`. NULL
names sort first in SQLite, so the guest order leads.
