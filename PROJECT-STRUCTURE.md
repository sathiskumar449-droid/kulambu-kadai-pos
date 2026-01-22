# Project Structure & File Overview

## Complete File Structure

```
New Website/
│
├── src/                          # Source code directory
│   ├── components/               # Reusable React components
│   │   └── Layout.jsx           # Main layout with sidebar/navigation
│   │
│   ├── pages/                   # Page components (routes)
│   │   ├── Dashboard.jsx        # Dashboard with stats & charts
│   │   ├── Orders.jsx           # POS/Order management screen
│   │   ├── Stock.jsx            # Stock management page
│   │   ├── Menu.jsx             # Menu items management
│   │   └── Reports.jsx          # Sales reports with charts
│   │
│   ├── lib/                     # Library/utility files
│   │   └── supabase.js          # Supabase client configuration
│   │
│   ├── App.jsx                  # Main app component with routing
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles & Tailwind directives
│
├── public/                      # Public static assets (if any)
│
├── node_modules/                # Dependencies (auto-generated)
│
├── Configuration Files:
├── package.json                 # Dependencies & scripts
├── package-lock.json            # Locked dependency versions
├── vite.config.js               # Vite bundler configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
├── vercel.json                  # Vercel deployment config
├── .gitignore                   # Git ignore rules
├── .env                         # Environment variables (local)
├── .env.example                 # Environment variables template
│
├── Documentation:
├── index.html                   # HTML entry point
├── README.md                    # Main project documentation
├── SETUP-GUIDE.md              # Step-by-step setup instructions
├── DEPLOYMENT-CHECKLIST.md     # Deployment checklist
├── PROJECT-STRUCTURE.md        # This file
└── supabase-schema.sql         # Database schema & sample data
```

## File Descriptions

### Core Application Files

#### `src/main.jsx`
- Entry point of the React application
- Renders the root App component
- Imports global CSS

#### `src/App.jsx`
- Main application component
- Sets up React Router
- Defines all routes
- Wraps pages in Layout component

#### `src/index.css`
- Global CSS styles
- Tailwind CSS directives
- Custom utility classes
- Reusable component styles

### Components

#### `src/components/Layout.jsx`
**Purpose**: Main layout wrapper for all pages

**Features**:
- Sidebar navigation (desktop)
- Bottom navigation (mobile)
- Responsive design
- Active route highlighting
- Restaurant branding

**Dependencies**:
- react-router-dom (Link, Outlet, useLocation)
- lucide-react (icons)

### Pages

#### `src/pages/Dashboard.jsx`
**Purpose**: Main dashboard with overview statistics

**Features**:
- Today's sales amount
- Total orders count
- Best selling items
- Low stock alerts
- Daily sales chart (last 7 days)
- Best selling items chart
- Realtime updates via Supabase

**Data Sources**:
- daily_sales_summary table
- order_items table
- stock_logs table

**Charts**: Line chart, Bar chart

---

#### `src/pages/Orders.jsx`
**Purpose**: POS screen for taking orders

**Features**:
- Menu items grid by category
- Click to add to cart
- Cart with quantity controls
- Real-time total calculation
- Place order functionality
- Search/filter menu items
- Automatic stock deduction

**Data Flow**:
1. User adds items to cart
2. Clicks "Place Order"
3. Creates order in `orders` table
4. Creates items in `order_items` table
5. Triggers automatically update stock_logs

**Dependencies**:
- Supabase realtime for menu updates

---

#### `src/pages/Stock.jsx`
**Purpose**: Stock management and monitoring

**Features**:
- View all items with stock levels
- Prepared, sold, and remaining quantities
- Date filter for historical data
- Edit prepared quantities inline
- Status indicators (In Stock, Low Stock, Out of Stock)
- Real-time updates when orders placed

**Color Coding**:
- 🟢 Green: In Stock (>30% remaining)
- 🟡 Yellow: Low Stock (10-30% remaining)
- 🔴 Red: Out of Stock (0% remaining)

**Calculations**:
- Remaining = Prepared - Sold
- Updated automatically via database triggers

---

#### `src/pages/Menu.jsx`
**Purpose**: Menu items management (Admin)

**Features**:
- Add new menu items
- Edit existing items
- Delete items with confirmation
- Enable/disable items
- Set prices
- Set daily stock quantities
- Category management
- Changes reflect immediately in POS

**Form Fields**:
- Name (required)
- Category (dropdown)
- Price (number)
- Daily Stock Quantity (number)
- Unit (litres/kg/pieces/plates)
- Is Enabled (checkbox)

---

#### `src/pages/Reports.jsx`
**Purpose**: Sales analytics and reporting

**Features**:
- Daily/Weekly/Monthly reports
- Custom date range
- Total revenue summary
- Average order value
- Item-wise sales breakdown
- Multiple chart types
- Export to CSV
- Revenue distribution pie chart

**Charts**:
- Bar chart: Revenue by item
- Pie chart: Sales distribution
- Multi-bar chart: Daily breakdown

**Filters**:
- Report type (Daily/Weekly/Monthly/Custom)
- Start date
- End date

### Library Files

#### `src/lib/supabase.js`
**Purpose**: Supabase client initialization

**Exports**:
- `supabase` - Configured Supabase client

**Usage**: Import in any component to access database

```javascript
import { supabase } from '../lib/supabase'
```

### Configuration Files

