-- Part 1: a number series built from nothing but a starting row and a rule.
WITH RECURSIVE numbers(n) AS (
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM numbers WHERE n < 5
)
SELECT n FROM numbers ORDER BY n;

-- Part 2: the same shape, walking the staff table from the owner down.
WITH RECURSIVE chain AS (
  SELECT id, name, role, 1 AS level
  FROM staff
  WHERE manager_id IS NULL
  UNION ALL
  SELECT s.id, s.name, s.role, chain.level + 1
  FROM staff s
  JOIN chain ON s.manager_id = chain.id
)
SELECT level, name, role
FROM chain
ORDER BY level, name;
