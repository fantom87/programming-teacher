SELECT category,
       COUNT(*) AS sales,
       COUNT(DISTINCT item) AS distinct_items,
       ROUND(AVG(unit_price), 2) AS avg_price
FROM sales
GROUP BY category
ORDER BY category;
