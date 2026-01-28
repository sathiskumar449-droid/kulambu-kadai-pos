import { useState, useEffect } from 'react'
import { CheckCircle, Clock, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { convertToTamil } from '../lib/tamilTranslations'
import { supabase } from '../lib/supabase'
import { triggerOrderNotification, requestNotificationPermission } from '../utils/notifications'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('id, order_number, status, total_amount, created_at, order_items (item_name, quantity, price, subtotal)')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      const normalized = (data || []).map(o => ({
        id: o.id,
        orderNumber: o.order_number,
        status: (o.status || 'PENDING').toUpperCase(),
        totalAmount: o.total_amount || 0,
        createdAt: o.created_at,
        items: (o.order_items || []).map(item => ({
          name: item.item_name,
          quantity: item.quantity,
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
      : orders.filter(o => o.status === filter)

  return (
    <div className="space-y-4">
      {loading && <div className="text-gray-500">Loading orders…</div>}
      {error && (
        <div className="card bg-red-50 text-red-700 p-3">{error}</div>
      )}

      <div className="flex gap-2">
        {['ALL', 'PENDING', 'PLACED'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className="btn-secondary">
            {s}
          </button>
        ))}
      </div>

      {filtered.map(o => (
        <div key={o.id} className="card">
          <div className="flex justify-between">
            <div>
              <h3 className="font-bold">{o.orderNumber}</h3>
              <p className="text-sm">
                {o.createdAt ? format(new Date(o.createdAt), 'dd MMM yyyy, p') : ''}
              </p>
            </div>
            <span className="font-bold">₹{o.totalAmount}</span>
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
                  const { error: updateError } = await supabase
                    .from('orders')
                    .update({ status: 'PLACED' })
                    .eq('id', o.id)

                  if (updateError) {
                    console.error('Failed to update status:', updateError)
                    setError('Could not update order status.')
                  } else {
                    // 🔔 Trigger notification sound and badge
                    triggerOrderNotification(o.orderNumber)
                  }
                }}
              >
                <CheckCircle /> Mark Placed
              </button>
            )}
            <button
              className="btn-secondary"
              onClick={async () => {
                const { error: deleteError } = await supabase
                  .from('orders')
                  .delete()
                  .eq('id', o.id)
                if (deleteError) {
                  console.error('Delete failed:', deleteError)
                  setError('Could not delete order.')
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
