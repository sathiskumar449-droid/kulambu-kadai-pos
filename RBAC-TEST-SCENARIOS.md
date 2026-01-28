# Role-Based Access Control - Test Scenarios

## Test Scenario 1: Admin User Login & Navigation

### Setup
- User with role `'admin'` in `user_roles` table

### Expected Behavior
✅ **UI Layer (Layout)**
- All 6 menu items visible:
  1. Dashboard
  2. Menu
  3. Orders
  4. Stock
  5. Settings
  6. Reports

✅ **Route Layer (App)**
- All routes accessible:
  - `/` (Dashboard) ✓
  - `/orders` (Menu) ✓
  - `/orders-list` (Orders) ✓
  - `/stock` (Stock) ✓
  - `/menu` (Settings) ✓
  - `/reports` (Reports) ✓

✅ **Loading State**
- Loading spinner appears briefly while role is fetched
- Then layout fully renders

✅ **Navigation**
- All menu items are clickable
- No redirects
- Smooth page transitions

---

## Test Scenario 2: Staff User Login & Navigation

### Setup
- User with role `'staff'` in `user_roles` table

### Expected Behavior
✅ **UI Layer (Layout)**
- Only 4 menu items visible:
  1. Menu
  2. Orders
  3. Stock
  4. Settings

❌ **Hidden Menu Items**
- Dashboard (hidden)
- Reports (hidden)

✅ **Route Layer (App)**
- Accessible routes:
  - `/orders` (Menu) ✓
  - `/orders-list` (Orders) ✓
  - `/stock` (Stock) ✓
  - `/menu` (Settings) ✓

❌ **Protected Routes** (redirect to `/orders-list`)
- `/` (Dashboard) → **REDIRECT to /orders-list**
- `/reports` (Reports) → **REDIRECT to /orders-list**

✅ **Direct URL Access Testing**
1. Type `/` in URL bar → redirects to `/orders-list`
2. Type `/reports` in URL bar → redirects to `/orders-list`
3. Type `/orders-list` in URL bar → loads page normally
4. Type `/stock` in URL bar → loads page normally

✅ **Loading State**
- Loading spinner appears briefly
- Then layout with filtered menu renders

---

## Test Scenario 3: Role-Based Navigation Consistency

### Test Case: Staff user clicks on menu items
1. Click "Menu" → loads `/orders` ✓
2. Click "Orders" → loads `/orders-list` ✓
3. Click "Stock" → loads `/stock` ✓
4. Click "Settings" → loads `/menu` ✓

### Test Case: Admin user clicks on menu items
1. Click "Dashboard" → loads `/` ✓
2. Click "Menu" → loads `/orders` ✓
3. Click "Orders" → loads `/orders-list` ✓
4. Click "Stock" → loads `/stock` ✓
5. Click "Settings" → loads `/menu` ✓
6. Click "Reports" → loads `/reports` ✓

---

## Test Scenario 4: Mobile Navigation

### Admin User (Mobile)
- Bottom navigation shows all items
- Clicking each item navigates correctly
- Badge on Orders shows pending count
- No visual inconsistencies

### Staff User (Mobile)
- Bottom navigation shows only: Menu, Orders, Stock, Settings
- Dashboard and Reports not visible
- Clicking each item navigates correctly
- Badge on Orders shows pending count

---

## Test Scenario 5: Loading State

### Test Case: Check loading spinner
1. Open browser DevTools Network throttling
2. Set to "Slow 3G"
3. Login or refresh page
4. Observe loading spinner appears
5. Wait for role fetch to complete
6. Menu appears with correct items
7. No UI flickering

---

## Test Scenario 6: Session Persistence

### Test Case: Refresh page
1. Admin user logs in
2. Navigate to `/orders`
3. Refresh page (F5)
4. Expect: Role is reloaded, menu shows all items
5. `/orders` page still loads correctly

### Test Case: Staff user refresh
1. Staff user logs in
2. Navigate to `/orders-list`
3. Refresh page (F5)
4. Expect: Role is reloaded, menu shows only 4 items
5. `/orders-list` page still loads correctly

---

## Test Scenario 7: Logout & Re-login

### Admin → Logout → Staff Login
1. Admin user logged in, sees all menu items
2. Click logout
3. Staff user logs in
4. Menu should update to show only 4 items
5. Expect: No redirect loop, clean transition

