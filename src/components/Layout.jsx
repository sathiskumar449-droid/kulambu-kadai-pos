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
  const [isDarkMode, setIsDarkMode] = useState(false)

  /* ---------------- ORDERS BADGE ---------------- */
  useEffect(() => {
    const loadPending = async () => {
      // Query for both 'Pending' and 'PENDING' to handle case variations
      const { count, error, data } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: false })
        .or('status.eq.Pending,status.eq.PENDING')

      console.log('🔵 Badge Query Result:', { count, error, statuses: data?.map(o => o.status) })

      if (error) {
        console.error('❌ Badge Error:', error)
        return
      }
      
      if (typeof count === 'number') {
        console.log('✅ Setting badge to:', count)
        setOrderCount(count)
      }
    }

    // Load initial count
    loadPending()

    // Poll every 3 seconds as backup (in case realtime doesn't work)
    const pollInterval = setInterval(loadPending, 3000)

    // Set up realtime subscription
    const channel = supabase
      .channel('layout-orders-badge-v3')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'orders'
        },
        (payload) => {
          console.log('🔔 NEW ORDER INSERTED:', payload)
          loadPending()
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'orders'
        },
        (payload) => {
          console.log('🔔 ORDER UPDATED:', payload)
          loadPending()
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'DELETE', 
          schema: 'public', 
          table: 'orders'
        },
        (payload) => {
          console.log('🔔 ORDER DELETED:', payload)
          loadPending()
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscription status:', status)
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to orders table')
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Realtime subscription failed - using polling only')
        }
      })

    return () => {
      console.log('🧹 Cleaning up badge subscription and polling')
      clearInterval(pollInterval)
      supabase.removeChannel(channel)
    }
  }, [])

  /* ---------------- DARK MODE ---------------- */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  /* ---------------- NAVIGATION (ORDERED: Dashboard → Menu → Order → Stock → Reports → Settings) */
  const allNavigation = [
    // 1️⃣ DASHBOARD
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, roles: ['admin'], order: 1 },
    // 2️⃣ MENU
    { name: 'Menu', to: '/menu', icon: UtensilsCrossed, roles: ['admin', 'staff'], order: 2 },
    // 3️⃣ ORDERS
    { name: 'Orders', to: '/orders', icon: ShoppingCart, roles: ['admin', 'staff'], badge: orderCount, order: 3 },
    // 4️⃣ STOCK
    { name: 'Stock', to: '/stock', icon: Package, roles: ['admin', 'staff'], order: 4 },
    // 5️⃣ REPORTS
    { name: 'Reports', to: '/reports', icon: FileText, roles: ['admin'], order: 5 },
    // 6️⃣ SETTINGS
    { name: 'Settings', to: '/settings', icon: Settings, roles: ['admin'], order: 6 }
  ]

  console.log('🔢 Current orderCount:', orderCount)

  const navigation = role
    ? allNavigation
        .filter(item => item.roles.includes(role))
        .sort((a, b) => a.order - b.order)
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
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 flex-col md:flex-row">

      {/* MOBILE HEADER - TOP */}
      <div className="fixed top-0 left-0 right-0 z-40 md:hidden bg-white dark:bg-gray-800 shadow">
        <div className="flex justify-between items-center px-4 py-3">
          <h1 className="font-bold text-orange-500">Kulambu Kadai</h1>
          <button onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white dark:bg-gray-800 shadow-2xl border-t border-gray-200 dark:border-gray-700">
        <nav className="flex justify-around items-center">
          {navigation.map(item => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-3 px-2 flex-1 text-xs relative transition-colors nav-button-hover ${
                  isActive
                    ? 'bg-orange-50 dark:bg-gray-700 text-orange-500 border-t-2 border-orange-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-orange-500'
                }`
              }
            >
              <item.icon size={24} className="mb-1" />
              <span className="text-center">{item.name}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center animate-bounce">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

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
                  `flex items-center gap-3 p-3 rounded relative transition-all nav-button-hover ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <item.icon size={18} />
                {item.name}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center animate-bounce">
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
      <div className="flex-1 overflow-auto pt-16 md:pt-0 pb-20 md:pb-0">
        <Outlet />
      </div>

      {/* MOBILE LOGOUT (bottom right corner for mobile) */}
      <div className="fixed bottom-20 right-4 md:hidden">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 p-3 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  )
}
