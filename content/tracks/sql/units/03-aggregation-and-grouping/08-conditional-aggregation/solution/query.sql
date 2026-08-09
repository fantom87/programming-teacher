SELECT category,
       SUM(CASE WHEN channel = 'counter' THEN qty ELSE 0 END) AS counter_items,
       SUM(CASE WHEN channel = 'online' THEN qty ELSE 0 END) AS online_items,
       COUNT(CASE WHEN rating IS NULL THEN 1 END) AS unrated
FROM sales
GROUP BY category
ORDER BY category;
