import { useState, useEffect } from 'react'
import { Package, TrendingDown, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

// Mock menu items with stock info (shared with Menu.jsx)
const MOCK_MENU_ITEMS = [
  { id: 1, name: 'Sambar', category: 'Curries', price: 120, unit: 'Qty', stock_qty: 50, is_enabled: true },
  { id: 2, name: 'Rasam', category: 'Curries', price: 100, unit: 'Qty', stock_qty: 40, is_enabled: true },
  { id: 3, name: 'Vaghali', category: 'Curries', price: 140, unit: 'Qty', stock_qty: 30, is_enabled: true },
  { id: 4, name: 'Curd Rice', category: 'Rice Dishes', price: 90, unit: 'Qty', stock_qty: 60, is_enabled: true },
  { id: 5, name: 'Lemon Rice', category: 'Rice Dishes', price: 85, unit: 'Qty', stock_qty: 55, is_enabled: true },
  { id: 6, name: 'Butter Rice', category: 'Rice Dishes', price: 95, unit: 'Qty', stock_qty: 45, is_enabled: true },
  { id: 7, name: 'Ghee Puri', category: 'Breads', price: 40, unit: 'Qty', stock_qty: 100, is_enabled: true },
  { id: 8, name: 'Chappati', category: 'Breads', price: 30, unit: 'Qty', stock_qty: 150, is_enabled: true }
]

export default function Stock() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)

  const normalizeUnits = (items) => items.map(item => ({
    ...item,
    unit: item.unit === 'qty' ? 'Qty' : item.unit
  }))

  useEffect(() => {
    setTimeout(() => {
      const saved = localStorage.getItem('menuItems')
      if (saved) {
        const parsed = JSON.parse(saved)
        const normalized = normalizeUnits(parsed)
        setMenuItems(normalized)
        localStorage.setItem('menuItems', JSON.stringify(normalized))
      } else {
        setMenuItems(MOCK_MENU_ITEMS)
        localStorage.setItem('menuItems', JSON.stringify(MOCK_MENU_ITEMS))
      }
      setLoading(false)
    }, 200)
  }, [])

  const getStockStatus = (remaining, prepared) => {
    const percentage = (remaining / prepared) * 100
    
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

  return (
    <div className="space-y-6">
      {/* Stock Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-blue-50">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Total Items</h4>
          <p className="text-3xl font-bold text-blue-600">{menuItems.length}</p>
        </div>
        <div className="card bg-green-50">
          <h4 className="text-sm font-medium text-green-900 mb-2">In Stock</h4>
          <p className="text-3xl font-bold text-green-600">
            {menuItems.filter(item => item.stock_qty > 0).length}
          </p>
        </div>
        <div className="card bg-red-50">
          <h4 className="text-sm font-medium text-red-900 mb-2">Out of Stock</h4>
          <p className="text-3xl font-bold text-red-600">
            {menuItems.filter(item => item.stock_qty <= 0).length}
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
                Category
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
              const stockStatus = item.stock_qty <= 0 
                ? { status: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: AlertCircle }
                : item.stock_qty < 20
                ? { status: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', icon: TrendingDown }
                : { status: 'In Stock', color: 'bg-green-100 text-green-800', icon: Package }
              const StatusIcon = stockStatus.icon

              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ₹{item.price}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-900">{item.stock_qty}</span>
                      <span className="text-sm text-gray-500">{item.unit}</span>
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
