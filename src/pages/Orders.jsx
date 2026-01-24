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
import { convertToTamil } from '../lib/tamilTranslations'

const MOCK_MENU_ITEMS = [
  { id: 1, name: 'சாம்பார்', category: 'Curries', price: 120 },
  { id: 2, name: 'ரசம்', category: 'Curries', price: 100 },
  { id: 3, name: 'தயிர் சாதம்', category: 'Rice', price: 90 }
]

export default function Orders() {
  const [menuItems, setMenuItems] = useState([])
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [rowQuantities, setRowQuantities] = useState({})
  const [addedFlash, setAddedFlash] = useState({}) // 👈 green flash state

  useEffect(() => {
    const savedMenu = JSON.parse(localStorage.getItem('menuItems') || 'null')
    const menu = savedMenu?.length ? savedMenu : MOCK_MENU_ITEMS
    setMenuItems(menu)

    setRowQuantities(
      menu.reduce((a, i) => ({ ...a, [i.id]: 1 }), {})
    )

    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    setOrders(savedOrders)

    setLoading(false)
  }, [])

  /* ---------------- ADD TO CART ---------------- */
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
      setCart([...cart, { ...item, name: tamilName, quantity: qty }])
    }

    // 👇 green flash on Add
    setAddedFlash(prev => ({ ...prev, [item.id]: true }))
    setTimeout(() => {
      setAddedFlash(prev => ({ ...prev, [item.id]: false }))
    }, 800)

    // reset row qty to 1
    setRowQuantities(q => ({ ...q, [item.id]: 1 }))
  }

  /* ---------------- CART ---------------- */
  const updateCartQty = (id, d) => {
    setCart(cart.map(i =>
      i.id === id
        ? { ...i, quantity: Math.max(1, i.quantity + d) }
        : i
    ))
  }

  const removeFromCart = id =>
    setCart(cart.filter(i => i.id !== id))

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  /* ---------------- SAVE BILL ---------------- */
  const saveBill = () => {
    if (!cart.length || !selectedPayment) return

    const newOrder = {
      id: Date.now(),
      orderNumber: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      time: new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'PENDING',
      paymentMethod: selectedPayment,
      total,
      totalAmount: total,
      items: cart.map(i => ({
        name: convertToTamil(i.name),
        quantity: i.quantity,
        price: i.price,
        subtotal: i.price * i.quantity
      }))
    }

    const updated = [...orders, newOrder]
    setOrders(updated)
    localStorage.setItem('orders', JSON.stringify(updated))

    window.dispatchEvent(new CustomEvent('orderAdded', { detail: newOrder }))
    window.dispatchEvent(
      new CustomEvent('orderCountChanged', {
        detail: updated.filter(o => o.status === 'PENDING').length
      })
    )

    setCart([])
    setSelectedPayment(null)
  }

  const filteredItems = menuItems.filter(i =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) return <div>Loading…</div>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* ---------------- MENU ---------------- */}
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

                  {/* ✅ PERFECT QTY ALIGNMENT */}
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          setRowQuantities(q => ({
                            ...q,
                            [item.id]: Math.max(1, q[item.id] - 1)
                          }))
                        }
                        className="w-8 h-8 flex items-center justify-center
                                   rounded bg-gray-200 hover:bg-gray-300 font-bold"
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
                        className="w-8 h-8 flex items-center justify-center
                                   rounded bg-gray-200 hover:bg-gray-300 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td>₹{item.price * qty}</td>

                  {/* ✅ ADD BUTTON GREEN FLASH */}
                  <td>
                    <button
                      onClick={() => addToCart(item)}
                      className={`px-4 py-2 rounded font-semibold text-white transition-colors
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

      {/* ---------------- CART ---------------- */}
      <div className="card">
        <h3 className="font-bold flex items-center mb-2">
          <ShoppingCart className="mr-2" /> Cart
        </h3>

        {cart.length === 0 && (
          <p className="text-gray-400 text-sm">Cart is empty</p>
        )}

        {cart.map(i => (
          <div key={i.id} className="flex justify-between items-center py-1">
            <span>
              {convertToTamil(i.name)} × {i.quantity}
            </span>
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
