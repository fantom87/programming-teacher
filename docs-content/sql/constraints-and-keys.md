# Constraints and keys

Constraints are rules the database enforces so bad data can't get in. Declare them once in the schema and every INSERT and UPDATE is checked automatically — forever.

## Primary keys

A **primary key** uniquely identifies each row:

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);
```

In SQLite, `INTEGER PRIMARY KEY` is special: it becomes an alias for the built-in *rowid*, and if you insert without an id, SQLite assigns the next number automatically:

```sql
INSERT INTO users (name) VALUES ('Ada');   -- gets id 1
INSERT INTO users (name) VALUES ('Grace'); -- gets id 2
```

You'll sometimes see `AUTOINCREMENT` added. It's rarely needed — plain `INTEGER PRIMARY KEY` already auto-assigns; `AUTOINCREMENT` only adds a guarantee that ids of deleted rows are never reused.

## Column constraints

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  price REAL NOT NULL CHECK (price >= 0),
  in_stock INTEGER NOT NULL DEFAULT 1
);
```

- `NOT NULL` — the column must have a value.
- `UNIQUE` — no two rows may share a value (a second `'ABC-123'` sku is rejected).
- `DEFAULT` — the value used when an INSERT omits the column.
- `CHECK` — an arbitrary rule each row must satisfy; a negative price is refused with an error.

Violating any of these makes the statement fail loudly — which is exactly what you want. A crash at write time beats corrupt data at report time.

## Foreign keys

A **foreign key** declares that a column points at another table's primary key:

```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  total REAL NOT NULL
);
```

Now an order with `customer_id = 999` is rejected unless customer 999 exists, and deleting a customer who still has orders is blocked. One SQLite quirk: enforcement is off by default. Turn it on per connection:

```sql
PRAGMA foreign_keys = ON;
```

You can also declare what happens on delete: `REFERENCES customers(id) ON DELETE CASCADE` removes a customer's orders along with the customer — powerful, so use it deliberately.

Together, keys and constraints are your schema's immune system: they turn "we hope the data is right" into "the database guarantees it."
