---
id: 03-choosing-columns
title: Choosing Columns
language: sql
runner: browser
estMinutes: 10
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Select three columns — year, then title, then price — proving the SELECT list controls both which columns come back and in what order."
docs: [sql/select-basics]
checks:
  - id: three-columns-in-order
    type: stdout
    entry: query.sql
    match: exact
    value: "year | title | price\n--------------------\n1965 | Dune | 12.95\n1984 | Neuromancer | 9.25\n1969 | The Left Hand of Darkness | 11.75\n1987 | Beloved | 10.45\n1937 | The Hobbit | 8.99\n1968 | A Wizard of Earthsea | 7.25\n1962 | Silent Spring | 6.75\n2014 | The Sixth Extinction | 14.99\n"
hints:
  - "Separate the column names with commas: SELECT a, b, c FROM ..."
  - "The header must read year | title | price, so write the names in exactly that order — not the order the schema happens to use."
  - "SELECT year, title, price FROM books ORDER BY id;"
---
## The SELECT list

`SELECT` doesn't take one column — it takes a **list**, separated by
commas:

```sql
SELECT title, price
FROM books
ORDER BY id;
```

Two columns come back, side by side. Add a third and you get three. This
list is the single most-edited part of any query: it's where you decide
what the report contains.

And it really is *your* list, not the table's. Columns come back in the
order you write them, whatever order they sit in on disk:

```sql
SELECT price, title
FROM books
ORDER BY id;
```

Same eight books, same two facts, a different-looking report. The table
has a fixed shape; a result set is shaped by the question. That's worth
sitting with for a second, because it's the whole idea behind SQL — you
describe the answer you want, and the database figures out how to build
it.

One thing to be careful about: the names must match the schema exactly.
Ask for a column that doesn't exist and the database refuses the whole
script — not just that statement:

```
no such column: titel
```

That message is a gift, honestly. It tells you precisely which name it
couldn't find, and the fix is always the same: go back and read the
schema. (`PRAGMA table_info(books);` from lesson 1 is never more than one
line away.)

Spacing is free — `SELECT year,title,price` is legal, if unloved. A space
after each comma reads better, and lining up a long list one name per line
is common in professional code:

```sql
SELECT year,
       title,
       price
FROM books
ORDER BY id;
```

### Your goal

Build a small catalogue card: `year` first, then `title`, then `price`,
ordered by `id`.

```
year | title | price
--------------------
1965 | Dune | 12.95
1984 | Neuromancer | 9.25
...
```

The header line tells you whether you got the order right.