#### `package.json`
**Purpose**: Project metadata and dependencies

**Key Scripts**:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Main Dependencies**:
- React & React DOM
- Supabase JS Client
- React Router DOM
- Recharts
- Lucide React
- date-fns

#### `vite.config.js`
**Purpose**: Vite bundler configuration

**Settings**:
- React plugin enabled
- Development server port: 3000

#### `tailwind.config.js`
**Purpose**: Tailwind CSS configuration

**Customizations**:
- Custom primary color palette (orange theme)
- Content paths for purging unused CSS

#### `vercel.json`
**Purpose**: Vercel deployment configuration

**Settings**:
- SPA routing (all routes to index.html)

#### `.env`
**Purpose**: Environment variables

**Variables**:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

⚠️ **Security**: Never commit this file to version control!

### Database Schema

#### `supabase-schema.sql`
**Purpose**: Complete database setup

**Contents**:
1. Table definitions
2. Indexes for performance
3. Triggers for automation
4. Functions for business logic
5. Row Level Security policies
6. Sample data (12 menu items)

**Key Tables**:
- menu_items
- orders
- order_items
- stock_logs
- daily_sales_summary

**Automated Features**:
- Auto-generate order numbers
- Auto-update stock on order
- Auto-update daily sales summary
- Auto-update timestamps

## Data Flow Diagrams

### Order Placement Flow

```
User Clicks Item → Added to Cart → User Clicks "Place Order"
                                            ↓
                            Create Order (orders table)
                                            ↓
                            Create Order Items (order_items table)
                                            ↓
                            [Trigger Fires] → Update Stock (stock_logs)
                                            ↓
                            [Trigger Fires] → Update Daily Summary
                                            ↓
                            Order Complete → Cart Cleared
```

### Stock Update Flow

```
Order Item Created
        ↓
Trigger: update_stock_on_order()
        ↓
Find stock_logs for today + menu_item
        ↓
Update: sold_quantity += order.quantity
        ↓
Update: remaining_quantity = prepared - sold
        ↓
Stock Updated (Realtime subscribers notified)
```

### Realtime Subscription Flow

```
Component Mounts
        ↓
Subscribe to table changes
        ↓
[Database Change Occurs]
        ↓
Supabase sends notification
        ↓
Component receives update
        ↓
Re-fetch data
        ↓
UI updates automatically
```

## Component Dependencies

### Dashboard
- **External**: recharts, date-fns, lucide-react
- **Tables Used**: daily_sales_summary, order_items, stock_logs, menu_items
- **Realtime**: Yes (orders table)

### Orders (POS)
- **External**: lucide-react
- **Tables Used**: menu_items, orders, order_items
- **Realtime**: Yes (menu_items table)

### Stock
- **External**: lucide-react, date-fns
- **Tables Used**: stock_logs, menu_items
- **Realtime**: Yes (stock_logs, order_items)

### Menu
- **External**: lucide-react, date-fns
- **Tables Used**: menu_items, stock_logs
- **Realtime**: No (manual refresh after changes)

### Reports
- **External**: recharts, date-fns, lucide-react
- **Tables Used**: orders, order_items
- **Realtime**: No (user-triggered fetch)

## State Management

Currently uses **React useState** for local state. No global state management (Redux, Context) needed as:
- Each page is independent
- Data fetched on demand
- Supabase handles data persistence
- Realtime keeps UI in sync

For scaling, consider:
- React Context for shared state
- React Query for data fetching
- Redux for complex state

## API Endpoints (Supabase)

All data operations go through Supabase client:

### SELECT (Read)
```javascript
const { data } = await supabase
  .from('table_name')
  .select('*')
```

### INSERT (Create)
```javascript
const { data } = await supabase
  .from('table_name')
  .insert([{ ... }])
```

### UPDATE (Update)
```javascript
const { data } = await supabase
  .from('table_name')
  .update({ ... })
  .eq('id', itemId)
```

### DELETE (Delete)
```javascript
const { data } = await supabase
  .from('table_name')
  .delete()
  .eq('id', itemId)
```

### RPC (Call Function)
```javascript
const { data } = await supabase
  .rpc('function_name')
```

## Performance Considerations

### Optimizations Implemented:
- ✅ Database indexes on frequently queried columns
- ✅ Limited data fetching (not fetching all history)
- ✅ Lazy loading of charts
- ✅ Realtime subscriptions only where needed
- ✅ Cleanup of subscriptions on unmount

### Future Optimizations:
- Pagination for large datasets
- Virtual scrolling for menu items
- Image optimization (if images added)
- Service worker for offline support
- React.memo for expensive components

## Testing Checklist

### Unit Testing (Not Implemented)
Could add:
- Jest for component testing
- React Testing Library
- Vitest for Vite projects

### Manual Testing Required:
- [ ] All CRUD operations work
- [ ] Realtime updates trigger
- [ ] Mobile responsive design
- [ ] Cart calculations correct
- [ ] Reports generate accurate data
- [ ] CSV export downloads correctly

## Browser Support

Supported browsers:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

Not supported:
- ❌ Internet Explorer
- ❌ Very old browser versions

## Accessibility

Current status: Basic accessibility
- Semantic HTML used
- Keyboard navigation works
- Color contrast adequate

Future improvements:
- Add ARIA labels
- Screen reader testing
- Focus management
- Keyboard shortcuts

---

**Last Updated**: 2026-01-22
