import { useState, useEffect } from 'react'
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  DollarSign,
  FileText,
  Leaf,
  Drumstick,
  X
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { convertToTamil } from '../lib/tamilTranslations'
import { triggerOrderNotification, requestNotificationPermission } from '../utils/notifications'
import Toast from '../components/Toast'

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
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCart, setShowCart] = useState(false)

  /* ================= MENU LOAD (SUPABASE) ================= */
  useEffect(() => {
    // 🔔 Request notification permission on mount
    requestNotificationPermission()
    
    fetchMenu()
  }, [])

  async function fetchMenu() {
    try {
      setLoading(true)
      setLoadError(null)

      const { data, error: fetchError } = await supabase
        .from('menu_items')
        .select('id, name, price, is_enabled, category')
        .eq('is_enabled', true)
        .order('created_at')

      if (fetchError) throw fetchError

      // Normalize category field (handle null, empty, inconsistent values)
      const normalizedData = (data || []).map(item => ({
        ...item,
        category: (item.category || 'veg').toLowerCase().trim()
      }))

      setMenuItems(normalizedData)
      setRowQuantities((normalizedData || []).reduce((a, i) => ({ ...a, [i.id]: 1 }), {}))
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

      // 🔔 Trigger notification sound and browser notification
      triggerOrderNotification(orderNumber)

      // Show success toast
      setToastMessage('🔔 Items Ordered Successfully!')
      setShowToast(true)

      setCart([])
      setSelectedPayment(null)
    } catch (err) {
      console.error('Failed to save order:', err)
      setActionError(err?.message || 'Could not save bill. Please retry.')
    } finally {
      setSaving(false)
    }
  }

  const filteredItems = menuItems.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || i.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...new Set(menuItems.map(i => i.category))]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="card text-center py-10 space-y-3 mx-4 mt-4">
        <p className="text-red-600 font-semibold">{loadError}</p>
        <button className="btn-primary" onClick={fetchMenu}>Retry</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-6">
      {/* HEADER - Mobile Sticky */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-3 md:p-4 space-y-3">
          {/* Search Bar */}
          <input
            className="w-full px-4 py-2.5 md:py-3 text-base rounded-lg border border-gray-300 focus:border-orange-500 focus:outline-none transition"
            placeholder="Search items…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />

          {/* Category Filter - Horizontal Scroll on Mobile */}
          <div className="overflow-x-auto -mx-3 px-3">
            <div className="flex gap-2 pb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700 active:bg-gray-300'
                  }`}
                >
                  {cat === 'all' ? '📌 All' : cat === 'veg' ? '🥬 Veg' : '🍗 Non-Veg'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MENU ITEMS - Card Grid for Mobile */}
      <div className="p-3 md:p-4 space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No items found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredItems.map((item) => {
              const qty = rowQuantities[item.id] || 1
              const isAdded = addedFlash[item.id]

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-lg border-2 p-3 md:p-4 transition ${
                    isAdded ? 'border-green-500 shadow-lg' : 'border-gray-200 shadow-sm'
                  }`}
                >
                  {/* Item Header */}
                  <div className="mb-3">
                    <h3 className="font-bold text-base md:text-lg text-gray-800 line-clamp-2">
                      {convertToTamil(item.name)}
                    </h3>
                    <p className="text-lg md:text-xl font-bold text-orange-600 mt-1">
                      ₹{item.price}
                    </p>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-gray-600 text-sm">Qty:</span>
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() =>
                          setRowQuantities(q => ({
                            ...q,
                            [item.id]: Math.max(1, q[item.id] - 1)
                          }))
                        }
                        className="w-8 h-8 flex items-center justify-center rounded font-bold text-gray-700 active:bg-gray-200 transition"
                      >
                        −
                      </button>

                      <span className="w-8 text-center font-semibold text-base">
                        {qty}
                      </span>

                      <button
                        onClick={() =>
                          setRowQuantities(q => ({
                            ...q,
                            [item.id]: q[item.id] + 1
                          }))
                        }
                        className="w-8 h-8 flex items-center justify-center rounded font-bold text-gray-700 active:bg-gray-200 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price with Quantity */}
                  <div className="text-center mb-3 text-gray-600 text-sm">
                    {qty > 1 && `₹${item.price} × ${qty} = `}
                    <span className="font-bold text-gray-800">₹{item.price * qty}</span>
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={() => addToCart(item)}
                    className={`w-full py-2.5 md:py-3 rounded-lg font-bold text-base md:text-lg text-white transition add-button-animate ${
                      isAdded ? 'bg-green-500' : 'bg-orange-500 active:bg-orange-600'
                    }`}
                  >
                    {isAdded ? '✓ Added' : '➕ Add'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* FLOATING CART BUTTON - Mobile */}
      {cart.length > 0 && (
        <button
          onClick={() => setShowCart(!showCart)}
          className="fixed bottom-4 md:bottom-8 right-4 md:right-8 z-50 bg-orange-500 text-white rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-lg font-bold text-lg md:text-xl add-button-animate"
        >
          <ShoppingCart className="w-6 h-6 md:w-8 md:h-8" />
          <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center text-xs md:text-sm font-bold">
            {cart.length}
          </span>
        </button>
      )}

      {/* CART MODAL - Mobile Sheet */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-md max-h-[85vh] flex flex-col shadow-2xl animate-fade-in">
            {/* Cart Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-xl md:text-2xl font-bold">Your Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="overflow-y-auto flex-1 p-4 space-y-3">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Cart is empty</p>
              ) : (
                cart.map(i => (
                  <div key={i.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-sm md:text-base">{i.name}</p>
                      <p className="text-gray-600 text-xs md:text-sm">₹{i.price} × {i.quantity}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateCartQty(i.id, -1)}
                        className="w-7 h-7 flex items-center justify-center rounded bg-gray-200 text-sm active:bg-gray-300"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-xs font-bold">{i.quantity}</span>
                      <button
                        onClick={() => updateCartQty(i.id, 1)}
                        className="w-7 h-7 flex items-center justify-center rounded bg-gray-200 text-sm active:bg-gray-300"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(i.id)}
                        className="w-7 h-7 flex items-center justify-center text-red-500 active:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-200 p-4 space-y-3 flex-shrink-0">
                {actionError && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{actionError}</div>
                )}

                <div className="text-center">
                  <p className="text-gray-600 text-sm">Total Amount</p>
                  <p className="text-2xl md:text-3xl font-bold text-orange-600">₹{total}</p>
                </div>

                {!selectedPayment ? (
                  <>
                    <button
                      onClick={() => setSelectedPayment('cash')}
                      className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition flex items-center justify-center gap-2"
                    >
                      <DollarSign size={20} /> Cash
                    </button>
                    <button
                      onClick={() => setSelectedPayment('online')}
                      className="w-full bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition flex items-center justify-center gap-2"
                    >
                      <CreditCard size={20} /> Online
                    </button>
                  </>
                ) : (
                  <button
                    onClick={saveBill}
                    disabled={saving}
                    className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 disabled:bg-gray-400 text-white py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FileText size={20} /> Submit Order
                      </>
                    )}
                  </button>
                )}

                {selectedPayment && (
                  <button
                    onClick={() => setSelectedPayment(null)}
                    className="w-full text-gray-600 py-2 text-sm"
                  >
                    ← Go Back
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <Toast 
          message={toastMessage} 
          onClose={() => setShowToast(false)} 
        />
      )}
    </div>
  )
}
