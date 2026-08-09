---
id: 01-tables-that-relate
title: Tables That Relate
language: sql
runner: browser
estMinutes: 10
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "List every customer, then find Mara's orders the hard way — by filtering the orders table on the customer_id that points back at her row — with an explicit ORDER BY on both queries."
docs: [sql/what-is-a-database, sql/joins, sql/sorting-and-limiting]
checks:
  - id: two-tables-two-queries
    type: stdout
    entry: query.sql
    match: exact
    value: "id | name | city\n----------------\n1 | Mara | Portland\n2 | Devon | Austin\n3 | Priya | Boston\n4 | Tom | Austin\n5 | Ines | Portland\n\nid | customer_id | order_date\n-----------------------------\n1 | 1 | 2026-03-02\n3 | 1 | 2026-03-11\n8 | 1 | 2026-04-01\n"
  - id: followed-the-key
    type: ai-judge
    rubric: "The second statement selects from the orders table filtered on the foreign key (WHERE customer_id = 1), rather than listing Mara's order ids or dates as literal values or selecting them by id. Both statements end with an explicit ORDER BY id."
hints:
  - "schema.sql is the map. Read the two CREATE TABLE blocks before writing anything: customers.id is the primary key, orders.customer_id is the pointer back to it."
  - "Query one is plain: SELECT id, name, city FROM customers ORDER BY id; — run it and read Mara's id off the first row."
  - "Query two filters on that number instead of naming her: SELECT id, customer_id, order_date FROM orders WHERE customer_id = 1 ORDER BY id;"
---
## One shop, two tables

Every query you've written so far read a single table. Real databases
almost never look like that. Rivertown Books keeps its customers in one
table and its orders in another:

```sql
CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, city TEXT, ...);
CREATE TABLE orders    (id INTEGER PRIMARY KEY, customer_id INTEGER, order_date TEXT);
```

Why not one big table with the customer's name on every order? Because
then Mara's city would be copied onto every order she ever places, and
the day she moves you get to update all of them — or miss one and have
a database that disagrees with itself. Store each fact once, in the
table it belongs to.

Two words for the link. `customers.id` is a **primary key**: unique,
one row, never repeated. `orders.customer_id` is a **foreign key**: not
a name, not a copy — just a number that says *which customer row this
order belongs to*. Order 3 carries `customer_id = 1`, and that 1 is the
whole relationship.

Splitting the data has a price, and you're about to feel it. To answer
"when did Mara order?" you do the lookup by hand: read her id out of
one table, then filter the other by it. Two queries, two round trips,
one number carried between them in your head. That's the chore the
rest of this unit deletes.

One habit to start now: **every query ends with `ORDER BY`.** A table
has no natural order. SQLite hands rows back in whatever order was
convenient, and "convenient" changes when data is added or an index
appears. Rows that look sorted today can shuffle tomorrow. If order
matters — and for a report it always does — say so.

### Your goal

Two statements in `query.sql`, producing exactly:

```
id | name | city
----------------
1 | Mara | Portland
2 | Devon | Austin
3 | Priya | Boston
4 | Tom | Austin
5 | Ines | Portland

id | customer_id | order_date
-----------------------------
1 | 1 | 2026-03-02
3 | 1 | 2026-03-11
8 | 1 | 2026-04-01
```

Find Mara's id in the first result; use it — not her name — in the
second.
