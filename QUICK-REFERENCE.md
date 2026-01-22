# Quick Reference Card 📋

## Essential Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables (.env)

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## URLs

- **Development**: http://localhost:3000
- **Supabase Dashboard**: https://app.supabase.com
- **Vercel Dashboard**: https://vercel.com/dashboard

## Project Structure

```
src/
├── components/Layout.jsx       # Main layout
├── pages/
│   ├── Dashboard.jsx          # Analytics
│   ├── Orders.jsx             # POS
│   ├── Stock.jsx              # Inventory
│   ├── Menu.jsx               # Settings
│   └── Reports.jsx            # Reports
├── lib/supabase.js            # DB client
└── App.jsx                    # Router
```

## Database Tables

1. **menu_items** - Menu with prices
2. **orders** - Order records
3. **order_items** - Order line items
4. **stock_logs** - Daily inventory
5. **daily_sales_summary** - Sales data

## Key Features by Page

### Dashboard
- Today's sales & orders
- Best sellers chart
- Low stock alerts
- 7-day trends

### Orders (POS)
- Menu grid by category
- Shopping cart
- Place order button
- Auto stock deduction

### Stock
- Prepared/Sold/Remaining
- Status indicators
- Date filter
- Edit quantities

### Menu
- Add/Edit/Delete items
- Set prices
- Enable/Disable
- Stock quantities

### Reports
- Daily/Weekly/Monthly
- Item-wise sales
- CSV export
- Multiple charts

## Common Operations

### Add Menu Item
1. Go to Menu page
2. Click "Add New Item"
3. Fill form
4. Click "Add Item"

### Place Order
1. Go to Orders page
2. Click menu items
3. Adjust quantities
4. Click "Place Order"

### Check Stock
1. Go to Stock page
2. Select date
3. View all items
4. Edit if needed

### Generate Report
1. Go to Reports page
2. Select date range
3. View charts & tables
4. Export CSV

## Color Codes

- 🟢 **Green**: Success, In Stock
- 🟡 **Yellow**: Warning, Low Stock
- 🔴 **Red**: Error, Out of Stock
- 🔵 **Blue**: Info
- 🟠 **Orange**: Primary action

## File Paths

- **Config**: `/.env`
- **Schema**: `/supabase-schema.sql`
- **Main App**: `/src/App.jsx`
- **Styles**: `/src/index.css`
- **Deployment**: `/vercel.json`

## Troubleshooting Quick Fixes

### Issue: Blank Page
```bash
# Check .env file exists and has values
# Check browser console (F12)
# Restart dev server
```

### Issue: Database Errors
```bash
# Verify schema executed in Supabase
# Check RLS policies created
# Ensure project not paused
```

### Issue: Build Fails
```bash
# Delete node_modules
npm install
npm run build
```

## Default Categories

- Gravy
- Non-Veg
- Side Dish
- Rice
- Beverages
- Others

## Default Units

- litres
- kg
- pieces
- plates

## Deployment Quick Steps

### Vercel
1. Push to GitHub
2. Import in Vercel
3. Add env vars
4. Deploy

**Time**: 10 minutes

## Sample Menu Items

1. Sambar - ₹40
2. Rasam - ₹30
3. Chicken Kulambu - ₹120
4. Mutton Kulambu - ₹180
5. Fish Kulambu - ₹150
6. Poriyal - ₹40
7. Kootu - ₹45
8. Appalam - ₹10
9. Curd Rice - ₹50
10. White Rice - ₹30
11. Lemon Rice - ₹60
12. Tamarind Rice - ₹60

## Important Notes

⚠️ Never commit `.env` file
⚠️ Backup database regularly
⚠️ Test on mobile before launch
✅ Uses free tier of Vercel & Supabase
✅ Supports realtime updates
✅ Mobile responsive

## Support Resources

- 📖 README.md - Overview
- 🔧 SETUP-GUIDE.md - Setup
- ✅ DEPLOYMENT-CHECKLIST.md - Deploy
- 📁 PROJECT-STRUCTURE.md - Technical
- 🎉 PROJECT-COMPLETE.md - Summary

## Quick Test Sequence

1. `npm install` → Install
2. Setup Supabase → DB
3. Add .env → Config
4. `npm run dev` → Test
5. Place order → Verify
6. Check stock → Confirm
7. View reports → Review
8. `npm run build` → Production
9. Deploy Vercel → Live!

---

**Keep this file handy for quick reference!**

Print or bookmark for easy access during development.
