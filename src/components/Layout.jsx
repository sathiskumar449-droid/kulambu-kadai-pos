import { Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, UtensilsCrossed, ShoppingCart, Package, Settings, FileText, Menu as MenuIcon, X, Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

export default function Layout() {
  const location = useLocation()
  const [orderCount, setOrderCount] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const loadPending = async () => {
      const { count, error } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'PENDING')

      if (!error && typeof count === 'number') {
        setOrderCount(count)
      }
    }

    loadPending()

    const channel = supabase.channel('layout-orders-badge')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, loadPending)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Menu', href: '/orders', icon: UtensilsCrossed },
    { name: 'Orders', href: '/orders-list', icon: ShoppingCart, badge: orderCount },
    { name: 'Stock', href: '/stock', icon: Package },
    { name: 'Settings', href: '/menu', icon: Settings },
    { name: 'Reports', href: '/reports', icon: FileText },
  ]

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    // Exact match for specific paths to avoid conflicts
    if (path === '/orders' || path === '/orders-list') {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-primary-500 dark:text-primary-400">Kulambu Kadai App</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-xl z-50 md:hidden"
            >
              <div className="flex items-center justify-center h-16 bg-primary-500 dark:bg-primary-600">
                <h1 className="text-xl font-bold text-white">Kulambu Kadai</h1>
              </div>
              <nav className="px-4 py-6 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 min-h-[44px] relative ${
                        isActive(item.href)
                          ? 'bg-primary-500 text-white shadow-lg scale-105'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{item.name}</span>
                      {item.badge && item.badge > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                        >
                          {item.badge}
                        </motion.span>
                      )}
                    </Link>
                  )
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 lg:w-72 bg-white dark:bg-gray-800 shadow-lg transition-colors duration-300">
        <div className="flex items-center justify-between px-6 h-20 bg-primary-500 dark:bg-primary-600 transition-colors duration-300">
          <h1 className="text-2xl font-bold text-white">Kulambu Kadai</h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg hover:bg-primary-600 dark:hover:bg-primary-700 transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-300" /> : <Moon className="w-5 h-5 text-white" />}
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <motion.div
                key={item.name}
                whileHover={{ scale: active ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 min-h-[44px] relative ${
                    active
                      ? 'bg-primary-500 dark:bg-primary-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.name}</span>
                  {item.badge && item.badge > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary-500 dark:bg-primary-600 rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            )
          })}
        </nav>
      </div>

      {/* Mobile Bottom Navigation */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden shadow-2xl transition-colors duration-300"
      >
        <nav className="flex justify-around py-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <motion.div
                key={item.name}
                whileTap={{ scale: 0.9 }}
                className="flex-1"
              >
                <Link
                  to={item.href}
                  className={`flex flex-col items-center px-2 py-2 rounded-lg transition-all duration-200 relative min-h-[56px] justify-center ${
                    active
                      ? 'text-primary-500 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <motion.div
                    animate={{
                      scale: active ? 1.1 : 1,
                      y: active ? -2 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                  {item.badge && item.badge > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                  <span className={`text-xs mt-1 font-medium ${
                    active ? 'font-semibold' : ''
                  }`}>{item.name}</span>
                  {active && (
                    <motion.div
                      layoutId="mobileActiveTab"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary-500 dark:bg-primary-400 rounded-t-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            )
          })}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="hidden md:block bg-white dark:bg-gray-800 shadow-sm z-10 transition-colors duration-300">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <motion.h2
              key={location.pathname}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
            </motion.h2>
          </div>
        </header>
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pt-20 md:pt-4 pb-20 md:pb-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  )
}
