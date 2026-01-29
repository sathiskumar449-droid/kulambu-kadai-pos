-- CLEANUP: Remove all old menu items and start fresh
-- Run this to clean up duplicates

DELETE FROM menu_items;

-- Then run INSERT_ALL_MENU_ITEMS.sql to add fresh items

-- ===================================
-- ALTERNATIVE: Remove duplicates only
-- ===================================
-- Keep only the first occurrence of each item

DELETE FROM menu_items
WHERE id NOT IN (
  SELECT MIN(id)
  FROM menu_items
  GROUP BY name, category, price
);

-- Fix any items with null category (set to 'veg' by default)
UPDATE menu_items
SET category = 'veg'
WHERE category IS NULL OR category = '';

-- Verify the cleanup
SELECT category, COUNT(*) as count FROM menu_items GROUP BY category;