### Staff → Logout → Admin Login
1. Staff user logged in, sees 4 menu items
2. Click logout
3. Admin user logs in
4. Menu should update to show all 6 items
5. Navigate to `/reports` should work
6. Dashboard should be accessible

---

## Test Scenario 8: Database Edge Cases

### Case 1: User not in user_roles table
- User logs in but has no entry in `user_roles`
- Expected: `role` is `null`
- Menu items filtered (no items match `null` role)
- User redirected to `/orders-list`

### Case 2: Wrong role value in database
- User has `role: 'manager'` (invalid)
- Expected: `role` is `'manager'`
- Menu items filtered (no items match)
- User redirected to `/orders-list`

### Case 3: Null role
- User has `role: null`
- Expected: Navigation filtered (role = null)
- No menu items visible
- User redirected to `/orders-list`

---

## Test Scenario 9: Cross-Browser Testing

Test on:
- Chrome/Chromium
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

Verify:
- Loading spinner renders correctly
- Menu filtering works
- Route protection works
- No console errors
- Smooth transitions

---

## Test Scenario 10: Accessibility

### Keyboard Navigation
- Tab through menu items
- Staff should only tab through 4 items
- Admin should tab through all 6 items

### Screen Reader
- Menu items announced correctly
- Loading state announced
- Redirects announce page change

---

## Automated Test Template

```javascript
// Example Jest/Vitest test
describe('RBAC Implementation', () => {
  
  test('Admin sees all menu items', async () => {
    render(<App />)
    // Mock useUserRole to return { role: 'admin', loading: false }
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Reports')).toBeInTheDocument()
  })

  test('Staff sees only allowed menu items', async () => {
    render(<App />)
    // Mock useUserRole to return { role: 'staff', loading: false }
    expect(screen.getByText('Menu')).toBeInTheDocument()
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
    expect(screen.queryByText('Reports')).not.toBeInTheDocument()
  })

  test('Staff accessing / redirects to /orders-list', async () => {
    render(<App />)
    // Mock useUserRole to return { role: 'staff', loading: false }
    // Navigate to /
    expect(window.location.pathname).toBe('/orders-list')
  })

  test('Loading state shows spinner', async () => {
    render(<App />)
    // Mock useUserRole to return { role: null, loading: true }
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })
})
```

---

## Checklist for Manual Testing

### Pre-Test Setup
- [ ] Supabase `user_roles` table populated with test users
- [ ] Admin user has `role: 'admin'`
- [ ] Staff user has `role: 'staff'`
- [ ] Both users authenticated in Supabase
- [ ] App running locally or deployed

### Admin User Tests
- [ ] All 6 menu items visible
- [ ] All routes accessible
- [ ] No redirects on protected routes
- [ ] Loading spinner appears on first load
- [ ] Mobile navigation shows all items
- [ ] Refresh page maintains access

### Staff User Tests
- [ ] Only 4 menu items visible
- [ ] Dashboard and Reports hidden
- [ ] `/` redirects to `/orders-list`
- [ ] `/reports` redirects to `/orders-list`
- [ ] Can access `/orders`, `/orders-list`, `/stock`, `/menu`
- [ ] Loading spinner appears on first load
- [ ] Mobile navigation shows 4 items only
- [ ] Refresh page maintains access

### Cross-User Tests
- [ ] Admin → Logout → Staff Login → works
- [ ] Staff → Logout → Admin Login → works
- [ ] No UI flickering during transitions
- [ ] No console errors

### Edge Cases
- [ ] Browser back button works correctly
- [ ] Browser forward button works correctly
- [ ] Direct URL navigation works
- [ ] Clicking same menu item twice doesn't cause issues

---

## Performance Notes

- Role fetched once on mount
- Navigation filtered in real-time based on role
- No unnecessary re-renders
- Loading state prevents UI flicker
- Redirects use React Router's `Navigate` (performant)

---

## Sign-Off

When all tests pass:
- [ ] Role-Based Access Control is production-ready
- [ ] Admin users can access all features
- [ ] Staff users see only allowed features
- [ ] Route protection prevents unauthorized access
- [ ] No console errors or warnings
- [ ] Loading states work correctly
- [ ] Mobile and desktop both functional
