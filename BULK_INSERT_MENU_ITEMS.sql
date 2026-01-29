-- Bulk Insert Tamil Menu Items for Kulambu Kadai
-- Run this in your Supabase SQL Editor

-- Clear existing items (optional - remove if you want to keep existing items)
-- DELETE FROM menu_items;

-- Insert all Tamil menu items
INSERT INTO menu_items (name, price, daily_stock_quantity, unit, is_enabled) VALUES
-- Gravies & Curries
('கேசரி', 40, 20, 'pieces', true),
('பாயாசம்', 50, 15, 'bowl', true),
('சாம்பார்', 40, 30, 'bowl', true),
('புளி குழம்பு', 45, 25, 'bowl', true),
('ரசம்', 35, 30, 'bowl', true),
('மோர் குழம்பு', 40, 20, 'bowl', true),
('பொரியல்', 40, 25, 'bowl', true),
('கூட்டு', 45, 20, 'bowl', true),
('எள்ளுற்றா குழம்பு', 50, 15, 'bowl', true),
('எக்ற்றா ரசம்', 60, 15, 'bowl', true),
('எக்ற்றா அவியல்', 60, 15, 'bowl', true),
('எக்ற்றா கூட்டு', 65, 15, 'bowl', true),

-- Side Dishes & Pickles
('கடைசல்', 30, 20, 'bowl', true),
('துவயல் ', 35, 20, 'bowl', true),
('இஞ்சி புளி ', 25, 30, 'bowl', true),
('காளான் சில்லி', 45, 15, 'bowl', true),
('காலிப்பளவர் சில்லி', 50, 15, 'bowl', true),
('காளான்  கீரேவி', 50, 15, 'bowl', true),
('பன்னீர் பட்டர் மசாலா ', 120, 10, 'bowl', true),

-- Rice Varieties
('சாதம்', 30, 50, 'bowl', true),
('அளவு  சாப்பாடு', 35, 40, 'bowl', true),
('காளான்  பிரியாணி', 80, 20, 'bowl', true),

-- Egg Items
('முட்டை', 20, 30, 'piece', true),
('முட்டை குழம்பு', 50, 20, 'bowl', true),
('முட்டை கீரேவி', 55, 15, 'bowl', true),

-- Chicken Items
('சிக்கன் குழம்பு', 120, 20, 'bowl', true),
('சிக்கன் கீரேவி', 130, 15, 'bowl', true),
('நாட்டுக்கோழி குழம்பு', 150, 15, 'bowl', true),
('நாட்டுக்கோழி கீரேவி', 160, 15, 'bowl', true),
('மட்டன் குழம்பு', 180, 15, 'bowl', true),
('மட்டன் கீரேவி', 190, 15, 'bowl', true),

-- Fish & Seafood
('குடல்  கீரேவி', 140, 15, 'bowl', true),
('குடல் பிரை ', 130, 15, 'bowl', true),
('நாட்டுக்கோழி கூப்', 150, 15, 'bowl', true),
('மத்தி மீன் குழம்பு', 120, 20, 'bowl', true),
('கட்லா மீன் குழம்பு', 140, 15, 'bowl', true),
('பாரை மீன் குழம்பு', 150, 15, 'bowl', true),
('மண்டை மீன் குழம்பு', 130, 15, 'bowl', true),

-- Fish Fry Varieties
('கருவாட்டு  குழம்பு', 150, 15, 'bowl', true),
('மத்தி பிரை', 130, 15, 'bowl', true),
('பாரை பிரை', 140, 15, 'bowl', true),
('மீன் சில்லி ', 160, 10, 'bowl', true),
('நண்டு குழம்பு', 170, 10, 'bowl', true),
('சிக்கன் செட்டிநாடு கிரேவி ', 180, 10, 'bowl', true),
('சிக்கன் செட்டிநாடு பிரை ', 175, 10, 'bowl', true),
('வாத்து பிரை', 180, 10, 'bowl', true),
('சிக்கன் பிரியாணி', 200, 15, 'bowl', true),
('அசைவ மினி காம்போ', 190, 10, 'bowl', true),
('மீன் மினி காம்போ', 180, 10, 'bowl', true),

-- Special Items
('கருவாட்டு தொக்கு ', 35, 20, 'bowl', true),
('டிபன் சாம்பார்', 100, 15, 'bowl', true),
('வெஜ் குருமா', 40, 20, 'bowl', true),
('சென்னா மசாலா ', 35, 20, 'bowl', true),
('தக்காளி தொக்கு ', 40, 15, 'pieces', true),
('போன்லெஸ் சில்லி ', 45, 15, 'bowl', true),
('போன் சில்லி சிக்கன் ', 60, 15, 'bowl', true),
('பெப்பர் சிக்கன் பிரை ', 70, 15, 'bowl', true),
('பெப்பர் சிக்கன் கிரேவி  ', 70, 15, 'bowl', true),
('சட்னி 20 ', 20, 50, 'serving', true),
('சட்னி 25', 25, 50, 'serving', true),
('இட்லி ', 15, 40, 'piece', true),
('இடியாப்பம் ', 20, 30, 'serving', true),
('பொங்கல் ', 30, 25, 'bowl', true),
('சந்தகை ', 25, 30, 'bowl', true),
('கொழுக்கட்டை ', 35, 20, 'bowl', true),
('பணியாரம்', 25, 30, 'pieces', true),
('சப்பாத்தி', 30, 25, 'pieces', true),
('நண்டு கிரேவி ', 60, 15, 'bowl', true),
('வாத்து கிரேவி ', 70, 15, 'bowl', true);

-- Verify inserted items
SELECT COUNT(*) as total_items FROM menu_items;
SELECT * FROM menu_items ORDER BY name;
