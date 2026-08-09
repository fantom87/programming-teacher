-- Part 1 — a number series. The anchor row is here; add the step.
--
-- TODO: after SELECT 1, add   UNION ALL
--       then the step:        SELECT n + 1 FROM numbers WHERE n < 5
WITH RECURSIVE numbers(n) AS (
  SELECT 1
)
SELECT n FROM numbers ORDER BY n;

-- Part 2 — walk the staff table from the owner down.
--
-- TODO: anchor = the staff row whose manager_id IS NULL, with 1 AS level.
--       step   = staff joined to chain ON s.manager_id = chain.id,
--                carrying chain.level + 1.
-- Then select level, name, role ordered by level, then name.
WITH RECURSIVE chain AS (
  SELECT id, name, role, 1 AS level
  FROM staff
  WHERE manager_id IS NULL
)
SELECT level, name, role
FROM chain
ORDER BY level, name;
