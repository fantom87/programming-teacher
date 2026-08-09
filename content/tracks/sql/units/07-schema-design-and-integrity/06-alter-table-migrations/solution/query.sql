ALTER TABLE members ADD COLUMN email TEXT;

ALTER TABLE members ADD COLUMN status TEXT NOT NULL DEFAULT 'active';

UPDATE members
SET email = lower(replace(name, ' ', '.')) || '@fernwood.example';

UPDATE members
SET status = 'lapsed'
WHERE joined_on < '2024-01-01';

SELECT id, name, email, status
FROM members
ORDER BY id;

PRAGMA table_info(members);
