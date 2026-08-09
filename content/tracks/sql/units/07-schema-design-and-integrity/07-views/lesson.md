---
id: 07-views
title: Views
language: sql
runner: browser
estMinutes: 15
files:
  - path: query.sql
    starter: starter/query.sql
  - path: schema.sql
    starter: starter/schema.sql
goal: "Save the four-table 'what's out right now' join as a view called books_on_loan, query it like a table, check a book back in, and watch the same view answer differently — because a view stores the question, not the answer."
docs: [sql/creating-tables, sql/joins]
checks:
  - id: view-stays-live
    type: stdout
    entry: query.sql
    match: exact
    value: "loan_id | member | title\n------------------------\n2 | Marcus Wood | Piranesi\n4 | Ada Fern | The Overstory\n5 | Dana Okoye | A Psalm for the Wild-Built\n\nloan_id | member | title\n------------------------\n2 | Marcus Wood | Piranesi\n5 | Dana Okoye | A Psalm for the Wild-Built\n\nmember | out_now\n----------------\nDana Okoye | 1\nMarcus Wood | 1\n"
  - id: one-view-three-questions
    type: ai-judge
    rubric: "A single CREATE VIEW books_on_loan holds the whole join — loans to copies to books and loans to members — with the WHERE l.returned_on IS NULL filter inside the view and no ORDER BY inside it. All three result queries read FROM books_on_loan: the join is written exactly once and is not repeated as a standalone SELECT anywhere else in query.sql. The two listing queries are identical apart from being separated by the UPDATE that sets returned_on for loan 4, and the last query aggregates over the view with GROUP BY member."
hints:
  - "CREATE VIEW books_on_loan AS followed by the SELECT — no parentheses, and it ends with the usual semicolon. Alias the output columns (l.id AS loan_id, m.name AS member, b.title AS title) because those aliases become the view's column names."
  - "Reach books through copies: FROM loans l JOIN copies c ON c.id = l.copy_id JOIN books b ON b.id = c.book_id JOIN members m ON m.id = l.member_id, and keep only WHERE l.returned_on IS NULL."
  - "Then treat it as a table: SELECT loan_id, member, title FROM books_on_loan ORDER BY loan_id; — run it, do the UPDATE, run the exact same query again, and finish with GROUP BY member over the view."
---
## A name for a question

The query behind "what's out right now?" spans four tables: a loan
points at a copy, the copy points at a book, and the loan also points at
a member. It's correct, it's four joins long, and everyone at the desk
needs it several times a day. Typing it out each time is how variations
creep in — one version forgets `returned_on IS NULL`, and now two reports
disagree.

A **view** gives the query a name:

```sql
CREATE VIEW books_on_loan AS
SELECT l.id AS loan_id, m.name AS member, b.title AS title, ...
```

From then on, `books_on_loan` behaves like a table. You can `SELECT`
from it, filter it, sort it, join it to something else, aggregate over
it. The output aliases become its column names, which is why naming them
carefully matters.

The crucial thing — and the reason views are safe to trust — is that
nothing is copied. A view stores the *text of the query*, not its
results. Every time you select from it, SQLite runs the underlying query
against the tables as they are right now. Check a book in, and the next
read of the view shows one row fewer without anyone refreshing anything.
There is no stale copy, because there is no copy. (A materialized view
*would* store rows; SQLite doesn't have those, which spares you the
question of when to rebuild them.)

Two habits worth adopting. Don't put `ORDER BY` inside a view — sorting
is the caller's business, and an inner sort is wasted work when the
caller sorts differently anyway. And keep views for reading: SQLite views
are not writable, so an `INSERT` into one is an error unless you go build
a trigger for it.

### Your goal

Create `books_on_loan`, ask it what's out, hand loan 4 back on
`'2025-04-21'`, ask the identical question again — then count what each
member still has:

```
loan_id | member | title
------------------------
2 | Marcus Wood | Piranesi
4 | Ada Fern | The Overstory
5 | Dana Okoye | A Psalm for the Wild-Built

loan_id | member | title
------------------------
2 | Marcus Wood | Piranesi
5 | Dana Okoye | A Psalm for the Wild-Built
...
```

Same view, same query, different world.
