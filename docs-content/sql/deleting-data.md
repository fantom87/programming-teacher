# Deleting data

`DELETE` removes rows permanently. It deserves the most caution of any statement you'll write — there is no undo button, only the safety habits you build now.

## DELETE with WHERE

```sql
DELETE FROM sessions
WHERE expires_at < '2024-01-01';
```

Same shape as UPDATE: the `WHERE` picks which rows die. And the same danger: `DELETE FROM sessions` with no WHERE deletes *every row in the table*. SQL will not ask "are you sure?" — it will just do it.

## The check-first habit

Always preview a delete as a SELECT with the identical WHERE:

```sql
-- 1. look at what would be deleted
SELECT COUNT(*) FROM sessions WHERE expires_at < '2024-01-01';

-- 2. same WHERE, now for real
DELETE FROM sessions WHERE expires_at < '2024-01-01';

-- 3. verify
SELECT COUNT(*) FROM sessions;
```

`DELETE ... RETURNING *` also shows you exactly which rows were removed as it removes them.

## Transactions: an undo button, briefly

Wrap risky changes in a transaction and you *can* back out — until you commit:

```sql
BEGIN;
DELETE FROM orders WHERE status = 'draft';
SELECT COUNT(*) FROM orders;   -- check the damage
ROLLBACK;                      -- undo everything since BEGIN
-- or COMMIT; to make it permanent
```

`ROLLBACK` restores the table as if the delete never happened. For any delete you're not 100% sure about, this is the professional workflow.

## Clearing a whole table

If you truly mean to empty a table, say it without a WHERE — deliberately:

```sql
DELETE FROM staging_import;    -- removes all rows, keeps the table
```

The table, its columns, and its indexes remain; only rows go. To remove the table itself, structure and all, that's `DROP TABLE staging_import` — a schema change, not a data change.

## Deletes and foreign keys

If other tables reference the rows you're deleting (orders pointing at a customer, say), a foreign key constraint may block the delete — or, with `ON DELETE CASCADE`, silently delete the referencing rows too. Know which behavior your schema uses *before* you need it; the constraints-and-keys page covers how these rules are declared.
