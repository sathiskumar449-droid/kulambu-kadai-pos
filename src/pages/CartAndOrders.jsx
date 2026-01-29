import { useState, useEffect } from 'react'
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  DollarSign,
  FileText,
  CheckCircle,
  Clock
} from 'lucide-react'
import { format } from 'date-fns'
import { supabase } from '../lib/supabase'
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

  /* ================= MENU LOAD (SUPABASE) ================= */
  useEffect(() => {
    requestNotificationPermission()
    fetchMenu()
    fetchOrders()

    // Subscribe to orders changes
    const channel = supabase.channel('orders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, fetchOrders)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchMenu() {
    try {
      setLoading(true)
      setLoadError(null)

      const { data, error: fetchError } = await supabase
        .from('menu_items')
        .select('id, name, price, is_enabled')
        .eq('is_enabled', true)
        .order('created_at')

      if (fetchError) throw fetchError

      setMenuItems(data || [])
      setRowQuantities((data || []).reduce((a, i) => ({ ...a, [i.id]: 1 }), {}))
    } catch (err) {
      console.error('Failed to load menu:', err)
      setLoadError('Unable to load menu items. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function fetchOrders() {
    try {
      setOrdersLoading(true)
      setOrdersError(null)

      let { data, error: fetchError } = await supabase
        .from('orders')
        .select('id, order_number, status, total_amount, payment_method, created_at, order_items (item_name, quantity, price, subtotal)')
        .order('created_at', { ascending: false })

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
        i.id === item.id
          ? { ...i, quantity: i.quantity + qty }
          : i
      ))
    } else {
      setCart([
        ...cart,
        {
          id: item.id,
          name: tamilName,
          price: item.price,
          quantity: qty
        }
      ])
    }

    setAddedFlash(p => ({ ...p, [item.id]: true }))
    setTimeout(() => {
      setAddedFlash(p => ({ ...p, [item.id]: false }))
    }, 700)

    setRowQuantities(q => ({ ...q, [item.id]: 1 }))
  }

  /* ================= CART OPERATIONS ================= */
  const updateCartQty = (id, d) => {
    setCart(cart.map(i =>
      i.id === id
        ? { ...i, quantity: Math.max(1, i.quantity + d) }
        : i
    ))
  }

  const removeFromCart = id =>
    setCart(cart.filter(i => i.id !== id))

  const total = cart.reduce(
    (s, i) => s + i.price * i.quantity,
    0
  )

  /* ================= SAVE BILL (SUPABASE) ================= */
  async function saveBill() {
    if (!cart.length || !selectedPayment) return

    try {
      setSaving(true)
      setActionError(null)

      const orderNumber = `ORD-${Date.now()}`

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          order_number: orderNumber,
          status: 'Pending',
          total_amount: total,
          payment_method: selectedPayment
        }])
        .select()
        .single()

      let finalOrder = order
      if (orderError && orderError.message.includes('payment_method')) {
        const { data: fallbackOrder, error: fallbackError } = await supabase
          .from('orders')
          .insert([{
            order_number: orderNumber,
            status: 'Pending',
            total_amount: total
          }])
          .select()
          .single()
        
        if (fallbackError) throw fallbackError
        finalOrder = fallbackOrder
      } else if (orderError) {
        throw orderError
      }

      const itemsPayload = cart.map(i => ({
        order_id: finalOrder.id,
        menu_item_id: i.id,
        item_name: i.name,
        quantity: i.quantity,
        price: i.price,
        subtotal: i.price * i.quantity
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(itemsPayload)
      if (itemsError) throw itemsError

      triggerOrderNotification(orderNumber)

      setCart([])
      setSelectedPayment(null)
      await fetchOrders()
    } catch (err) {
      console.error('Failed to save order:', err)
      setActionError(err?.message || 'Could not save bill. Please retry.')
    } finally {
      setSaving(false)
    }
  }

  const filteredItems = menuItems.filter(i =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredOrders =
    orderFilter === 'ALL'
      ? orders
      : orders.filter(o => o.status === orderFilter)

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

      {/* ================= MENU (2 COLS) ================= */}
      <div className="lg:col-span-2 card">
        <h3 className="font-bold mb-4">Menu</h3>
        <input
          className="input-field mb-4"
          placeholder="Search menu…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Item</th>
              <th className="text-center">Qty</th>
              <th>Price</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((item, i) => {
              const qty = rowQuantities[item.id] || 1
              return (
                <tr key={item.id}>
                  <td className="text-xs">{i + 1}</td>

                  <td className="font-medium text-xs">
                    {convertToTamil(item.name)}
                  </td>

                  <td className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() =>
                          setRowQuantities(q => ({
                            ...q,
                            [item.id]: Math.max(1, q[item.id] - 1)
                          }))
                        }
                        className="w-6 h-6 rounded bg-gray-200 font-bold text-xs"
                      >
                        −
                      </button>

                      <span className="w-4 text-center font-semibold text-xs">
                        {qty}
                      </span>

                      <button
                        onClick={() =>
                          setRowQuantities(q => ({
                            ...q,
                            [item.id]: q[item.id] + 1
                          }))
                        }
                        className="w-6 h-6 rounded bg-gray-200 font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td className="text-xs">₹{item.price * qty}</td>

                  <td>
                    <button
                      onClick={() => addToCart(item)}
                      className={`px-2 py-1 rounded font-semibold text-white text-xs
                        ${
                          addedFlash[item.id]
                            ? 'bg-green-500'
                            : 'bg-orange-500 hover:bg-orange-600'
                        }`}
                    >
                      Add
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ================= CART (1 COL) ================= */}
      <div className="card">
        <h3 className="font-bold flex items-center mb-3">
          <ShoppingCart className="mr-2" size={18} /> Cart
        </h3>

        {actionError && (
          <div className="mb-2 text-xs text-red-600">{actionError}</div>
        )}

        {cart.length === 0 && (
          <p className="text-gray-400 text-xs">Cart is empty</p>
        )}

        <div className="space-y-1 mb-3 max-h-48 overflow-y-auto">
          {cart.map(i => (
            <div key={i.id} className="flex justify-between items-center py-1 text-xs border-b pb-1">
              <span className="flex-1">{i.name}</span>
              <span className="font-semibold">×{i.quantity}</span>
              <div className="flex items-center gap-1 ml-2">
                <button onClick={() => updateCartQty(i.id, -1)} className="p-1">
                  <Minus size={12} />
                </button>
                <button onClick={() => updateCartQty(i.id, 1)} className="p-1">
                  <Plus size={12} />
                </button>
                <button onClick={() => removeFromCart(i.id)} className="p-1">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="font-bold text-sm border-t pt-2">Total: ₹{total}</p>

        {!selectedPayment ? (
          <>
            <button
              className="btn-primary w-full mt-2 text-sm"
              onClick={() => setSelectedPayment('cash')}
            >
              <DollarSign size={16} /> Cash
            </button>
            <button
              className="btn-secondary w-full mt-2 text-sm"
              onClick={() => setSelectedPayment('online')}
            >
              <CreditCard size={16} /> Online
            </button>
          </>
        ) : (
          <button
            className="btn-primary w-full mt-3 text-sm"
            onClick={saveBill}
            disabled={saving}
          >
            <FileText size={16} /> {saving ? 'Saving…' : 'Save Bill'}
          </button>
        )}
      </div>

      {/* ================= ORDERS (1 COL) ================= */}
      <div className="card">
        <h3 className="font-bold mb-3">Orders</h3>

        {ordersError && (
          <div className="card bg-red-50 text-red-700 p-2 mb-3 text-xs">{ordersError}</div>
        )}

        <div className="flex gap-1 mb-3">
          {['ALL', 'PENDING', 'PLACED'].map(s => (
            <button 
              key={s} 
              onClick={() => setOrderFilter(s)} 
              className={`text-xs px-2 py-1 rounded ${
                orderFilter === s 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredOrders.length === 0 && (
            <p className="text-gray-400 text-xs">No orders</p>
          )}

          {filteredOrders.map(o => (
            <div key={o.id} className="border rounded p-2 bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-xs">{o.orderNumber}</h4>
                  <p className="text-xs text-gray-600">
                    {o.createdAt ? format(new Date(o.createdAt), 'dd MMM, HH:mm') : ''}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  o.status === 'PENDING' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                }`}>
                  {o.status}
                </span>
              </div>

              <div className="text-xs space-y-1 mb-2 border-t pt-1">
                {o.items.map((it, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span>{convertToTamil(it.name)} ×{it.quantity}</span>
                    <span>₹{it.subtotal}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t pt-1">
                <span className="font-bold text-xs">Total:</span>
                <span className="font-bold text-sm">₹{o.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
