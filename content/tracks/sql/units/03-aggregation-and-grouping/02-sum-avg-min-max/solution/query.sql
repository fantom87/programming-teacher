SELECT SUM(qty) AS items_sold,
       AVG(unit_price) AS avg_price,
       MIN(unit_price) AS cheapest,
       MAX(unit_price) AS priciest
FROM sales;
