# Role-Based Access Control - Quick Reference

## What Was Implemented ✅

### 1. User Role Hook
- File: `src/lib/useUserRole.js`
- Returns: `{ role, loading }`
- Fetches role from Supabase `user_roles` table

### 2. Layout Component
- File: `src/components/Layout.jsx`
- Shows/hides menu items based on user role
- Admin sees: Dashboard, Menu, Orders, Stock, Settings, Reports
- Staff sees: Menu, Orders, Stock, Settings
- Displays loading spinner while fetching role

### 3. Route Protection
- File: `src/App.jsx`
- `ProtectedRoute` component protects all routes
- Admin-only: `/` (Dashboard), `/reports` (Reports)
- Admin & Staff: `/orders`, `/orders-list`, `/stock`, `/menu`
- Unauthorized access redirects to `/orders-list`

---

## How It Works

```
1. User logs in
   ↓
2. useUserRole hook fetches role from Supabase
   ↓
3. Layout renders menu items based on role
   ↓
4. Route protection checks role and allows/denies access
   ↓
5. Unauthorized users redirected to /orders-list
```

---

## Testing Commands

### Test Admin Access
1. Login as admin user
2. Verify all 6 menu items visible
3. All routes accessible
4. No redirects

### Test Staff Access
1. Login as staff user
2. Verify only 4 menu items visible (Dashboard & Reports hidden)
3. Try accessing `/` → redirects to `/orders-list`
4. Try accessing `/reports` → redirects to `/orders-list`
5. Can access `/orders`, `/orders-list`, `/stock`, `/menu`

---

## File Changes Summary

| File | Changes |
|------|---------|
| `src/components/Layout.jsx` | Added role-based navigation filtering + loading state |
| `src/App.jsx` | Added ProtectedRoute wrapper + role-based redirects |
| `src/lib/useUserRole.js` | ✅ Already implemented (no changes) |

---

## Security Notes

✅ Roles fetched from database (not hardcoded)
✅ Double-layer protection (UI + Route level)
✅ No flicker during role loading
✅ Proper redirect for unauthorized access
✅ Compatible with existing authentication

---

## ENV Variables Required

Ensure `.env.local` has:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## Database Table Structure

```
public.user_roles
├── id (BIGSERIAL PRIMARY KEY)
├── user_id (UUID UNIQUE, REFERENCES auth.users(id))
├── role (TEXT: 'admin' | 'staff')
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

Insert test data:
```sql
-- Admin user
INSERT INTO user_roles (user_id, role) 
VALUES ('admin-uuid-here', 'admin');

-- Staff user
INSERT INTO user_roles (user_id, role) 
VALUES ('staff-uuid-here', 'staff');
```

---

## Troubleshooting

### Issue: Menu shows all items
- Check Supabase has user in `user_roles` table
- Verify user is logged in

### Issue: Staff can't access any pages
- Check role value in database (should be exactly 'staff')
- Verify route protection in App.jsx

### Issue: Infinite redirect loop
- Check that `/orders-list` is properly protected (should have `['admin', 'staff']`)
- Ensure redirecting staff to a page they can access

---

## Future Enhancements

- Add role-based data permissions
- Implement role change without logout
- Add audit logging for role changes
- Create admin panel for role management
- Add multi-tenant support if needed
