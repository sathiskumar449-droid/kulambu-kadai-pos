# Kulambu Kadai - Restaurant POS System

A modern, full-featured Point of Sale (POS) web application built specifically for South Indian "Kulambu Kadai" restaurants.

## 🚀 Features

### 1. Dashboard
- Real-time today's sales and orders count
- Best selling items with interactive charts
- Low stock alerts
- Daily, weekly, and monthly sales trends
- Auto-updating data with Supabase realtime

### 2. Orders / POS Screen
- Grid view of all menu items by category
- Click-to-add cart functionality
- Quantity management (+/-)
- Real-time total calculation
- One-click order placement
- Automatic stock deduction

### 3. Stock Management (NO Tables)
- View prepared stock, sold quantity, and remaining stock
- Live updates when orders are placed
- Out of stock indicators
- Edit prepared quantities
- Filter by date

### 4. Menu Management
- Add/Edit/Delete menu items
- Set prices and daily stock quantities
- Enable/Disable items
- Category management
- Changes reflect instantly in POS

### 5. Reports
- Daily, weekly, and monthly sales reports
- Item-wise sales analysis with charts
- Revenue breakdown
- Export to CSV
- Custom date range filtering

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router v6
- **Hosting**: Vercel Ready

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Step 1: Clone or Download
```bash
cd "c:\Users\sathi\OneDrive\Desktop\Billing site\New Website"
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Supabase

1. Create a new project at [https://supabase.com](https://supabase.com)
2. Go to SQL Editor and run the `supabase-schema.sql` file
3. Get your project URL and anon key from Settings > API

### Step 4: Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 5: Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

The application uses the following tables:

1. **menu_items** - Store menu items with prices and stock info
2. **orders** - Store order information
3. **order_items** - Store individual items in each order
4. **stock_logs** - Track daily stock preparation, sales, and remaining
5. **daily_sales_summary** - Aggregate daily sales data

### Key Features:
- Automatic stock deduction on order placement
- Automatic daily sales summary updates
- Row Level Security (RLS) enabled
- Realtime subscriptions for live updates

## 📱 Responsive Design

- Mobile-first approach
- Bottom navigation for mobile devices
- Sidebar navigation for desktop
- Optimized for tablets and large screens

## 🚀 Deployment to Vercel

### Option 1: Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2: Vercel Dashboard

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

## 📋 Default Sample Data

The database schema includes sample menu items:

- **Gravies**: Sambar, Rasam
- **Non-Veg**: Chicken Kulambu, Mutton Kulambu, Fish Kulambu
- **Side Dishes**: Poriyal, Kootu, Appalam
- **Rice**: Curd Rice, White Rice, Lemon Rice, Tamarind Rice

## 🔐 Security Notes

The current setup uses public policies for all tables for simplicity. For production:

1. Enable Supabase Authentication
2. Update RLS policies to restrict access
3. Add user roles (admin, staff)
4. Secure sensitive operations

## 📚 Project Structure

```
├── src/
│   ├── components/
│   │   └── Layout.jsx          # Main layout with navigation
│   ├── pages/
│   │   ├── Dashboard.jsx       # Dashboard with charts
│   │   ├── Orders.jsx          # POS screen
│   │   ├── Stock.jsx           # Stock management
│   │   ├── Menu.jsx            # Menu management
│   │   └── Reports.jsx         # Sales reports
│   ├── lib/
│   │   └── supabase.js         # Supabase client
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── supabase-schema.sql         # Database schema
├── package.json
├── vite.config.js
├── tailwind.config.js
└── vercel.json                 # Vercel configuration
```

## 🎨 Color Scheme

Primary colors are warm orange tones suitable for a restaurant:
- Primary: `#f58700` (Orange)
- Accents: Blue, Green, Red for different states

## 🔧 Customization

### Adding New Menu Categories

Edit the category options in [src/pages/Menu.jsx](src/pages/Menu.jsx):

```javascript
<option value="Your Category">Your Category</option>
```

### Changing Color Theme

Edit [tailwind.config.js](tailwind.config.js):

```javascript
colors: {
  primary: {
    500: '#your-color',
    // ... other shades
  }
}
```

## 🐛 Troubleshooting

### Realtime Updates Not Working
- Check Supabase project is not paused
- Verify realtime is enabled in Supabase settings
- Check browser console for errors

### Orders Not Placing
- Verify all database triggers are created
- Check RLS policies
- Ensure stock logs exist for today's date

### Charts Not Displaying
- Ensure date-fns and recharts are installed
- Check if data is being fetched correctly
- Verify data format matches chart requirements

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Support

For issues or questions, please check:
- Supabase documentation: [https://supabase.com/docs](https://supabase.com/docs)
- React documentation: [https://react.dev](https://react.dev)
- Vite documentation: [https://vitejs.dev](https://vitejs.dev)

## 🎯 Future Enhancements

- Print receipts
- Customer management
- Multi-language support (Tamil)
- WhatsApp order notifications
- Inventory management
- Staff attendance tracking

---

**Built with ❤️ for Kulambu Kadai**
