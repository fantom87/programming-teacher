# What is a database?

A database is an organized collection of data that a program can search, update, and protect. The kind you'll use here is a *relational* database: all data lives in **tables**, and you talk to it in a language called **SQL** (Structured Query Language).

## Tables, rows, and columns

A table looks like a spreadsheet with rules:

```
users
id | name    | email             | age
---+---------+-------------------+----
1  | Ada     | ada@example.com   | 36
2  | Grace   | grace@example.com | 45
3  | Linus   | linus@example.com | 28
```

- Each **row** is one record — one user, one order, one song.
- Each **column** is one attribute every row shares — `name`, `email`, `age`.
- Each column has a **type**: text, numbers, and so on. Unlike a spreadsheet, a database enforces its structure.

## The schema

The *schema* is the blueprint: which tables exist, what columns they have, and how tables relate. Reading the schema is always step one — you can't query what you don't know exists. In SQLite you can ask:

```sql
SELECT name FROM sqlite_master WHERE type = 'table';
```

## Why not just use a file?

You could store data in a text file, but a database gives you things a file can't:

- **Querying** — "all users over 30, sorted by name" is one line of SQL.
- **Integrity** — rules like "every order must belong to a real customer" are enforced automatically.
- **Concurrency** — many programs can read and write safely at once.
- **Speed** — indexes find one row among millions without scanning them all.

## SQLite: the database you'll use

These lessons run on **SQLite**, a small, real database engine that stores everything in a single file. It powers your phone, your browser, and probably half the apps on your computer. The SQL you learn transfers almost directly to bigger engines like PostgreSQL and MySQL — the core language is shared, with dialect differences at the edges.

SQL statements end with a semicolon, and keywords like `SELECT` are conventionally written in UPPERCASE (though the language doesn't require it).
