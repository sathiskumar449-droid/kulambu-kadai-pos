import { useState, useEffect } from 'react'
import { Package, TrendingDown, AlertCircle } from 'lucide-react'


export default function Stock() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStock()
  }, [])

  const fetchStock = async () => {
    try {
      setLoading(true)
      setError(null)

      const today = new Date().toISOString().slice(0, 10)

      const { data: items, error: itemsError } = await supabase
        .from('menu_items')
        .select('id, name, price, unit, daily_stock_quantity')
        .order('created_at')

      if (itemsError) throw itemsError

      const { data: stockLogs, error: logsError } = await supabase
        .from('stock_logs')
        .select('menu_item_id, prepared_quantity, remaining_quantity')
        .eq('date', today)

      if (logsError) throw logsError

      const logsMap = (stockLogs || []).reduce((acc, log) => {
        acc[log.menu_item_id] = log
        return acc
      }, {})

      const merged = (items || []).map(item => {
        const log = logsMap[item.id]
        const prepared = log?.prepared_quantity ?? item.daily_stock_quantity ?? 0
        const remaining = log?.remaining_quantity ?? item.daily_stock_quantity ?? 0
        return {
          ...item,
          prepared_quantity: prepared,
          remaining_quantity: remaining
        }
      })

      setMenuItems(merged)
    } catch (err) {
      console.error('Failed to load stock:', err)
      setError('Unable to load stock data. Please retry.')
    } finally {
      setLoading(false)
    }
  }

  const getStockStatus = (remaining, prepared) => {
    const base = prepared || 1
    const percentage = (remaining / base) * 100

    if (remaining <= 0) {
      return { status: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: AlertCircle }
    } else if (percentage < 30) {
      return { status: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', icon: TrendingDown }
    } else {
      return { status: 'In Stock', color: 'bg-green-100 text-green-800', icon: Package }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading stock data...</div>
      </div>
    )
  }

  const totalPrepared = menuItems.reduce(
    (sum, item) => sum + Number(item.prepared_quantity ?? item.daily_stock_quantity ?? 0),
    0
  )
  const totalRemaining = menuItems.reduce(
    (sum, item) => sum + Number(item.remaining_quantity ?? 0),
    0
  )

  return (
    <div className="space-y-6">
      {error && (
        <div className="card bg-red-50 text-red-700 p-3">{error}</div>
      )}

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="card bg-blue-50">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Total Items</h4>
          <p className="text-3xl font-bold text-blue-600">{menuItems.length}</p>
        </div>
        <div className="card bg-green-50">
          <h4 className="text-sm font-medium text-green-900 mb-2">In Stock</h4>
          <p className="text-3xl font-bold text-green-600">
            {menuItems.filter(item => (item.remaining_quantity ?? 0) > 0).length}
          </p>
        </div>
        <div className="card bg-emerald-50">
          <h4 className="text-sm font-medium text-emerald-900 mb-2">Total Prepared</h4>
          <p className="text-3xl font-bold text-emerald-600">{totalPrepared}</p>
        </div>
        <div className="card bg-teal-50">
          <h4 className="text-sm font-medium text-teal-900 mb-2">Total Remaining</h4>
          <p className="text-3xl font-bold text-teal-600">{totalRemaining}</p>
        </div>
        <div className="card bg-red-50">
          <h4 className="text-sm font-medium text-red-900 mb-2">Out of Stock</h4>
          <p className="text-3xl font-bold text-red-600">
            {menuItems.filter(item => (item.remaining_quantity ?? 0) <= 0).length}
          </p>
        </div>
      </div>

      {/* Stock Table */}
      <div className="card overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Qty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {menuItems.map((item) => {
              const remaining = item.remaining_quantity ?? 0
              const prepared = item.prepared_quantity ?? item.daily_stock_quantity ?? item.remaining_quantity ?? 0
              const stockStatus = getStockStatus(remaining, prepared)
              const StatusIcon = stockStatus.icon

              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{convertToTamil(item.name)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ₹{item.price ?? 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-900">{prepared}</span>
                      <span className="text-sm text-gray-500">{item.unit || 'Qty'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                      <StatusIcon className="w-4 h-4 mr-1" />
                      {stockStatus.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {menuItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No items available
          </div>
        )}
      </div>
    </div>
  )
}
