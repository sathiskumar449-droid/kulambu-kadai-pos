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
import { supabase } from '../lib/supabase'
import { convertToTamil } from '../lib/tamilTranslations'
import { playNotificationSound } from '../utils/notifications'

export default function Menu() {
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

  /* ================= MENU LOAD (SUPABASE) ================= */
  useEffect(() => {
    fetchMenu()
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

    // green flash
    setAddedFlash(p => ({ ...p, [item.id]: true }))
    setTimeout(() => {
      setAddedFlash(p => ({ ...p, [item.id]: false }))
    }, 700)

    // reset qty
    setRowQuantities(q => ({ ...q, [item.id]: 1 }))
  }

  /* ================= CART ================= */
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

      // If payment_method column doesn't exist, try without it
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
        item_name: i.name, // Tamil already stored
        quantity: i.quantity,
        price: i.price,
        subtotal: i.price * i.quantity
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(itemsPayload)
      if (itemsError) throw itemsError

      // Play notification sound
      playNotificationSound()

      setCart([])
      setSelectedPayment(null)
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

  if (loading) return <div>Loading…</div>

  if (loadError) {
    return (
      <div className="card text-center py-10 space-y-3">
        <p className="text-red-600 font-semibold">{loadError}</p>
        <button className="btn-primary" onClick={fetchMenu}>Retry</button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* ================= MENU ================= */}
      <div className="lg:col-span-2 card">
        <input
          className="input-field mb-4"
          placeholder="Search menu…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        <table className="w-full">
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
                  <td>{i + 1}</td>

                  <td className="font-medium">
                    {convertToTamil(item.name)}
                  </td>

                  {/* QTY */}
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          setRowQuantities(q => ({
                            ...q,
                            [item.id]: Math.max(1, q[item.id] - 1)
                          }))
                        }
                        className="w-8 h-8 rounded bg-gray-200 font-bold"
                      >
                        −
                      </button>

                      <span className="w-6 text-center font-semibold">
                        {qty}
                      </span>

                      <button
                        onClick={() =>
                          setRowQuantities(q => ({
                            ...q,
                            [item.id]: q[item.id] + 1
                          }))
                        }
                        className="w-8 h-8 rounded bg-gray-200 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td>₹{item.price * qty}</td>

                  {/* ADD */}
                  <td>
                    <button
                      onClick={() => addToCart(item)}
                      className={`px-4 py-2 rounded font-semibold text-white
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

      {/* ================= CART ================= */}
      <div className="card">
        <h3 className="font-bold flex items-center mb-2">
          <ShoppingCart className="mr-2" /> Cart
        </h3>

        {actionError && (
          <div className="mb-2 text-sm text-red-600">{actionError}</div>
        )}

        {cart.length === 0 && (
          <p className="text-gray-400 text-sm">Cart is empty</p>
        )}

        {cart.map(i => (
          <div key={i.id} className="flex justify-between items-center py-1">
            <span>{i.name} × {i.quantity}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => updateCartQty(i.id, -1)}>
                <Minus size={14} />
              </button>
              <button onClick={() => updateCartQty(i.id, 1)}>
                <Plus size={14} />
              </button>
              <button onClick={() => removeFromCart(i.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        <p className="font-bold mt-3">Total: ₹{total}</p>

        {!selectedPayment ? (
          <>
            <button
              className="btn-primary w-full mt-2"
              onClick={() => setSelectedPayment('cash')}
            >
              <DollarSign /> Cash
            </button>
            <button
              className="btn-secondary w-full mt-2"
              onClick={() => setSelectedPayment('online')}
            >
              <CreditCard /> Online
            </button>
          </>
        ) : (
          <button
            className="btn-primary w-full mt-3"
            onClick={saveBill}
          >
            <FileText /> Save Bill
          </button>
        )}
      </div>
    </div>
  )
}
