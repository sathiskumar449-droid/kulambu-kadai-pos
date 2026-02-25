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
import { useUserRole } from '../lib/useUserRole'          // ✅ FIX              // ✅ FIX 2

export default function Layout() {
  const location = useLocation()
  const { role, loading } = useUserRole()                  // ✅ FIX 3

  const [orderCount, setOrderCount] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  /* ---------------- ORDERS BADGE ---------------- */
  useEffect(() => {
  let pollInterval

  const loadPending = async () => {
    try {
      const res = await fetch('/api/supabaseProxy/pendingOrdersCount')
      if (!res.ok) return
      const data = await res.json()
      if (typeof data.count === 'number') {
        setOrderCount(data.count)
      }
    } catch (e) {
      console.error('Badge fetch error:', e)
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

  /* ---------------- NAVIGATION ---------------- */
  const allNavigation = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, roles: ['admin'], order: 1 },
    { name: 'Menu', to: '/menu', icon: UtensilsCrossed, roles: ['admin', 'staff'], order: 2 },
    { name: 'Orders', to: '/orders', icon: ShoppingCart, roles: ['admin', 'staff'], badge: orderCount, order: 3 },
    { name: 'Stock', to: '/stock', icon: Package, roles: ['admin', 'staff'], order: 4 },
    { name: 'Reports', to: '/reports', icon: FileText, roles: ['admin'], order: 5 },
    { name: 'Settings', to: '/settings', icon: Settings, roles: ['admin'], order: 6 },
    { name: 'Logout', to: '#', icon: LogOut, roles: ['admin', 'staff'], order: 7, isLogout: true }
  ]

  const navigation = role
    ? allNavigation.filter(item => item.roles.includes(role)).sort((a, b) => a.order - b.order)
    : allNavigation

  /* ---------------- LOGOUT ---------------- */
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

  if (!role) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 flex-col md:flex-row">
      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-auto pt-16 md:pt-0 pb-20 md:pb-0 bg-gray-50 dark:bg-gray-900">
        <Outlet />
      </div>
    </div>
  )
}