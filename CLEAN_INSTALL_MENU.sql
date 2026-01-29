-- ============================================
-- CLEAN MENU SETUP - DELETE ALL & INSERT FRESH
-- ============================================

-- Step 1: Delete ALL existing menu items
DELETE FROM menu_items;

-- Step 2: Insert fresh items with categories
INSERT INTO menu_items (name, price, daily_stock_quantity, unit, is_enabled, category) VALUES
-- VEG ITEMS
('கேசரி', 40, 20, 'Qty', true, 'veg'),
('பாயாசம்', 50, 15, 'Qty', true, 'veg'),
('சாம்பார்', 40, 30, 'Qty', true, 'veg'),
('புளி குழம்பு', 45, 25, 'Qty', true, 'veg'),
('ரசம்', 35, 30, 'Qty', true, 'veg'),
('மோர் குழம்பு', 40, 20, 'Qty', true, 'veg'),
('பொரியல்', 40, 25, 'Qty', true, 'veg'),
('கூட்டு', 45, 20, 'Qty', true, 'veg'),
('எள்ளுற்றா குழம்பு', 50, 15, 'Qty', true, 'veg'),
('எக்ற்றா ரசம்', 60, 15, 'Qty', true, 'veg'),
('எக்ற்றா அவியல்', 60, 15, 'Qty', true, 'veg'),
('எக்ற்றா கூட்டு', 65, 15, 'Qty', true, 'veg'),
('கடைசல்', 30, 20, 'Qty', true, 'veg'),
('துவயல்', 35, 20, 'Qty', true, 'veg'),
('இஞ்சி புளி', 25, 30, 'Qty', true, 'veg'),
('காளான் சில்லி', 45, 15, 'Qty', true, 'veg'),
('காலிப்பளவர் சில்லி', 50, 15, 'Qty', true, 'veg'),
('காளான் கீரேவி', 50, 15, 'Qty', true, 'veg'),
('பன்னீர் பட்டர் மசாலா', 120, 10, 'Qty', true, 'veg'),
('சாதம்', 30, 50, 'Qty', true, 'veg'),
('அளவு சாப்பாடு', 35, 40, 'Qty', true, 'veg'),
('காளான் பிரியாணி', 80, 20, 'Qty', true, 'veg'),
('டிபன் சாம்பார்', 100, 15, 'Qty', true, 'veg'),
('வெஜ் குருமா', 40, 20, 'Qty', true, 'veg'),
('சென்னா மசாலா', 35, 20, 'Qty', true, 'veg'),
('தக்காளி தொக்கு', 40, 15, 'Qty', true, 'veg'),
('சட்னி 20', 20, 50, 'Qty', true, 'veg'),
('சட்னி 25', 25, 50, 'Qty', true, 'veg'),
('இட்லி', 15, 40, 'Qty', true, 'veg'),
('இடியாப்பம்', 20, 30, 'Qty', true, 'veg'),
('பொங்கல்', 30, 25, 'Qty', true, 'veg'),
('சந்தகை', 25, 30, 'Qty', true, 'veg'),
('கொழுக்கட்டை', 35, 20, 'Qty', true, 'veg'),
('பணியாரம்', 25, 30, 'Qty', true, 'veg'),
('சப்பாத்தி', 30, 25, 'Qty', true, 'veg'),

-- NON-VEG ITEMS
('முட்டை', 20, 30, 'Qty', true, 'non-veg'),
('முட்டை குழம்பு', 50, 20, 'Qty', true, 'non-veg'),
('முட்டை கீரேவி', 55, 15, 'Qty', true, 'non-veg'),
('சிக்கன் குழம்பு', 120, 20, 'Qty', true, 'non-veg'),
('சிக்கன் கீரேவி', 130, 15, 'Qty', true, 'non-veg'),
('நாட்டுக்கோழி குழம்பு', 150, 15, 'Qty', true, 'non-veg'),
('நாட்டுக்கோழி கீரேவி', 160, 15, 'Qty', true, 'non-veg'),
('மட்டன் குழம்பு', 180, 15, 'Qty', true, 'non-veg'),
('மட்டன் கீரேவி', 190, 15, 'Qty', true, 'non-veg'),
('குடல் கீரேவி', 140, 15, 'Qty', true, 'non-veg'),
('குடல் பிரை', 130, 15, 'Qty', true, 'non-veg'),
('நாட்டுக்கோழி கூப்', 150, 15, 'Qty', true, 'non-veg'),
('மத்தி மீன் குழம்பு', 120, 20, 'Qty', true, 'non-veg'),
('கட்லா மீன் குழம்பு', 140, 15, 'Qty', true, 'non-veg'),
('பாரை மீன் குழம்பு', 150, 15, 'Qty', true, 'non-veg'),
('மண்டை மீன் குழம்பு', 130, 15, 'Qty', true, 'non-veg'),
('கருவாட்டு குழம்பு', 150, 15, 'Qty', true, 'non-veg'),
('மத்தி பிரை', 130, 15, 'Qty', true, 'non-veg'),
('பாரை பிரை', 140, 15, 'Qty', true, 'non-veg'),
('மீன் சில்லி', 160, 10, 'Qty', true, 'non-veg'),
('நண்டு குழம்பு', 170, 10, 'Qty', true, 'non-veg'),
('சிக்கன் செட்டிநாடு கிரேவி', 180, 10, 'Qty', true, 'non-veg'),
('சிக்கன் செட்டிநாடு பிரை', 175, 10, 'Qty', true, 'non-veg'),
('வாத்து பிரை', 180, 10, 'Qty', true, 'non-veg'),
('சிக்கன் பிரியாணி', 200, 15, 'Qty', true, 'non-veg'),
('அசைவ மினி காம்போ', 190, 10, 'Qty', true, 'non-veg'),
('மீன் மினி காம்போ', 180, 10, 'Qty', true, 'non-veg'),
('கருவாட்டு தொக்கு', 35, 20, 'Qty', true, 'non-veg'),
('போன்லெஸ் சில்லி', 45, 15, 'Qty', true, 'non-veg'),
('போன் சில்லி சிக்கன்', 60, 15, 'Qty', true, 'non-veg'),
('பெப்பர் சிக்கன் பிரை', 70, 15, 'Qty', true, 'non-veg'),
('பெப்பர் சிக்கன் கிரேவி', 70, 15, 'Qty', true, 'non-veg'),
('நண்டு கிரேவி', 60, 15, 'Qty', true, 'non-veg'),
('வாத்து கிரேவி', 70, 15, 'Qty', true, 'non-veg');

-- Step 3: Verify final count
SELECT 
  category,
  COUNT(*) as total
FROM menu_items
GROUP BY category
ORDER BY category;

-- Step 4: View all items
SELECT 
  name,
  category,
  price,
  daily_stock_quantity,
  is_enabled
FROM menu_items
ORDER BY category, name;
