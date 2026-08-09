SELECT category,
       channel,
       COUNT(*) AS sales,
       SUM(qty) AS items
FROM sales
GROUP BY category, channel
ORDER BY category, channel;
