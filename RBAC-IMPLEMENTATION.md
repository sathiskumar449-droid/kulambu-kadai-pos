# Role-Based Access Control (RBAC) Implementation

## Overview
Implemented complete role-based access control (Admin/Staff) using Supabase Auth and the `user_roles` table.

## Database Schema
- **Table**: `public.user_roles`
- **Columns**:
  - `user_id` (uuid) - Foreign key to auth.users
  - `role` (enum) - 'admin' | 'staff'

## Implementation Details

### 1. User Role Hook (`src/lib/useUserRole.js`)
✅ Already implemented correctly

**Features**:
- Uses `supabase.auth.getUser()` to get authenticated user
- Fetches role from `user_roles` table
- Returns `{ role, loading }` object
- Handles loading state to prevent UI flicker

**Usage**:
```javascript
import { useUserRole } from '../lib/useUserRole'

const { role, loading } = useUserRole()
```

---

### 2. Layout Component Updates (`src/components/Layout.jsx`)
✅ **Updated** with role-based navigation filtering

**Changes Made**:
1. Imported `useUserRole` hook
2. Created `allNavigation` array with `requiredRole` property for each menu item:
   - **Admin only**: Dashboard, Reports
   - **Admin & Staff**: Menu, Orders, Stock, Settings
3. Filtered navigation array based on user's role
4. Added loading state display with animated spinner
5. Only shows menu items the user has permission to access

**Admin Sees**:
- Dashboard ✓
- Menu ✓
- Orders ✓
- Stock ✓
- Settings ✓
- Reports ✓

**Staff Sees**:
- Menu ✓
- Orders ✓
- Stock ✓
- Settings ✓

---

### 3. Route Protection (`src/App.jsx`)
✅ **Updated** with `ProtectedRoute` wrapper component

**Changes Made**:
1. Imported `useUserRole` hook
2. Created `ProtectedRoute` component that:
   - Checks user's role against required role(s)
   - Allows arrays of roles (e.g., `['admin', 'staff']`)
   - Redirects unauthorized users to `/orders-list`
   - Handles loading state by returning `null`
3. Wrapped all route elements with `ProtectedRoute`

**Protected Routes**:
```
/                (Dashboard)     → admin only
/orders          (Menu)          → admin, staff
/orders-list     (Orders)        → admin, staff
/stock           (Stock)         → admin, staff
/menu            (Settings)      → admin, staff
/reports         (Reports)       → admin only
```

**Redirect Behavior**:
- Staff accessing `/` or `/reports` → redirects to `/orders-list`
- All unauthorized access → redirects to `/orders-list`

---

## Security Features

✅ **No Hardcoded Roles**
- All roles fetched from Supabase database
- No roles stored in local state/cookies

✅ **Dynamic Role Checks**
- Role checked on component mount
- Updated if user logs in/out
- Persisted across page navigation

✅ **No UI Flicker**
- Loading state shown while fetching role
- Routes don't render until role is loaded
- Smooth transition to authenticated state

✅ **Double-Layer Protection**
1. **Layout/UI Layer**: Menu items hidden based on role
2. **Route Layer**: Direct URL access blocked with redirects

---

## User Experience

### Admin Login
1. Sees all 6 menu items: Dashboard, Menu, Orders, Stock, Settings, Reports
2. Can access all routes
3. No redirects

### Staff Login
1. Sees only 4 menu items: Menu, Orders, Stock, Settings
2. Dashboard and Reports links are hidden
3. Can access allowed routes
4. Direct URL access to `/` or `/reports` redirects to `/orders-list`

### Loading State
- Animated spinner displayed while role is being fetched
- Prevents route flicker or UI inconsistencies
- Clear visual feedback to user

---

## Testing Checklist

- [ ] Admin login sees all pages
- [ ] Staff login sees only Menu, Orders, Stock, Settings
- [ ] Dashboard link hidden for staff
- [ ] Reports link hidden for staff
- [ ] Direct URL `/` redirects staff to `/orders-list`
- [ ] Direct URL `/reports` redirects staff to `/orders-list`
- [ ] Loading spinner appears before role loads
- [ ] No console errors
- [ ] Both mobile and desktop navigation filtered correctly

---

## Database Setup Required

Ensure the `user_roles` table exists in Supabase:

```sql
CREATE TABLE public.user_roles (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'staff')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
```

---

## Files Modified

1. **`src/components/Layout.jsx`**
   - Added `useUserRole` import
   - Added role state from hook
   - Created role-based navigation filter
   - Added loading state display

2. **`src/App.jsx`**
   - Added `useUserRole` import
   - Created `ProtectedRoute` component
   - Wrapped all routes with protection
   - Added role-based redirects

3. **`src/lib/useUserRole.js`** (Already implemented)
   - No changes needed

---

## Code Quality

✅ Follows existing code style
✅ No hardcoded values
✅ Uses proper React hooks
✅ Supports role arrays for flexibility
✅ Handles loading states
✅ Maintains existing functionality
✅ No breaking changes to existing pages
✅ TypeScript-friendly structure (ready for migration if needed)

---

## Next Steps

1. Test with admin and staff accounts
2. Monitor loading states in network-limited scenarios
3. Consider adding role-based action buttons (e.g., Delete, Edit)
4. Add role-based API request headers if needed
5. Implement session refresh on role changes
