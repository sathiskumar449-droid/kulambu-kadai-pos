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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!role) return <Navigate to="/login" replace />

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 flex-col md:flex-row">
      <div className="flex-1 overflow-auto pt-16 md:pt-0 pb-20 md:pb-0 bg-gray-50 dark:bg-gray-900">
        <Outlet />
      </div>
    </div>
  )
}