# Creating tables

`CREATE TABLE` defines a new table: its name, its columns, and each column's type. This is *DDL* — data definition language — the part of SQL that shapes the database itself.

## CREATE TABLE

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  in_stock INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

Each line is a column: name, type, then any constraints. Running this twice errors ("table already exists"); scripts often use `CREATE TABLE IF NOT EXISTS` to be re-runnable.

## SQLite's types (and type affinity)

SQLite has five storage types: `INTEGER`, `REAL` (floating point), `TEXT`, `BLOB` (raw bytes), and NULL. There's no separate date type — dates are stored as TEXT (`'2024-06-01'`) or numbers, with date functions like `strftime` doing the work.

Uniquely among databases, SQLite uses *type affinity*: a column's type is a preference, not a law. You can insert `'hello'` into an INTEGER column and SQLite will shrug and store it. Big engines like PostgreSQL would refuse. Treat types as a promise you keep, even though SQLite won't force you to. (Declaring columns as `VARCHAR(50)` or `DECIMAL` works too — SQLite maps them to its affinities.)

## ALTER TABLE: changing your mind

Schemas evolve. SQLite supports the basics:

```sql
ALTER TABLE products ADD COLUMN category TEXT;
ALTER TABLE products RENAME COLUMN name TO title;
ALTER TABLE products RENAME TO catalog;
ALTER TABLE products DROP COLUMN in_stock;
```

More complex changes (altering a column's type or constraints) require the classic dance: create a new table, `INSERT ... SELECT` the data across, drop the old one, rename.

## DROP TABLE

```sql
DROP TABLE IF EXISTS staging_import;
```

Gone: structure, data, indexes. `IF EXISTS` avoids an error when it's already absent.

## Views: saved queries

A *view* is a named query that behaves like a read-only table:

```sql
CREATE VIEW active_products AS
SELECT * FROM products WHERE in_stock = 1;

SELECT name FROM active_products ORDER BY name;
```

No data is copied — the view reruns its query each time. Perfect for giving a complicated join or filter a simple, reusable name.
