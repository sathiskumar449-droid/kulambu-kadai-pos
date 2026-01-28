-- Add payment_method column to existing orders table
-- Run this SQL in your Supabase SQL Editor if the table already exists

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'cash';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON orders(payment_method);

-- Verify the column was added
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'orders';
