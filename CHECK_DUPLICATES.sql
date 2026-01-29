-- Check for duplicate menu items
SELECT name, category, COUNT(*) as count, COUNT(DISTINCT id) as unique_ids
FROM menu_items
GROUP BY name, category
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- View all menu items with their categories
SELECT id, name, category, price, is_enabled
FROM menu_items
ORDER BY category, name;

-- Count items by category
SELECT category, COUNT(*) as count
FROM menu_items
GROUP BY category;
