import { useState, useEffect } from 'react'
import { CheckCircle, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { convertToTamil } from '../lib/tamilTranslations'

export default function OrdersList() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrders()
    const t = setInterval(fetchOrders, 15000) // polling instead of realtime (Jio-safe)
    return () => clearInterval(t)
  }, [])

  async function fetchOrders() {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch('/api/supabaseProxy/orders')
      if (!res.ok) throw new Error('Orders proxy failed')
      const data = await res.json()

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

  async function markPlaced(id) {
    try {
      const res = await fetch('/api/supabaseProxy/updateOrderStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'PLACED' })
      })
      if (!res.ok) throw new Error('Status update failed')
      fetchOrders()
    } catch (e) {
      console.error(e)
      setError('Could not update order status.')
    }
  }

  async function deleteOrder(id) {
    try {
      const res = await fetch('/api/supabaseProxy/deleteOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (!res.ok) throw new Error('Delete failed')
      fetchOrders()
    } catch (e) {
      console.error(e)
      setError('Could not delete order.')
    }
  }

  const filtered =
    filter === 'ALL' ? orders : orders.filter(o => o.status === filter)

  if (loading) return <div className="text-gray-500">Loading orders…</div>
  if (error) return <div className="card bg-red-50 text-red-700 p-3">{error}</div>

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['ALL', 'PENDING', 'PLACED'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`btn-secondary ${filter === s ? 'ring-2 ring-orange-400' : ''}`}
          >
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
              <button className="btn-primary" onClick={() => markPlaced(o.id)}>
                <CheckCircle size={16} /> Mark Placed
              </button>
            )}
            <button className="btn-secondary" onClick={() => deleteOrder(o.id)}>
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      ))}

      {filtered.length === 0 && <p>No orders</p>}
    </div>
  )
}