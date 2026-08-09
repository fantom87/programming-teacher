---
id: 04-update-with-where
title: Updating Rows
language: sql
runner: browser
estMinutes: 14
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Raise the price of every Ethiopian coffee by $1.50 — rehearsing the change with a SELECT that uses the identical WHERE, running the UPDATE, then verifying the whole shelf."
docs: [sql/inserting-and-updating, sql/filtering-with-where]
checks:
  - id: preview-then-update
    type: stdout
    entry: query.sql
    match: exact
    value: "id | name | price\n-----------------\n1 | Morning Ritual | 16.95\n5 | Cloud Cover | 19.45\n\nid | name | price\n-----------------\n1 | Morning Ritual | 18.45\n2 | Deep Well | 18.25\n3 | Half Past Four | 15.75\n4 | Night Shift | 13.45\n5 | Cloud Cover | 20.95\n"
  - id: computed-not-typed
    type: ai-judge
    rubric: "query.sql contains exactly one UPDATE of the coffees table, carrying a WHERE clause on origin = 'Ethiopia' that matches the WHERE of the preview SELECT above it. The new price is computed from the existing column — an expression such as ROUND(price + 1.50, 2) — rather than assigned a literal per row, and the values 18.45 and 20.95 never appear in query.sql. No coffee is updated by deleting and re-inserting it."
hints:
  - "The shape is UPDATE coffees SET column = value WHERE condition; — SET says what changes, WHERE says which rows."
  - "The new value may be built from the old one: SET price = ROUND(price + 1.50, 2). SQL reads the current price of each matching row, adds to it, and writes it back."
  - "Write the preview first and run it: SELECT id, name, price FROM coffees WHERE origin = 'Ethiopia' ORDER BY id; then copy that WHERE, character for character, onto the UPDATE."
---
## SET says what, WHERE says which

`UPDATE` changes rows that already exist:

```sql
UPDATE coffees
SET price = ROUND(price + 1.50, 2)
WHERE origin = 'Ethiopia';
```

Three parts, and each does one job. `UPDATE coffees` names the table.
`SET` names the columns to change and their new values. `WHERE` decides
which rows are affected — and that is the clause you must respect.

Look at what `SET` is allowed to hold. `price + 1.50` isn't a constant;
it's an expression evaluated *per row*, reading that row's current
`price`. Each Ethiopian coffee gets its own answer. You can change
several columns at once too, separated by commas: `SET price = 19.95,
roast = 'medium'`.

Now the part that matters more than the syntax.

**Leave the WHERE off and SQL updates every row in the table.** Not an
error, not a confirmation prompt — `UPDATE coffees SET price = 0` sets
every price on the shelf to zero, reports success, and you find out from
a customer. There is no undo. This is the single most common way people
damage a production database, and it is always the same mistake.

The habit that prevents it is small and non-negotiable: **rehearse the
WHERE as a SELECT first.**

```sql
SELECT id, name, price FROM coffees WHERE origin = 'Ethiopia' ORDER BY id;
```

Same table, same `WHERE` — but harmless. Look at the rows. Are those the
ones you meant? Is the count what you expected? Only then change the
`SELECT ...` into `UPDATE ... SET ...` and leave the `WHERE` untouched.

Professionals do this every time, on tables they know well, for changes
they are sure about. It costs four seconds. Skipping it costs a weekend.

### Your goal

Preview, update, verify — three statements, two result sets:

```
id | name | price
-----------------
1 | Morning Ritual | 16.95
5 | Cloud Cover | 19.45

id | name | price
-----------------
1 | Morning Ritual | 18.45
2 | Deep Well | 18.25
3 | Half Past Four | 15.75
4 | Night Shift | 13.45
5 | Cloud Cover | 20.95
```
