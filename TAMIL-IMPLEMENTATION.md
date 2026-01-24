# Tamil Menu Names Implementation

## Overview
Menu item names are now bilingual:
- **English names** stored in `name` field (used in database and internal references)
- **Tamil names** stored in `name_ta` field (displayed to customers)

## Database Changes

### Updated Schema
```sql
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  name_ta VARCHAR(255),        -- NEW COLUMN for Tamil names
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  daily_stock_quantity DECIMAL(10, 2) DEFAULT 0,
  unit VARCHAR(50) DEFAULT 'litres',
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## UI Changes

### 1. Menu Management Page (Menu.jsx)
✅ **Form Updates:**
- Added new input field "Tamil Name" for administrators to enter Tamil text
- Field accepts Tamil Unicode characters (no translation)
- Field is required when adding/editing menu items

✅ **Display:**
- Shows both English and Tamil names in the menu list
- English name on first line (e.g., "Sambar")
- Tamil name on second line (e.g., "சாம்பார்")

### 2. Orders Page (Orders.jsx)
✅ **Menu Selection Table:**
- Item names display in Tamil (e.g., "சாம்பார்" instead of "Sambar")
- All UI labels remain in English ("Item Name", "Qty", "Price", etc.)

✅ **Shopping Cart:**
- Cart displays Tamil item names (e.g., "ரசம்")
- Prices and quantities remain in English/numbers

✅ **Search:**
- Search works with both English and Tamil names
- Users can search by "Sambar" or "சாம்பார்"

### 3. Orders List Page (OrdersList.jsx)
✅ **Order Details:**
- Item names in completed orders display in Tamil
- "Order Items" heading stays in English
- Example: Order shows "தயிர் சாதம்" instead of "Curd Rice"

### 4. Bill/Order Storage
✅ **Data Persistence:**
- When bills are saved, Tamil names are stored in the order items
- Orders list pulls Tamil names from saved order data
- No re-translation needed; Tamil names are preserved exactly as entered

## Mock Data Sample

```javascript
const MOCK_MENU_ITEMS = [
  { 
    id: 1, 
    name: 'Sambar',           // English (internal)
    name_ta: 'சாம்பார்',       // Tamil (display)
    category: 'Curries', 
    price: 120, 
    unit: 'Qty', 
    stock_qty: 50, 
    is_enabled: true 
  },
  { 
    id: 2, 
    name: 'Rasam',
    name_ta: 'ரசம்',
    category: 'Curries', 
    price: 100, 
    unit: 'Qty', 
    stock_qty: 40, 
    is_enabled: true 
  }
  // ... more items
]
```

## Included Tamil Menu Items

1. **Sambar** → சாம்பார்
2. **Rasam** → ரசம்
3. **Vaghali** → வாகளி
4. **Curd Rice** → தயிர் சாதம்
5. **Lemon Rice** → எலுமிச்சை சாதம்
6. **Butter Rice** → வெண்ணெய் சாதம்
7. **Ghee Puri** → நெய் பூரி
8. **Chappati** → சப்பாத்தி

## Key Features

✅ **UI Language Unchanged**
- All buttons, labels, headings remain in English
- "Add New Item", "Menu Management", "Order Items", etc. stay English

✅ **Content Language = Tamil**
- Only menu item names display in Tamil
- Search works in both languages
- Admin can type Tamil directly (no conversion needed)

✅ **No Auto-Translation**
- Admin manually enters Tamil text in the form
- Whatever is typed is saved exactly as-is (Unicode preserved)
- Fallback to English name if Tamil name not provided

✅ **Edit & Update**
- Admins can edit Tamil names anytime
- Changes reflect everywhere: Menu, Cart, Orders

## Testing Checklist

- [ ] Add a new menu item with Tamil name
- [ ] Edit an existing menu item's Tamil name
- [ ] Add item to cart and verify Tamil name shows
- [ ] Place an order and verify Tamil names in order details
- [ ] View completed orders and verify Tamil names persist
- [ ] Search for item using English and Tamil names
- [ ] Delete a menu item and verify it's removed from options

## Backward Compatibility

Items without Tamil names (`name_ta` is NULL) will:
- Fall back to displaying English name: `item.name_ta || item.name`
- Work seamlessly with the existing system
- Allow gradual migration of existing menu items

## Future Enhancements

- Multi-language support (Hindi, Kannada, Telugu, etc.)
- Admin settings for language preferences
- Export orders with both English and local language names
- Receipt printing with bilingual text
