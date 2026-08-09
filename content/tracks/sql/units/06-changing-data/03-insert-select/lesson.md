---
id: 03-insert-select
title: Inserting From a Query
language: sql
runner: browser
estMinutes: 14
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Move every slow-moving coffee onto the clearance shelf at 25% off with a single INSERT ... SELECT — the rows and the discounted prices both computed by the query, never typed."
docs: [sql/inserting-and-updating, sql/select-basics]
checks:
  - id: clearance-shelf
    type: stdout
    entry: query.sql
    match: exact
    value: "name | origin | price\n---------------------\nDeep Well | Sumatra | 13.69\nNight Shift | Brazil | 10.09\n"
  - id: rows-come-from-a-query
    type: ai-judge
    rubric: "The clearance rows are added with a single INSERT INTO clearance (...) SELECT ... FROM coffees statement — no VALUES clause anywhere. The SELECT filters with WHERE bags < 15 and computes the discounted price as an expression over the coffees price column (something like ROUND(price * 0.75, 2)). The literal prices 13.69 and 10.09, and the coffee names Deep Well and Night Shift, appear nowhere in query.sql."
hints:
  - "Swap the VALUES clause for a query: INSERT INTO clearance (name, origin, price) SELECT ... FROM coffees WHERE ...; — no VALUES keyword at all."
  - "The SELECT list has to line up with the column list, three expressions for three columns. The third one is the discount: ROUND(price * 0.75, 2)."
  - "Slow movers are bags < 15 — strictly fewer, so a coffee sitting on exactly 15 bags stays on the main shelf. Finish with SELECT name, origin, price FROM clearance ORDER BY name;"
---
## When the rows already exist

So far your inserted rows came from your keyboard. Most real inserts
don't. The rows are already in the database — you're archiving them,
staging them, copying them into a reporting table — and retyping them
would be both tedious and wrong.

`INSERT` accepts a query in place of `VALUES`:

```sql
INSERT INTO clearance (name, origin, price)
SELECT name, origin, ROUND(price * 0.75, 2)
FROM coffees
WHERE bags < 15;
```

Read it as two halves. The bottom half is an ordinary `SELECT` — run it
on its own first and you'll see exactly the rows about to be inserted.
The top half says where they land. Whatever the query returns, one row at
a time, becomes a row in `clearance`.

The only rule is arithmetic: **the SELECT must produce the same number of
expressions as the column list, in the same order.** Three columns, three
expressions. Names don't have to match — position is what counts.

The third expression is where this gets interesting. It isn't a column,
it's a calculation: the old price, times 0.75, rounded to two decimals.
Data can be *transformed on its way in*. That's the whole shape of an
ETL job — extract with the `SELECT`, transform in the expression list,
load with the `INSERT` — and you just wrote one.

Two habits carry over from here. First: `ROUND(x, 2)` any money you
compute, or you'll ship prices like 13.6875. Second: when a copy matters,
run the `SELECT` by itself before you wrap it in the `INSERT`. A query
you can see is a query you can trust.

### Your goal

Every coffee with fewer than 15 bags left goes to clearance at 25% off.
Copy them in one statement, then show the clearance shelf:

```
name | origin | price
---------------------
Deep Well | Sumatra | 13.69
Night Shift | Brazil | 10.09
```
