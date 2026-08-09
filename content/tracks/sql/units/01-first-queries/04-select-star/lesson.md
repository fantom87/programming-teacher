---
id: 04-select-star
title: SELECT * and Its Price
language: sql
runner: browser
estMinutes: 10
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Use SELECT * to dump every column of books at once, and learn why the star belongs in exploration rather than in code you keep."
docs: [sql/select-basics]
checks:
  - id: whole-table
    type: stdout
    entry: query.sql
    match: exact
    value: "id | title | author | genre | year | price | copies\n---------------------------------------------------\n1 | Dune | Frank Herbert | sci-fi | 1965 | 12.95 | 3\n2 | Neuromancer | William Gibson | sci-fi | 1984 | 9.25 | 2\n3 | The Left Hand of Darkness | Ursula K. Le Guin | sci-fi | 1969 | 11.75 | 1\n4 | Beloved | Toni Morrison | literary | 1987 | 10.45 | 4\n5 | The Hobbit | J.R.R. Tolkien | fantasy | 1937 | 8.99 | 6\n6 | A Wizard of Earthsea | Ursula K. Le Guin | fantasy | 1968 | 7.25 | 2\n7 | Silent Spring | Rachel Carson | nonfiction | 1962 | 6.75 | 1\n8 | The Sixth Extinction | Elizabeth Kolbert | nonfiction | 2014 | 14.99 | 5\n"
  - id: really-a-star
    type: ai-judge
    rubric: "The query gets every column with the * wildcard — SELECT * FROM books — rather than by listing the seven column names (id, title, author, genre, year, price, copies) in the SELECT list. ORDER BY id is present."
hints:
  - "There's a single character that means \"every column\", and it's the one you'd use for multiplication."
  - "It goes exactly where a column list would go: SELECT * FROM ..."
  - "SELECT * FROM books ORDER BY id;"
---
## The whole table, please

Sometimes you don't want a considered list of columns — you want to see
what you're dealing with. SQL has a shorthand for that:

```sql
SELECT *
FROM books
ORDER BY id;
```

The `*` means *every column, in the order the table defines them*. It's
the query you type first when a table is new to you, and you'll type it
thousands of times over a career.

So why doesn't everyone just use it everywhere? Because a `*` is a
question with no fixed answer. Three reasons it gets you into trouble
once a query is written down and kept:

**It changes underneath you.** Someone adds a `notes` column next spring
and your query silently starts returning it. If a program was reading
columns by position, it now reads the wrong one. Named columns keep
working.

**It hauls data you don't need.** Selecting seven columns to display one
means the database reads, ships, and formats six for nothing. On eight
rows that's invisible; on eight million it's the difference between a
snappy report and a slow one.

**It hides what you meant.** `SELECT title, price` tells the next reader —
usually you, months later — exactly which facts this query depends on.
`SELECT *` tells them nothing.

So keep both habits and know which is which:

> `SELECT *` to *explore*. Named columns for anything you save, share, or
> put in a program.

Watch what the wide output does to the display below, too: the more
columns you ask for, the harder the result is to read. That's another
quiet argument for asking only for what you need.

### Your goal

Dump the entire `books` table with the star, ordered by `id` — all seven
columns, all eight rows:

```
id | title | author | genre | year | price | copies
---------------------------------------------------
1 | Dune | Frank Herbert | sci-fi | 1965 | 12.95 | 3
...
```

An AI reviewer will check you used `*` rather than typing out all seven
names — this once, the shortcut is the point.
