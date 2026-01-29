-- ============================================
-- REMOVE ALL DUPLICATE MENU ITEMS (SIMPLE)
-- ============================================

-- Step 1: Normalize category field
UPDATE menu_items
SET category = 'non-veg'
WHERE category IN ('non_veg', 'nonveg', 'Non-Veg', 'NON-VEG');

UPDATE menu_items
SET category = 'veg'
WHERE category IS NULL OR category = '';

-- Step 2: Check duplicates before removal
SELECT 
  name,
  category,
  COUNT(*) as count
FROM menu_items
GROUP BY name, category
HAVING COUNT(*) > 1;

-- Step 3: Delete duplicates - Keep only the oldest one
DELETE FROM menu_items m1
WHERE created_at > (
  SELECT MIN(created_at)
  FROM menu_items m2
  WHERE m2.name = m1.name 
  AND COALESCE(m2.category, 'veg') = COALESCE(m1.category, 'veg')
);

-- Step 4: Verify no duplicates remain
SELECT 
  name,
  category,
  COUNT(*) as count
FROM menu_items
GROUP BY name, category
HAVING COUNT(*) > 1;

-- Step 5: Count by category
SELECT 
  category,
  COUNT(*) as total
FROM menu_items
GROUP BY category
ORDER BY category;

-- Step 6: View all items
SELECT 
  name,
  category,
  price,
  daily_stock_quantity,
  is_enabled
FROM menu_items
ORDER BY category, name;



