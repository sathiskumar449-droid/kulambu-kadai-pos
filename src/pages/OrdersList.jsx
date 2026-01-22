import { useState, useEffect } from 'react'
import { CheckCircle, Clock, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

// Mock orders data
const MOCK_ORDERS = [
  {
    id: 1,
    orderNumber: 'ORD-20260122001',
    date: '2026-01-22',
    time: '10:30 AM',
    totalAmount: 1240,
    status: 'pending',
    items: [
      { name: 'Sambar', quantity: 2, price: 120, subtotal: 240 },
      { name: 'Rasam', quantity: 1, price: 100, subtotal: 100 },
      { name: 'Curd Rice', quantity: 3, price: 90, subtotal: 270 }
    ]
  },
  {
    id: 2,
    orderNumber: 'ORD-20260122002',
    date: '2026-01-22',
    time: '11:15 AM',
    totalAmount: 520,
    status: 'placed',
    items: [
      { name: 'Ghee Puri', quantity: 8, price: 40, subtotal: 320 },
      { name: 'Chappati', quantity: 4, price: 30, subtotal: 120 }
    ]
  },
  {
    id: 3,
    orderNumber: 'ORD-20260122003',
    date: '2026-01-22',
    time: '12:00 PM',
    totalAmount: 850,
    status: 'pending',
    items: [
      { name: 'Vaghali', quantity: 2, price: 140, subtotal: 280 },
      { name: 'Lemon Rice', quantity: 4, price: 85, subtotal: 340 },
      { name: 'Chappati', quantity: 6, price: 30, subtotal: 180 }
    ]
  }
]

export default function OrdersList() {
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const [filterStatus, setFilterStatus] = useState('all')

  // Update badge count when orders change
  const updateOrders = (newOrders) => {
    setOrders(newOrders)
    const pendingCount = newOrders.filter(o => o.status === 'pending').length
    window.dispatchEvent(new CustomEvent('orderCountChanged', { detail: pendingCount }))
  }

  const markAsPlaced = (orderId) => {
    updateOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: 'placed' } : order
    ))
  }

  const deleteOrder = (orderId) => {
    updateOrders(orders.filter(order => order.id !== orderId))
  }

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(order => order.status === filterStatus)

  const pendingCount = orders.filter(o => o.status === 'pending').length
  const placedCount = orders.filter(o => o.status === 'placed').length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-blue-50">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Total Orders</h4>
          <p className="text-3xl font-bold text-blue-600">{orders.length}</p>
        </div>
        <div className="card bg-yellow-50">
          <h4 className="text-sm font-medium text-yellow-900 mb-2">Pending Orders</h4>
          <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="card bg-green-50">
          <h4 className="text-sm font-medium text-green-900 mb-2">Placed Orders</h4>
          <p className="text-3xl font-bold text-green-600">{placedCount}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="card">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'pending'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('placed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'placed'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Placed ({placedCount})
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <div key={order.id} className="card">
            {/* Order Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{order.orderNumber}</h3>
                <p className="text-sm text-gray-600">
                  {format(new Date(order.date), 'MMM dd, yyyy')} at {order.time}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-600">₹{order.totalAmount.toFixed(2)}</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                  order.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {order.status === 'pending' ? (
                    <>
                      <Clock className="w-4 h-4 mr-1" />
                      Pending
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Placed
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h4>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                    <p className="font-semibold text-gray-900">₹{item.subtotal.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              {order.status === 'pending' && (
                <button
                  onClick={() => markAsPlaced(order.id)}
                  className="flex-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Mark as Placed
                </button>
              )}
              <button
                onClick={() => deleteOrder(order.id)}
                className="flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Delete
              </button>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="card text-center py-12">
            <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No {filterStatus !== 'all' ? filterStatus : ''} orders found</p>
          </div>
        )}
      </div>
    </div>
  )
}
