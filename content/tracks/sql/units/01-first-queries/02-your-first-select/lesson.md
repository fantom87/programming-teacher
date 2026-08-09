---
id: 02-your-first-select
title: Your First SELECT
language: sql
runner: browser
estMinutes: 10
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Write SELECT title FROM books ORDER BY id; to pull one column out of the table as a result set, in a guaranteed order."
docs: [sql/select-basics, sql/what-is-a-database]
checks:
  - id: lists-titles
    type: stdout
    entry: query.sql
    match: exact
    value: "title\n-----\nDune\nNeuromancer\nThe Left Hand of Darkness\nBeloved\nThe Hobbit\nA Wizard of Earthsea\nSilent Spring\nThe Sixth Extinction\n"
hints:
  - "Two clauses: SELECT says which column you want, FROM says which table it lives in."
  - "SELECT title FROM books; gets the data — now pin the row order so the answer is the same every run."
  - "The full query is: SELECT title FROM books ORDER BY id;"
---
## Asking a question

Here's the real thing at last. A question you put to a database is a
**query**, and nearly every query opens with the same two words: what you
want, and where it lives.

```sql
SELECT title
FROM books;
```

Read it aloud: *select the title column, from the books table.* Run it and
the database hands back a **result set** — a temporary little table built
to your order, one column wide and one row per book. The stored table
isn't touched. A `SELECT` only ever looks; changing data is a different
verb entirely, and a whole unit of its own later on.

Capitalization and line breaks are yours to choose. `select title from
books;` runs identically. The convention — keywords in capitals, one
clause per line — exists because real queries grow to a dozen lines, and
one you can scan in a second is worth a few extra newlines.

Now a habit that will save you from a whole family of baffling bugs. A
table is a **bag of rows**, not a list. SQL makes no promise about the
order rows come back in; today it may look like the order they were
inserted, but after the table grows or the engine reorganizes itself, it
may quietly stop looking like that. If you want an order, ask for one:

```sql
SELECT title
FROM books
ORDER BY id;
```

`ORDER BY id` sorts the result by the `id` column — 1, 2, 3 — so it comes
out identical on every run and every machine. The next unit gives
`ORDER BY` the full treatment. Until then, treat it as hygiene: end every
query with it, the way you'd end a sentence with a full stop.

### Your goal

List every title in the shop, ordered by `id`:

```
title
-----
Dune
Neuromancer
The Left Hand of Darkness
...
```

Look at the shape of that output — column name, a rule of dashes, then
the rows. Every result set you meet from here on prints just like it.
