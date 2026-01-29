-- Add category column to menu_items table
ALTER TABLE menu_items
ADD COLUMN category VARCHAR(50) DEFAULT 'veg';

-- Create indexes for better performance
CREATE INDEX idx_menu_items_category ON menu_items(category);
