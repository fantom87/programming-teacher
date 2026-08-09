-- Apply the importer's price list to the shelf. Do NOT type any of the
-- new prices yourself — read them out of price_changes.

-- 1. One UPDATE. SET price from a subquery that matches on the id, and
--    keep a WHERE so the coffees with no listed change stay untouched.


-- 2. Verify: id, name, price for every coffee, ordered by id.
