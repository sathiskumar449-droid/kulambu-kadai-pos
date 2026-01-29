import { useState, useEffect } from 'react'
import { CheckCircle, Clock, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { convertToTamil } from '../lib/tamilTranslations'
import { supabase } from '../lib/supabase'
import { triggerOrderNotification, requestNotificationPermission } from '../utils/notifications'
import Toast from '../components/Toast'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    // 🔔 Request notification permission on mount
    requestNotificationPermission()
    
    fetchOrders()

    const channel = supabase.channel('orders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, fetchOrders)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      // Try to fetch with payment_method, fallback if column doesn't exist
      let { data, error: fetchError } = await supabase
        .from('orders')
        .select('id, order_number, status, total_amount, payment_method, created_at, order_items (item_name, quantity, price, subtotal)')
        .order('created_at', { ascending: false })

      // If payment_method column doesn't exist, fetch without it
      if (fetchError && fetchError.message.includes('payment_method')) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('orders')
          .select('id, order_number, status, total_amount, created_at, order_items (item_name, quantity, price, subtotal)')
          .order('created_at', { ascending: false })
        
        if (fallbackError) throw fallbackError
        data = fallbackData
      } else if (fetchError) {
        throw fetchError
      }

      const normalized = (data || []).map(o => ({
        id: o.id,
        orderNumber: o.order_number,
        status: (o.status || 'PENDING').toUpperCase(),
        totalAmount: o.total_amount || 0,
        paymentMethod: o.payment_method || 'cash',
        createdAt: o.created_at,
        items: (o.order_items || []).map(item => ({
          name: item.item_name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal || (item.price || 0) * (item.quantity || 0)
        }))
      }))

      setOrders(normalized)
    } catch (err) {
      console.error('Failed to fetch orders:', err)
      setError('Unable to load orders right now.')
    } finally {
      setLoading(false)
    }
  }

  const filtered =
    filter === 'ALL'
      ? orders
      : filter === 'PENDING'
        ? orders.filter(o => o.status === 'PENDING')
        : orders.filter(o => o.status === 'PLACED')

  return (
    <div className="space-y-4">
      {/* Success Toast */}
      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
      
      {loading && <div className="text-gray-500">Loading orders…</div>}
      {error && (
        <div className="card bg-red-50 text-red-700 p-3">{error}</div>
      )}

      <div className="flex gap-2">
        {['ALL', 'PENDING', 'PLACED'].map(s => (
          <button 
            key={s} 
            onClick={() => setFilter(s)} 
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 active:shadow-inner ${
              filter === s 
                ? s === 'ALL' 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : s === 'PENDING' 
                    ? 'bg-yellow-500 text-white shadow-lg' 
                    : 'bg-green-500 text-white shadow-lg'
                : s === 'ALL'
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : s === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.map(o => (
        <div key={o.id} className="card">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold">{o.orderNumber}</h3>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  o.status === 'PENDING' 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {o.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {o.createdAt ? format(new Date(o.createdAt), 'dd MMM yyyy, p') : ''}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {o.paymentMethod === 'cash' ? '💵 Cash' : '🏦 Online'}
              </p>
            </div>
            <div className="text-right">
              <span className="font-bold text-lg">₹{o.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-2">
            {o.items.map((it, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{convertToTamil(it.name)} × {it.quantity}</span>
                <span>₹{it.subtotal}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-3">
            {o.status === 'PENDING' && (
              <button
                className="btn-primary"
                onClick={async () => {
                  // Optimistically update local state
                  setOrders(prevOrders =>
                    prevOrders.map(order =>
                      order.id === o.id
                        ? { ...order, status: 'PLACED' }
                        : order
                    )
                  )

                  const { error: updateError } = await supabase
                    .from('orders')
                    .update({ status: 'PLACED' })
                    .eq('id', o.id)

                  if (updateError) {
                    console.error('Failed to update status:', updateError)
                    setError('Could not update order status.')
                    // Revert optimistic update on error
                    fetchOrders()
                  } else {
                    // 🔔 Trigger notification sound and badge
                    triggerOrderNotification(o.orderNumber)
                    // Show success toast
                    setToastMessage('Order Marked as Placed!')
                    setShowToast(true)
                    setTimeout(() => setShowToast(false), 3000)
                  }
                }}
              >
                <CheckCircle /> Mark Placed
              </button>
            )}
            <button
              className="btn-secondary"
              onClick={async () => {
                // Optimistically update local state
                setOrders(prevOrders => prevOrders.filter(order => order.id !== o.id))

                const { error: deleteError } = await supabase
                  .from('orders')
                  .delete()
                  .eq('id', o.id)
                if (deleteError) {
                  console.error('Delete failed:', deleteError)
                  setError('Could not delete order.')
                  // Revert optimistic update on error
                  fetchOrders()
                }
              }}
            >
              <Trash2 /> Delete
            </button>
          </div>
        </div>
      ))}

      {filtered.length === 0 && <p>No orders</p>}
    </div>
  )
}
