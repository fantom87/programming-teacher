---
id: 07-junction-tables
title: Junction Tables
language: sql
runner: browser
estMinutes: 14
files:
  - path: schema.sql
    starter: starter/schema.sql
  - path: query.sql
    starter: starter/query.sql
goal: "Walk the orders-to-books many-to-many relationship through order_items in both directions: every line of every order, then every book beside the orders that wanted it."
docs: [sql/joins, sql/what-is-a-database]
checks:
  - id: both-directions
    type: stdout
    entry: query.sql
    match: exact
    value: "order_id | title | quantity\n---------------------------\n1 | Deep Field | 1\n1 | The Silent Tide | 1\n2 | Bread Alone | 2\n3 | Orbit | 3\n4 | The Silent Tide | 1\n5 | Night Kitchen | 1\n5 | Orbit | 1\n6 | Deep Field | 1\n7 | Bread Alone | 1\n8 | Night Kitchen | 1\n8 | The Silent Tide | 2\n\ntitle | order_id\n----------------\nBread Alone | 2\nBread Alone | 7\nDeep Field | 1\nDeep Field | 6\nNight Kitchen | 5\nNight Kitchen | 8\nOrbit | 3\nOrbit | 5\nThe Silent Tide | 1\nThe Silent Tide | 4\nThe Silent Tide | 8\n"
  - id: through-the-junction
    type: ai-judge
    rubric: "The first statement joins three tables — orders, order_items and books — with each ON matching a foreign key in order_items to the primary key of the table it points at (oi.order_id = o.id, oi.book_id = b.id). The second statement joins books to order_items the same way. Both are single queries with real joins, not subqueries or literal rows, and each ends with a deterministic ORDER BY."
hints:
  - "Chain the joins one table at a time: FROM orders AS o JOIN order_items AS oi ON oi.order_id = o.id JOIN books AS b ON b.id = oi.book_id."
  - "Each ON matches one foreign key to one primary key. order_items holds both keys, which is exactly why it can sit between the two tables."
  - "Part 2 is the same three-table chain minus one link — books to order_items is enough: SELECT b.title, oi.order_id FROM books AS b JOIN order_items AS oi ON oi.book_id = b.id ORDER BY b.title, oi.order_id;"
---
## When both sides are "many"

The shop database just grew. `schema.sql` now has `categories`, `books`
and `order_items` — open it and look at that last one.

A book belongs to one category, so `books.category_id` is enough: **one
category, many books**. But an order contains many books, and a book
appears in many orders. That's **many-to-many**, and no foreign key
column can express it. Put `book_id` on `orders` and an order holds one
book. Put `order_id` on `books` and a title can only ever be sold once.

The fix is a third table whose whole job is holding pairs:

```sql
CREATE TABLE order_items (
  order_id INTEGER NOT NULL,   -- -> orders.id
  book_id  INTEGER NOT NULL,   -- -> books.id
  quantity INTEGER NOT NULL
);
```

One row per book on an order. Two foreign keys, one pointing each way.
This is a **junction table** (also called a join, link, or bridge
table), and it's how every many-to-many relationship you'll ever meet
is actually stored: students and courses, posts and tags, actors and
films.

Notice `quantity`. It isn't a fact about the book, and it isn't a fact
about the order — it's a fact about *this book on this order*. Junction
tables are the natural home for that kind of data.

Querying through one is just two joins instead of one. Start at either
end and walk across:

```sql
FROM orders AS o
JOIN order_items AS oi ON oi.order_id = o.id
JOIN books      AS b  ON b.id = oi.book_id
```

The result has one row per *pairing* — eleven, for eight orders and six
books. And read it the other way around and the relationship is
symmetric: from the book side you see which orders wanted it. One title
never appears at all. Nothing is wrong; nobody has bought it.

### Your goal

Two statements. First, every order line — `order_id`, `title`,
`quantity`, ordered by order then title (11 rows, starting
`1 | Deep Field | 1`). Then the same links read from the book side —
`title`, `order_id`, ordered by title then order (11 rows, starting
`Bread Alone | 2`).
