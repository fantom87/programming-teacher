-- Today's pallet: 10 more bags of Deep Well, 6 of Night Shift, and
-- 20 bags of Harbor Light (Honduras, medium, 15.95) — a coffee we have
-- never stocked. One statement handles all three.

-- 1. INSERT the three rows with an ON CONFLICT(name) clause that ADDS the
--    delivered bags to whatever is already on the shelf.


-- 2. Verify: id, name, bags for every coffee, ordered by id.
