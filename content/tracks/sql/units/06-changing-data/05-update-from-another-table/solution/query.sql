-- 1. The new value comes from the other table; the WHERE keeps the
--    unlisted coffees out of the update entirely.
UPDATE coffees
SET price = (
  SELECT pc.new_price
  FROM price_changes pc
  WHERE pc.coffee_id = coffees.id
)
WHERE id IN (SELECT coffee_id FROM price_changes);

-- 2. Verify.
SELECT id, name, price FROM coffees ORDER BY id;
