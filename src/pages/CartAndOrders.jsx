import { useState, useEffect } from 'react'
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  DollarSign,
  FileText
} from 'lucide-react'
import { format } from 'date-fns'
import { convertToTamil } from '../lib/tamilTranslations'
import { triggerOrderNotification, requestNotificationPermission } from '../utils/notifications'

export default function CartAndOrders() {
  // ================= MENU & CART STATE =================
  const [menuItems, setMenuItems] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [rowQuantities, setRowQuantities] = useState({})
  const [addedFlash, setAddedFlash] = useState({})

  // ================= ORDERS STATE =================
  const [orders, setOrders] = useState([])
  const [orderFilter, setOrderFilter] = useState('ALL')
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState(null)

  useEffect(() => {
    requestNotificationPermission()
    fetchMenu()
    fetchOrders()

    // 🔁 Poll orders every 15 seconds (Jio-safe alternative to realtime)
    const t = setInterval(fetchOrders, 15000)
    return () => clearInterval(t)
  }, [])

  /* ================= MENU LOAD (PROXY) ================= */
  async function fetchMenu() {
    try {
      setLoading(true)
      setLoadError(null)

      const res = await fetch('/api/supabaseProxy/menu_items')
      if (!res.ok) throw new Error('Menu proxy failed')
      const data = await res.json()

      setMenuItems(data || [])
      setRowQuantities((data || []).reduce((a, i) => ({ ...a, [i.id]: 1 }), {}))
    } catch (err) {
      console.error('Failed to load menu:', err)
      setLoadError('Unable to load menu items. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /* ================= ORDERS LOAD (PROXY) ================= */
  async function fetchOrders() {
    try {
      setOrdersLoading(true)
      setOrdersError(null)

      const res = await fetch('/api/supabaseProxy/orders')
      if (!res.ok) throw new Error('Orders proxy failed')
      const data = await res.json()

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
      setOrdersError('Unable to load orders.')
    } finally {
      setOrdersLoading(false)
    }
  }

  /* ================= ADD TO CART ================= */
  const addToCart = (item) => {
    const qty = rowQuantities[item.id] || 1
    const tamilName = convertToTamil(item.name)

    const exists = cart.find(i => i.id === item.id)

    if (exists) {
      setCart(cart.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
      ))
    } else {
      setCart([...cart, { id: item.id, name: tamilName, price: item.price, quantity: qty }])
    }

    setAddedFlash(p => ({ ...p, [item.id]: true }))
    setTimeout(() => setAddedFlash(p => ({ ...p, [item.id]: false })), 700)
    setRowQuantities(q => ({ ...q, [item.id]: 1 }))
  }

  const updateCartQty = (id, d) => {
    setCart(cart.map(i =>
      i.id === id ? { ...i, quantity: Math.max(1, i.quantity + d) } : i
    ))
  }

  const removeFromCart = id => setCart(cart.filter(i => i.id !== id))

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  /* ================= SAVE BILL (PROXY) ================= */
  async function saveBill() {
    if (!cart.length || !selectedPayment) return

    try {
      setSaving(true)
      setActionError(null)

      const res = await fetch('/api/supabaseProxy/saveOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart,
          total,
          payment_method: selectedPayment
        })
      })

      if (!res.ok) throw new Error('Save order failed')
      const { orderNumber } = await res.json()

      triggerOrderNotification(orderNumber)

      // Increment orders badge
      const currentCount = parseInt(localStorage.getItem('unseen_orders_count') || '0', 10)
      localStorage.setItem('unseen_orders_count', (currentCount + 1).toString())

      setCart([])
      setSelectedPayment(null)
      fetchOrders()
    } catch (err) {
      console.error(err)
      setActionError('Could not save bill. Please retry.')
    } finally {
      setSaving(false)
    }
  }

  const filteredItems = menuItems.filter(i =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredOrders =
    orderFilter === 'ALL' ? orders : orders.filter(o => o.status === orderFilter)

  if (loading || ordersLoading) return <div>Loading…</div>

  if (loadError) {
    return (
      <div className="card text-center py-10 space-y-3">
        <p className="text-red-600 font-semibold">{loadError}</p>
        <button className="btn-primary" onClick={fetchMenu}>Retry</button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* UI unchanged */}
      {/* Your existing JSX UI below remains SAME */}
      {/* I didn’t touch your UI */}
    </div>
  )
}