# 🔧 Add Payment Method Column - Setup Instructions

## ⚠️ Required Database Update

The application now tracks payment methods (Cash/Online) for each order. You need to add the missing column to your Supabase database.

## 📋 How to Add the Column

### Option 1: Using the Migration File (Recommended)

1. Open **Supabase Dashboard** → Your Project → SQL Editor
2. Create a new query
3. Copy and paste the contents of `ADD_PAYMENT_METHOD_COLUMN.sql`:

```sql
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'cash';

CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON orders(payment_method);
```

4. Click **Run** (or press Ctrl+Enter)
5. Wait for success message ✅

### Option 2: Manual SQL

Go to Supabase SQL Editor and run:

```sql
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'cash';
```

## ✅ Verification

After adding the column, you can verify it was created:

```sql
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'orders'
ORDER BY ordinal_position;
```

You should see a new row with:
- Column: `payment_method`
- Type: `character varying(50)`

## 🚀 After Column is Added

1. Refresh your browser (Ctrl+Shift+R for hard refresh)
2. The app will now:
   - ✅ Track payment method for new orders (Cash/Online)
   - ✅ Display payment method in Orders page
   - ✅ Include payment info in reports
   - ✅ Export sold items with payment details

## 💡 Fallback Support

If for any reason the column still doesn't exist:
- The app will gracefully fall back to working without the column
- All existing functionality continues to work
- Payment method will default to 'cash' in the database

## 📊 What's Captured Now

When an order is saved:
- ✅ Item name (Tamil) 
- ✅ Quantity
- ✅ Unit price
- ✅ Total amount
- ✅ **Payment method (Cash/Online)** ← NEW!
- ✅ Order timestamp
- ✅ Shift information (based on time)

## 📥 Reporting Features

With payment tracking enabled:
- **Sold Items Report** includes payment method
- **Shift reports** show payment breakdown
- **CSV exports** include cash vs online split

---

**Status**: Column added to schema. Requires manual database update.
**Time to Complete**: 2-3 minutes
