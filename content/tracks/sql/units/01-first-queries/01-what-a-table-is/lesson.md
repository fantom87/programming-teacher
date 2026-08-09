---
id: 01-what-a-table-is
title: What a Table Is
language: sql
runner: browser
estMinutes: 10
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Run PRAGMA table_info(books); so the database lists its seven columns, their types, and which one is the primary key."
docs: [sql/what-is-a-database]
checks:
  - id: describes-books
    type: stdout
    entry: query.sql
    match: exact
    value: "cid | name | type | notnull | dflt_value | pk\n---------------------------------------------\n0 | id | INTEGER | 0 | NULL | 1\n1 | title | TEXT | 0 | NULL | 0\n2 | author | TEXT | 0 | NULL | 0\n3 | genre | TEXT | 0 | NULL | 0\n4 | year | INTEGER | 0 | NULL | 0\n5 | price | REAL | 0 | NULL | 0\n6 | copies | INTEGER | 0 | NULL | 0\n"
hints:
  - "The statement isn't a question about your books — it's a question about the table itself. SQLite spells those PRAGMA."
  - "The form is PRAGMA table_info(table_name); — the table name goes in the parentheses, with no quotes."
  - "The whole answer is one line: PRAGMA table_info(books);  — don't forget the semicolon."
---
## Look before you ask

A **database** is a place to keep data that a program can search, add to,
and protect. The kind you'll learn here — a *relational* database — keeps
everything in **tables**, and you talk to it in a language called SQL.

A table is a grid with rules. This unit's database has one, called
`books`: the stock list of a small used bookshop, The Bindery.

```
books
id | title       | author         | genre  | year | price | copies
---+-------------+----------------+--------+------+-------+-------
1  | Dune        | Frank Herbert  | sci-fi | 1965 | 12.95 | 3
2  | Neuromancer | William Gibson | sci-fi | 1984 |  9.25 | 2
```

Each **row** is one thing — here, one title on the shelf. Each **column**
is one fact that every row carries: `title`, `price`, `copies`. And every
column has a **type** the database enforces: `title` holds text, `year`
holds whole numbers, `price` holds a decimal. Try to file the word
"cheap" under `price` and the database will object. That's the difference
between a table and a spreadsheet — here the structure is a promise, not
a suggestion.

The blueprint (which tables exist, what columns they have, what types
those are) is the **schema**. Reading it is always step one, because you
cannot ask for a column you don't know exists. A surprising share of
beginner SQL errors are really just guessing at a name.

SQLite — the small, real database engine running in your browser — will
describe any table on request:

```sql
PRAGMA table_info(some_table);
```

A `PRAGMA` isn't a question about your data; it's a question about the
database itself. You get one row per column: its position (`cid`), name,
type, and whether it's the **primary key** (`pk`) — the column whose value
identifies a row uniquely.

Two files are open in the editor. You write in `query.sql`, the tab you
start on. The other one, `schema.sql`, builds the table and stocks it, and
runs before your query every single time. Statements end with a semicolon.

### Your goal

Ask the database to describe `books`. One statement, and the answer
should be its seven columns:

```
cid | name | type | notnull | dflt_value | pk
---------------------------------------------
0 | id | INTEGER | 0 | NULL | 1
1 | title | TEXT | 0 | NULL | 0
...
```
