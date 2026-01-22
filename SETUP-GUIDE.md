# Quick Setup Guide

## Step-by-Step Setup Instructions

### 1. Install Dependencies (5 minutes)

Open PowerShell or Command Prompt in the project folder and run:

```bash
npm install
```

This will install all required packages:
- React & React DOM
- Vite
- Tailwind CSS
- Supabase Client
- Recharts (for charts)
- React Router
- Lucide React (icons)
- date-fns (date utilities)

### 2. Setup Supabase Database (10 minutes)

#### A. Create Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project
4. Wait for project to be ready (2-3 minutes)

#### B. Run Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire content of `supabase-schema.sql` file
4. Paste it in the SQL Editor
5. Click **Run** button
6. You should see "Success. No rows returned" message

This creates:
- 5 tables (menu_items, orders, order_items, stock_logs, daily_sales_summary)
- Automatic triggers for stock and sales updates
- Sample menu data (12 items)
- Row Level Security policies

#### C. Get API Credentials
1. Go to **Settings** > **API**
2. Copy your **Project URL** (looks like: https://xxxxx.supabase.co)
3. Copy your **anon public** key (long string starting with eyJ...)

### 3. Configure Environment Variables (2 minutes)

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Open `.env` file and replace with your actual values:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 4. Run the Application (1 minute)

```bash
npm run dev
```

Open your browser and go to: [http://localhost:3000](http://localhost:3000)

You should see the dashboard with sample data!

### 5. Test the Application

#### Test Orders/POS
1. Click on **Orders** in the sidebar
2. Click on any menu item (e.g., "Sambar")
3. It will be added to the cart
4. Adjust quantity using +/- buttons
5. Click **Place Order**
6. Order will be placed and stock will be automatically deducted

#### Test Stock Management
1. Click on **Stock** in the sidebar
2. You'll see all items with:
   - Prepared quantity
   - Sold quantity (from your order)
   - Remaining quantity
3. Try changing the prepared quantity for any item

#### Test Menu Management
1. Click on **Menu** in the sidebar
2. Click **Add New Item**
3. Fill in the form:
   - Name: "Payasam"
   - Category: "Beverages"
   - Price: 50
   - Daily Stock: 10
   - Unit: litres
4. Click **Add Item**
5. New item will appear in the list
6. Go to Orders page - you'll see the new item!

#### Test Reports
1. Click on **Reports** in the sidebar
2. Select report type (Daily/Weekly/Monthly)
3. View charts and item-wise sales
4. Click **Export CSV** to download data

#### Test Dashboard
1. Click on **Dashboard**
2. You'll see:
   - Today's total sales
   - Number of orders
   - Best selling items
   - Charts with sales data

### 6. Deploy to Vercel (10 minutes)

#### A. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo-url
git push -u origin main
```

#### B. Deploy on Vercel
1. Go to [https://vercel.com](https://vercel.com)
2. Click **Import Project**
3. Connect your GitHub repository
4. Configure project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variables:
   - `VITE_SUPABASE_URL`: your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: your Supabase anon key
6. Click **Deploy**
7. Wait 2-3 minutes
8. Your site is live! 🎉

## Troubleshooting

### Issue: "npm install" fails
**Solution**: 
- Make sure you have Node.js v16+ installed
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again

### Issue: Blank page after npm run dev
**Solution**:
- Check if `.env` file exists and has correct values
- Check browser console for errors
- Make sure Supabase project is not paused

### Issue: Orders not being saved
**Solution**:
- Verify database schema was executed successfully
- Check Supabase logs in dashboard
- Ensure RLS policies are created

### Issue: Charts not showing
**Solution**:
- Place at least one order first
- Check if date range includes today
- Verify recharts is installed

### Issue: Realtime updates not working
**Solution**:
- Enable Realtime in Supabase settings
- Check if subscription is active in browser console
- Verify network connection

## Default Login Credentials

This POS system currently doesn't require login for simplicity. To add authentication:

1. Enable Supabase Auth in your project
2. Add login/signup pages
3. Update RLS policies to check auth.uid()
4. Protect routes with authentication check

## Customization Tips

### Change Restaurant Name
Edit [src/components/Layout.jsx](src/components/Layout.jsx):
```javascript
<h1 className="text-2xl font-bold text-white">Your Restaurant Name</h1>
```

### Change Primary Color
Edit [tailwind.config.js](tailwind.config.js) and update primary color values.

### Add More Sample Menu Items
Edit [supabase-schema.sql](supabase-schema.sql) and add more INSERT statements, then re-run in Supabase SQL Editor.

### Modify Units
Edit [src/pages/Menu.jsx](src/pages/Menu.jsx) and add/remove unit options in the dropdown.

## Important Notes

⚠️ **Security**: Current setup allows public access. For production, implement proper authentication and authorization.

⚠️ **Backup**: Regularly backup your Supabase database from the dashboard.

⚠️ **Testing**: Test thoroughly on mobile devices before going live.

✅ **Performance**: The app uses Supabase realtime which works great for single restaurant. For multiple locations, consider optimization.

## Next Steps

1. Add your actual menu items
2. Set realistic stock quantities
3. Test on mobile devices
4. Train staff on how to use
5. Go live!

## Support Resources

- React: https://react.dev
- Supabase: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Vite: https://vitejs.dev

Good luck with your restaurant! 🍛
