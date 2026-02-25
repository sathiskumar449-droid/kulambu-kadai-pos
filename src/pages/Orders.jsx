import { useState, useEffect } from 'react'
import { CheckCircle, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import Toast from '../components/Toast'
import { useUserRole } from '../lib/useUserRole'
import { triggerOrderNotification, requestNotificationPermission } from '../utils/notifications'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const { role } = useUserRole()

  useEffect(() => {
    requestNotificationPermission()
    fetchOrders()
  }, [])

  async function fetchOrders() {
    try {
      setLoading(true)
      const res = await fetch('/api/supabaseProxy/orders')
      if (!res.ok) throw new Error('Failed to load orders')
      const data = await res.json()
      setOrders(data || [])
    } catch (e) {
      console.error(e)
      setError('Orders load panna mudila')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-4">Loading orders...</div>
  if (error) return <div className="p-4 text-red-600">{error}</div>

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-xl font-bold">Orders</h1>
      {orders.map(o => (
        <div key={o.id} className="bg-white p-3 rounded shadow flex justify-between">
          <div>
            <p className="font-bold">{o.order_number}</p>
            <p className="text-sm text-gray-600">
              ₹{o.total_amount} • {format(new Date(o.created_at), 'dd MMM hh:mm a')}
            </p>
          </div>
        </div>
      ))}
      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
    </div>
  )
}