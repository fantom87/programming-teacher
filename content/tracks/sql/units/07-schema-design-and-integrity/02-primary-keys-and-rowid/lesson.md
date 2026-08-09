---
id: 02-primary-keys-and-rowid
title: Primary Keys and rowid
language: sql
runner: browser
estMinutes: 12
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Give the books table an INTEGER PRIMARY KEY, insert six books without ever typing an id, and show that the id you got back and SQLite's hidden rowid are the very same column."
docs: [sql/creating-tables, sql/constraints-and-keys]
checks:
  - id: books-get-their-own-ids
    type: stdout
    entry: query.sql
    match: exact
    value: "id | title | year\n-----------------\n1 | The Shipping News | 1993\n2 | Braiding Sweetgrass | 2013\n3 | Piranesi | 2020\n4 | The Overstory | 2018\n5 | Station Eleven | 2014\n6 | A Psalm for the Wild-Built | 2021\n\nrowid_col | id_col | title\n--------------------------\n3 | 3 | Piranesi\n"
  - id: keys-not-typed
    type: ai-judge
    rubric: "The books table is created with id declared as INTEGER PRIMARY KEY (that exact phrase — not TEXT, not a plain INTEGER column, and AUTOINCREMENT is not required), and the INSERT names only (title, author, year) so SQLite assigns every id itself: no id values appear in the VALUES rows. The final SELECT reads rowid and id from the books table for the Piranesi row rather than restating the number 3 as a literal."
hints:
  - "The magic words are exact: id INTEGER PRIMARY KEY. INTEGER — not INT, not NUMBER — is what makes this column the table's rowid."
  - "Leave the ids out of the insert entirely: INSERT INTO books (title, author, year) VALUES ('The Shipping News', 'Annie Proulx', 1993), ... — SQLite fills in 1 through 6 in the order you listed them."
  - "For the last query, alias both columns so you can tell them apart: SELECT rowid AS rowid_col, id AS id_col, title FROM books WHERE title = 'Piranesi';"
---
## The row's true name

Every ordinary SQLite table already has a hidden identity column called
`rowid` — a 64-bit integer, unique within the table, quietly assigned on
every insert. You've been using it all along without seeing it.

Declaring a column as `id INTEGER PRIMARY KEY` doesn't add a second
identity. It hands you the existing one: your column *becomes* the
rowid, under a name you chose. That's why the phrase has to be exactly
`INTEGER PRIMARY KEY` — write `INT PRIMARY KEY` or `TEXT PRIMARY KEY`
and you get a normal indexed column plus an invisible rowid alongside it.

The practical payoff is that lookups by primary key are as fast as SQLite
gets, and you never have to invent an id yourself:

```sql
INSERT INTO books (title, author, year) VALUES ('Piranesi', ...);
```

Leave `id` out of the column list and SQLite assigns one greater than the
largest currently in the table. Delete the last row and insert again, and
that number gets handed out a second time — which matters only if
something outside the database remembers old ids. That's what
`AUTOINCREMENT` is for: added after `PRIMARY KEY`, it promises never to
reuse a value, at the cost of an extra bookkeeping table on every insert.
Most schemas, including this one, don't need it.

What makes a good key? Something the row's meaning never depends on. An
email address changes; a title gets a new edition; a card number gets
reissued. A meaningless integer never has to change, so nothing else has
to change with it. Every table in this unit gets one.

### Your goal

Create `books` with `id INTEGER PRIMARY KEY`, then `title`, `author` and
`year`. Insert the six books on Fernwood's shelves *without typing a
single id*, list them, and finish by showing that `rowid` and `id` are
one column wearing two names:

```
id | title | year
-----------------
1 | The Shipping News | 1993
...

rowid_col | id_col | title
--------------------------
3 | 3 | Piranesi
```

Without those aliases SQLite would label both columns `id` — which is
the proof, really.
