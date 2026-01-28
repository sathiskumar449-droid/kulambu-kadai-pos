import { Outlet, NavLink, useLocation, Navigate } from 'react-router-dom'
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingCart,
  Package,
  Settings,
  FileText,
  Menu as MenuIcon,
  X,
  Moon,
  Sun,
  LogOut
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useUserRole } from '../lib/useUserRole'

export default function Layout() {
  const location = useLocation()
  const { role, loading } = useUserRole()

  const [orderCount, setOrderCount] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  /* ---------------- ORDERS BADGE ---------------- */
  useEffect(() => {
    const loadPending = async () => {
      const { count } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'PENDING')

      if (typeof count === 'number') setOrderCount(count)
    }

    loadPending()

    const channel = supabase
      .channel('layout-orders-badge')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        loadPending
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  /* ---------------- DARK MODE ---------------- */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  /* ---------------- NAVIGATION ---------------- */
  const allNavigation = [
    // 👑 ADMIN ONLY
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, roles: ['admin'] },
    { name: 'Reports', to: '/reports', icon: FileText, roles: ['admin'] },
    { name: 'Settings', to: '/settings', icon: Settings, roles: ['admin'] },

    // 👑 ADMIN + 👷 STAFF
    { name: 'Menu', to: '/menu', icon: UtensilsCrossed, roles: ['admin', 'staff'] },
    { name: 'Orders', to: '/orders', icon: ShoppingCart, roles: ['admin', 'staff'], badge: orderCount },
    { name: 'Stock', to: '/stock', icon: Package, roles: ['admin', 'staff'] }
  ]


  const navigation = role
    ? allNavigation.filter(item => item.roles.includes(role))
    : allNavigation

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    localStorage.removeItem("user_role")
    window.location.href = "/login"
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!role) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">

      {/* MOBILE HEADER */}
      <div className="fixed top-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-gray-800 shadow">
        <div className="flex justify-between items-center px-4 py-3">
          <h1 className="font-bold text-orange-500">Kulambu Kadai</h1>
          <div className="flex gap-2">
            <button onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun /> : <Moon />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed z-50 top-0 left-0 w-64 h-full bg-white dark:bg-gray-800"
            >
              <nav className="p-4 space-y-2 flex flex-col h-full">
                <div className="flex-1 space-y-2">
                  {navigation.map(item => (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded ${
                          isActive
                            ? 'bg-orange-500 text-white'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`
                      }
                    >
                      <item.icon size={18} />
                      {item.name}
                    </NavLink>
                  ))}
                </div>
                {/* LOGOUT BUTTON */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-3 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex md:flex-col w-64 bg-white dark:bg-gray-800 shadow">
        <div className="p-4 font-bold text-white bg-orange-500">
          Kulambu Kadai
        </div>
        <nav className="p-4 space-y-2 flex flex-col flex-1">
          <div className="flex-1 space-y-2">
            {navigation.map(item => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded ${
                    isActive
                      ? 'bg-orange-500 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <item.icon size={18} />
                {item.name}
                {item.badge > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 rounded">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded bg-red-500 text-white hover:bg-red-600 mt-auto"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-auto pt-16 md:pt-0">
        <Outlet />
      </div>
    </div>
  )
}
