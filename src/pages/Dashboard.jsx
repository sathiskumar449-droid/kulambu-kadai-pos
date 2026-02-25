import { useState, useEffect } from 'react'
import { TrendingUp, ShoppingBag, AlertTriangle, DollarSign } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { convertToTamil } from '../lib/tamilTranslations'
export default function Dashboard() {
  const [stats, setStats] = useState({
    todaySales: 0,
    todayOrders: 0,
    todayStockUpdates: 0,
    todayStockValue: 0,
    bestSelling: [],
    lowStock: []
  })
  const [dailySalesData, setDailySalesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboard()
    // ❌ Realtime disabled for Jio compatibility
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError(null)

      const todayStr = new Date().toISOString().slice(0, 10)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 6)
      const weekAgoStr = weekAgo.toISOString().slice(0, 10)

      // Today summary
      const todayRes = await fetch(
        `/api/supabaseProxy/daily_sales_summary?select=date,total_revenue,total_orders&date=eq.${todayStr}`
      )
      const todayArr = await todayRes.json()
      const todaySummary = todayArr?.[0] || null

      // Week summary
      const weekRes = await fetch(
        `/api/supabaseProxy/daily_sales_summary?select=date,total_revenue,total_orders&date=gte.${weekAgoStr}&date=lte.${todayStr}&order=date.asc`
      )
      const weekSummary = await weekRes.json()

      // Items sold today
      const itemsRes = await fetch(
        `/api/supabaseProxy/order_items?select=item_name,quantity,price,subtotal,created_at&created_at=gte.${todayStr}T00:00:00.000Z&created_at=lte.${todayStr}T23:59:59.999Z`
      )
      const itemsToday = await itemsRes.json()

      // Stock logs today
      const stockRes = await fetch(
        `/api/supabaseProxy/stock_logs?select=menu_item_id,remaining_quantity,prepared_quantity,menu_items(name,unit,daily_stock_quantity,price)&date=eq.${todayStr}`
      )
      const stockRows = await stockRes.json()

      // Menu items
      const menuRes = await fetch(
        `/api/supabaseProxy/menu_items?select=id,name,daily_stock_quantity,price`
      )
      const menuItems = await menuRes.json()

      const bestSellingMap = {}
      ;(itemsToday || []).forEach(row => {
        const qty = Number(row.quantity || 0)
        const key = row.item_name || 'Unknown'
        bestSellingMap[key] = (bestSellingMap[key] || 0) + qty
      })

      const bestSelling = Object.entries(bestSellingMap)
        .map(([name, quantity]) => ({ name: convertToTamil(name), quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)

      const lowStock = (stockRows || [])
        .map(row => ({
          name: convertToTamil(row.menu_items?.name || 'Unknown'),
          remaining: row.remaining_quantity ?? 0,
          total: row.prepared_quantity ?? row.menu_items?.daily_stock_quantity ?? 0
        }))
        .filter(item => item.remaining < 10)

      const todaySales = todaySummary?.total_revenue || 0
      const todayOrders = todaySummary?.total_orders || 0

      const stockMap = (stockRows || []).reduce((acc, row) => {
        acc[row.menu_item_id] = row
        return acc
      }, {})

      const todayStockUpdates = (stockRows || []).length
      const todayStockValue = (menuItems || []).reduce((sum, item) => {
        const log = stockMap[item.id]
        const prepared = log?.prepared_quantity ?? item.daily_stock_quantity ?? 0
        const price = item.price ?? log?.menu_items?.price ?? 0
        return sum + Number(prepared) * Number(price)
      }, 0)

      const dailyData = (weekSummary || []).map(row => ({
        date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: row.total_revenue || 0,
        orders: row.total_orders || 0
      }))

      setStats({
        todaySales,
        todayOrders,
        todayStockUpdates,
        todayStockValue,
        bestSelling: bestSelling.length ? bestSelling : [{ name: 'No sales today', quantity: 0 }],
        lowStock
      })

      setDailySalesData(dailyData)
    } catch (err) {
      console.error('Dashboard load failed:', err)
      setError('Unable to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="card bg-red-50 text-red-700 p-3">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
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

        <div className="card bg-gradient-to-br from-teal-500 to-teal-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm font-medium">Today's Stock Updates</p>
              <p className="text-3xl font-bold mt-2">{stats.todayStockUpdates}</p>
            </div>
            <ShoppingBag className="w-12 h-12 text-teal-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Today's Stock Value</p>
              <p className="text-3xl font-bold mt-2">₹{stats.todayStockValue.toFixed(2)}</p>
            </div>
            <DollarSign className="w-12 h-12 text-emerald-200" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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