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
import { motion } from 'framer-motion'
import { useUserRole } from '../lib/useUserRole'

export default function Layout() {
  const location = useLocation()
  const { role, loading } = useUserRole()

  const [orderCount, setOrderCount] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  /* ---------------- ORDERS BADGE (FIXED) ---------------- */
  useEffect(() => {
    let pollInterval

    const loadPending = async () => {
      try {
        const res = await fetch('/api/supabaseProxy/orders?select=id&status=eq.Pending')
        if (!res.ok) throw new Error('Badge API failed')
        const data = await res.json()
        setOrderCount(Array.isArray(data) ? data.length : 0)
      } catch (e) {
        console.error('Badge fetch error:', e)
        setOrderCount(0)
      }
    }

    loadPending()
    pollInterval = setInterval(loadPending, 5000)
    return () => clearInterval(pollInterval)
  }, [])

  /* ---------------- DARK MODE ---------------- */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin'] },
    { name: 'Menu', path: '/menu', icon: UtensilsCrossed, roles: ['admin', 'staff'] },
    { name: 'Orders', path: '/orders', icon: ShoppingCart, roles: ['admin', 'staff'], badge: orderCount > 0 ? orderCount : null },
    { name: 'Stock', path: '/stock', icon: Package, roles: ['admin', 'staff'] },
    { name: 'Reports', path: '/reports', icon: FileText, roles: ['admin'] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['admin'] }
  ]

  const allowedNav = navItems.filter(item => item.roles.includes(role))

  const handleLogout = () => {
    localStorage.removeItem('user_role')
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!role) return <Navigate to="/login" replace />

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans">

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full shadow-sm z-10">
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            Kulambu Kadai
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {allowedNav.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
                ${isActive
                  ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50'}
              `}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium w-full text-left text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium w-full text-left text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-40 shadow-sm">
        <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
          Kulambu Kadai
        </h1>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-gray-600 dark:text-gray-300">
            {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          {orderCount > 0 && (
            <div className="relative">
              <ShoppingCart size={22} className="text-gray-600 dark:text-gray-300" />
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white dark:border-gray-800">
                {orderCount}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 pt-16 pb-20 md:pt-0 md:pb-0 relative scroll-smooth">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto h-full min-h-full">
          <Outlet />
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-around px-2 z-40 pb-safe">
        {allowedNav.slice(0, 4).map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center w-full h-full gap-1 transition-all
              ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}
            `}
          >
            <div className="relative">
              <item.icon size={22} />
              {item.badge && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white dark:border-gray-800">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{item.name}</span>
          </NavLink>
        ))}
        {/* MOBILE MENU TOGGLE FOR EXTRA LINKS */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center w-full h-full gap-1 text-gray-500 dark:text-gray-400"
        >
          <MenuIcon size={22} />
          <span className="text-[10px] font-medium">Menu</span>
        </button>
      </div>

      {/* MOBILE EXTRA MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            onClick={e => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl p-6 shadow-2xl safe-area-pb"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">More Options</h2>
              <button onClick={() => setMobileMenuOpen(false)} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full text-gray-600 dark:text-gray-300">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {allowedNav.slice(4).map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 font-medium border border-gray-100 dark:border-gray-700"
                >
                  <div className="bg-white dark:bg-gray-800 p-2.5 rounded-xl shadow-sm text-orange-500">
                    <item.icon size={22} />
                  </div>
                  <span className="text-base">{item.name}</span>
                </NavLink>
              ))}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-medium mt-6 border border-red-100 dark:border-red-900"
              >
                <div className="bg-white dark:bg-transparent p-2.5 rounded-xl shadow-sm">
                  <LogOut size={22} />
                </div>
                <span className="text-base">Log Out</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  )
}