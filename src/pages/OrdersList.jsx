import { useState, useEffect } from 'react'
import { CheckCircle, Clock, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { convertToTamil } from '../lib/tamilTranslations'

export default function OrdersList() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('ALL')

  const persist = (next) => {
    setOrders(next)
    localStorage.setItem('orders', JSON.stringify(next))
    window.dispatchEvent(
      new CustomEvent('orderCountChanged', {
        detail: next.filter(o => o.status === 'PENDING').length
      })
    )
  }

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('orders') || '[]')
    persist(saved)
  }, [])

  useEffect(() => {
    const handler = e => {
      persist(prev => [...prev, e.detail])
    }
    window.addEventListener('orderAdded', handler)
    return () => window.removeEventListener('orderAdded', handler)
  }, [])

  const filtered =
    filter === 'ALL'
      ? orders
      : orders.filter(o => o.status === filter)

  return (
    <div className="space-y-4">
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
                {format(new Date(o.date), 'dd MMM yyyy')} {o.time}
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
                onClick={() =>
                  persist(orders.map(x =>
                    x.id === o.id ? { ...x, status: 'PLACED' } : x
                  ))
                }
              >
                <CheckCircle /> Mark Placed
              </button>
            )}
            <button
              className="btn-secondary"
              onClick={() => persist(orders.filter(x => x.id !== o.id))}
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
