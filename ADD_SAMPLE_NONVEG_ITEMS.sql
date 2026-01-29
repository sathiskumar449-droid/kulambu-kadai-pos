-- Sample Non-Veg Menu Items
-- Run this SQL in your Supabase SQL Editor to add sample non-veg items

INSERT INTO menu_items (name, price, category, is_enabled) VALUES
('சிக்கன் குருமா', 150, 'non-veg', true),
('கோழி ஃப்ரை', 120, 'non-veg', true),
('முட்டை குருமா', 100, 'non-veg', true),
('மட்டன் குருமா', 180, 'non-veg', true),
('மீன் குருமா', 160, 'non-veg', true),
('சிக்கன் பிரியாணி', 200, 'non-veg', true);

-- Or add them one by one:
-- INSERT INTO menu_items (name, price, category, is_enabled) VALUES ('சிக்கன் குருமா', 150, 'non-veg', true);
-- INSERT INTO menu_items (name, price, category, is_enabled) VALUES ('கோழி ஃப்ரை', 120, 'non-veg', true);
