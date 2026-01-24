-- Kulambu Kadai POS - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Menu Items Table
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  daily_stock_quantity DECIMAL(10, 2) DEFAULT 0,
  unit VARCHAR(50) DEFAULT 'litres',
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: 'name' stores Tamil menu item names only.
-- English input is auto-converted to Tamil in the frontend before saving.

-- Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Order Items Table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  item_name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stock Logs Table
CREATE TABLE stock_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  prepared_quantity DECIMAL(10, 2) DEFAULT 0,
  sold_quantity DECIMAL(10, 2) DEFAULT 0,
  remaining_quantity DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(menu_item_id, date)
);

-- Daily Sales Summary Table
CREATE TABLE daily_sales_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE DEFAULT CURRENT_DATE,
  total_orders INTEGER DEFAULT 0,
  total_revenue DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date)
);

-- Create indexes for better performance
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item_id ON order_items(menu_item_id);
CREATE INDEX idx_stock_logs_date ON stock_logs(date);
CREATE INDEX idx_stock_logs_menu_item_id ON stock_logs(menu_item_id);
CREATE INDEX idx_daily_sales_summary_date ON daily_sales_summary(date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stock_logs_updated_at BEFORE UPDATE ON stock_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_sales_summary_updated_at BEFORE UPDATE ON daily_sales_summary
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    order_count INTEGER;
    new_order_number TEXT;
BEGIN
    SELECT COUNT(*) INTO order_count FROM orders WHERE DATE(created_at) = CURRENT_DATE;
    new_order_number := 'ORD-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD((order_count + 1)::TEXT, 4, '0');
    RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- Function to update stock when order is placed
CREATE OR REPLACE FUNCTION update_stock_on_order()
RETURNS TRIGGER AS $$
BEGIN
    -- Update or insert stock log
    INSERT INTO stock_logs (menu_item_id, date, sold_quantity, remaining_quantity)
    VALUES (
        NEW.menu_item_id,
        CURRENT_DATE,
        NEW.quantity,
        (SELECT daily_stock_quantity FROM menu_items WHERE id = NEW.menu_item_id) - NEW.quantity
    )
    ON CONFLICT (menu_item_id, date)
    DO UPDATE SET
        sold_quantity = stock_logs.sold_quantity + NEW.quantity,
        remaining_quantity = stock_logs.remaining_quantity - NEW.quantity,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update stock when order item is created
CREATE TRIGGER trigger_update_stock_on_order
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_stock_on_order();

-- Function to update daily sales summary
CREATE OR REPLACE FUNCTION update_daily_sales_summary()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO daily_sales_summary (date, total_orders, total_revenue)
    VALUES (CURRENT_DATE, 1, NEW.total_amount)
    ON CONFLICT (date)
    DO UPDATE SET
        total_orders = daily_sales_summary.total_orders + 1,
        total_revenue = daily_sales_summary.total_revenue + NEW.total_amount,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update daily sales summary when order is created
CREATE TRIGGER trigger_update_daily_sales_summary
AFTER INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION update_daily_sales_summary();

-- Enable Row Level Security (RLS)
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_sales_summary ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Enable read access for all users" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON menu_items FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON menu_items FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON orders FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON orders FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON order_items FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON stock_logs FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON stock_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON stock_logs FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON daily_sales_summary FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON daily_sales_summary FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON daily_sales_summary FOR UPDATE USING (true);

-- Insert sample menu items
INSERT INTO menu_items (name, price, daily_stock_quantity, unit) VALUES
('Sambar', 40.00, 20, 'litres'),
('Rasam', 30.00, 15, 'litres'),
('Chicken Kulambu', 120.00, 10, 'litres'),
('Mutton Kulambu', 180.00, 8, 'litres'),
('Fish Kulambu', 150.00, 10, 'litres'),
('Poriyal', 40.00, 5, 'kg'),
('Kootu', 45.00, 5, 'kg'),
('Appalam', 10.00, 100, 'pieces'),
('Curd Rice', 50.00, 10, 'kg'),
('White Rice', 30.00, 20, 'kg'),
('Lemon Rice', 60.00, 5, 'kg'),
('Tamarind Rice', 60.00, 5, 'kg');

-- Initialize stock logs for today
INSERT INTO stock_logs (menu_item_id, date, prepared_quantity, sold_quantity, remaining_quantity)
SELECT 
    id,
    CURRENT_DATE,
    daily_stock_quantity,
    0,
    daily_stock_quantity
FROM menu_items;

-- Initialize daily sales summary for today
INSERT INTO daily_sales_summary (date, total_orders, total_revenue)
VALUES (CURRENT_DATE, 0, 0)
ON CONFLICT (date) DO NOTHING;
