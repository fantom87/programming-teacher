-- 1. customers joined to itself: c.name AS customer beside the name of
--    whoever referred them (r.name AS referred_by). Customers nobody
--    referred must still appear, with NULL. Order by customer.


-- 2. The explosion, measured: how many rows does pairing every customer
--    with every order produce? One column, named pairs.

