import { useState, useEffect } from 'react'
import { TrendingUp, ShoppingBag, AlertTriangle, DollarSign } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'

export default function Dashboard() {
  const [stats, setStats] = useState({
    todaySales: 0,
    todayOrders: 0,
    bestSelling: [],
    lowStock: []
  })
  const [dailySalesData, setDailySalesData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load data from localStorage
    const loadDashboardData = () => {
      try {
        // Get menu items
        const menuItemsJson = localStorage.getItem('menuItems')
        const menuItems = menuItemsJson ? JSON.parse(menuItemsJson) : []
        
        // Get orders
        const ordersJson = localStorage.getItem('orders')
        const orders = ordersJson ? JSON.parse(ordersJson) : []
        
        // Calculate today's date
        const today = new Date().toISOString().split('T')[0]
        
        // Filter today's orders
        const todayOrders = orders.filter(order => {
          const orderDate = order.date ? order.date.split('T')[0] : today
          return orderDate === today
        })
        
        // Calculate today's sales and order count
        const todaySales = todayOrders.reduce((sum, order) => sum + (order.total || 0), 0)
        const todayOrderCount = todayOrders.length
        
        // Calculate best selling items (from today's orders)
        const itemSalesMap = {}
        todayOrders.forEach(order => {
          if (order.items) {
            order.items.forEach(item => {
              itemSalesMap[item.name] = (itemSalesMap[item.name] || 0) + item.quantity
            })
          }
        })
        
        const bestSellingItems = Object.entries(itemSalesMap)
          .map(([name, quantity]) => ({ name, quantity }))
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5)
        
        // Get low stock items from menu
        const lowStockItems = menuItems
          .filter(item => item.stock_qty && item.stock_qty < 10)
          .map(item => ({
            name: item.name,
            remaining: item.stock_qty,
            total: 20 // Assuming default max stock
          }))
        
        // Generate daily sales data for last 7 days
        const dailyData = []
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dateStr = date.toISOString().split('T')[0]
          const dateDisplay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          
          const dayOrders = orders.filter(order => {
            const orderDate = order.date ? order.date.split('T')[0] : null
            return orderDate === dateStr
          })
          
          const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.total || 0), 0)
          
          dailyData.push({
            date: dateDisplay,
            revenue: dayRevenue,
            orders: dayOrders.length
          })
        }
        
        setStats({
          todaySales: todaySales,
          todayOrders: todayOrderCount,
          bestSelling: bestSellingItems.length > 0 ? bestSellingItems : [{ name: 'No sales today', quantity: 0 }],
          lowStock: lowStockItems
        })
        
        setDailySalesData(dailyData)
        setLoading(false)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        setLoading(false)
      }
    }
    
    loadDashboardData()
    
    // Set up listener for data changes
    const handleStorageChange = () => {
      loadDashboardData()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for custom events
    window.addEventListener('orderAdded', handleStorageChange)
    window.addEventListener('orderCountChanged', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('orderAdded', handleStorageChange)
      window.removeEventListener('orderCountChanged', handleStorageChange)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium">Today's Sales</p>
              <p className="text-3xl font-bold mt-2">₹{stats.todaySales.toFixed(2)}</p>
            </div>
            <DollarSign className="w-12 h-12 text-primary-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Today's Orders</p>
              <p className="text-3xl font-bold mt-2">{stats.todayOrders}</p>
            </div>
            <ShoppingBag className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Best Selling</p>
              <p className="text-xl font-bold mt-2">{stats.bestSelling[0]?.name || 'N/A'}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Low Stock Alert</p>
              <p className="text-3xl font-bold mt-2">{stats.lowStock.length}</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-red-200" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sales Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Last 7 Days Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailySalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#f58700" name="Revenue (₹)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Best Selling Items Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Best Selling Items (Today)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.bestSelling}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#f58700" name="Quantity Sold" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {stats.lowStock.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
            Low Stock Alert
          </h3>
          <div className="space-y-3">
            {stats.lowStock.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Remaining: {item.remaining.toFixed(2)} / {item.total.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-red-600 font-semibold">
                    {((item.remaining / item.total) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
