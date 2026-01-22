import { useState, useEffect } from 'react'
import { Plus, Minus, Trash2, ShoppingCart, CreditCard, DollarSign, FileText, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Mock menu items
const MOCK_MENU_ITEMS = [
  { id: 1, name: 'Sambar', category: 'Curries', price: 120, unit: 'qty' },
  { id: 2, name: 'Rasam', category: 'Curries', price: 100, unit: 'qty' },
  { id: 3, name: 'Vaghali', category: 'Curries', price: 140, unit: 'qty' },
  { id: 4, name: 'Curd Rice', category: 'Rice Dishes', price: 90, unit: 'qty' },
  { id: 5, name: 'Lemon Rice', category: 'Rice Dishes', price: 85, unit: 'qty' },
  { id: 6, name: 'Butter Rice', category: 'Rice Dishes', price: 95, unit: 'qty' },
  { id: 7, name: 'Ghee Puri', category: 'Breads', price: 40, unit: 'qty' },
  { id: 8, name: 'Chappati', category: 'Breads', price: 30, unit: 'qty' }
]

export default function Orders() {
  const [menuItems, setMenuItems] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [orders, setOrders] = useState([])
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [rowQuantities, setRowQuantities] = useState({})

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setMenuItems(MOCK_MENU_ITEMS)
      setRowQuantities(MOCK_MENU_ITEMS.reduce((acc, item) => {
        acc[item.id] = 1
        return acc
      }, {}))
      setLoading(false)
    }, 500)
  }, [])

  const addToCart = (item, quantity = 1) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id)
    const qtyToAdd = Math.max(1, quantity)
    
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + qtyToAdd }
          : cartItem
      ))
    } else {
      setCart([...cart, { ...item, quantity: qtyToAdd }])
    }
  }

  const adjustRowQuantity = (itemId, delta) => {
    setRowQuantities(prev => {
      const current = prev[itemId] ?? 1
      const next = Math.max(1, current + delta)
      return { ...prev, [itemId]: next }
    })
  }

  const updateQuantity = (itemId, change) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + change
        return { ...item, quantity: Math.max(0, newQuantity) }
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId))
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const saveBill = () => {
    if (cart.length === 0 || !selectedPayment) {
      return
    }

    const orderNumber = `ORD-${Date.now()}`
    const now = new Date()
    const newOrder = {
      id: orders.length + 1,
      orderNumber,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      totalAmount: calculateTotal(),
      status: 'pending',
      paymentMethod: selectedPayment,
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      }))
    }

    setOrders([...orders, newOrder])
    
    // Dispatch event to update badge
    const pendingCount = 1 + orders.filter(o => o.status === 'pending').length
    window.dispatchEvent(new CustomEvent('orderCountChanged', { detail: pendingCount }))
    
    // Clear cart and reset payment selection
    setCart([])
    setSelectedPayment(null)
  }

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading menu...</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 max-w-7xl mx-auto">
      {/* Menu Items */}
      <div className="lg:col-span-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field w-full text-base md:text-lg py-3 dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="card overflow-x-auto dark:bg-gray-800 dark:border-gray-700 shadow-lg"
        >
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm md:text-base">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-3 md:px-4 py-3 md:py-4 text-left font-semibold text-gray-700 dark:text-gray-300 w-12 md:w-16">S.No</th>
                <th className="px-3 md:px-4 py-3 md:py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Item Name</th>
                <th className="px-3 md:px-4 py-3 md:py-4 text-left font-semibold text-gray-700 dark:text-gray-300 w-32 md:w-40">Qty</th>
                <th className="px-3 md:px-4 py-3 md:py-4 text-left font-semibold text-gray-700 dark:text-gray-300 w-24 md:w-32">Price</th>
                <th className="px-3 md:px-4 py-3 md:py-4 text-left font-semibold text-gray-700 dark:text-gray-300 w-20 md:w-28">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              <AnimatePresence>
                {filteredItems.map((item, index) => {
                  const qty = rowQuantities[item.id] ?? 1
                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: 'rgba(245, 135, 0, 0.05)' }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-3 md:px-4 py-3 md:py-4 text-gray-600 dark:text-gray-400">{index + 1}</td>
                      <td className="px-3 md:px-4 py-3 md:py-4 font-semibold text-gray-900 dark:text-white">{item.name}</td>
                      <td className="px-3 md:px-4 py-3 md:py-4">
                        <div className="flex items-center gap-1 md:gap-2">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => adjustRowQuantity(item.id, -1)}
                            className="p-2 md:p-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4 md:w-5 md:h-5 dark:text-white" />
                          </motion.button>
                          <motion.span
                            key={qty}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            className="w-8 md:w-10 text-center font-bold text-base md:text-lg dark:text-white"
                          >
                            {qty}
                          </motion.span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => adjustRowQuantity(item.id, 1)}
                            className="p-2 md:p-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4 md:w-5 md:h-5 dark:text-white" />
                          </motion.button>
                        </div>
                      </td>
                      <td className="px-3 md:px-4 py-3 md:py-4">
                        <motion.span
                          key={item.price * qty}
                          initial={{ scale: 1.1, color: '#f58700' }}
                          animate={{ scale: 1, color: 'inherit' }}
                          className="font-semibold text-gray-900 dark:text-white text-base md:text-lg"
                        >
                          ₹{(item.price * qty).toFixed(2)}
                        </motion.span>
                      </td>
                      <td className="px-3 md:px-4 py-3 md:py-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addToCart(item, qty)}
                          className="btn-primary px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base min-h-[44px] shadow-md hover:shadow-lg transition-all"
                        >
                          Add
                        </motion.button>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>

          {filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 md:py-12 text-gray-500 dark:text-gray-400"
            >
              No items found
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Cart */}
      <div className="lg:col-span-1">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card sticky top-4 dark:bg-gray-800 dark:border-gray-700 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl md:text-2xl font-bold flex items-center dark:text-white">
              <ShoppingCart className="w-6 h-6 md:w-7 md:h-7 mr-2 text-primary-500" />
              Cart
            </h3>
            <motion.span
              key={cart.length}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-bold min-w-[48px] text-center"
            >
              {cart.length} items
            </motion.span>
          </div>

          <div className="space-y-3 mb-4 max-h-[40vh] md:max-h-96 overflow-y-auto scrollbar-thin">
            <AnimatePresence mode="popLayout">
              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-8 text-gray-400 dark:text-gray-500"
                >
                  <ShoppingCart className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Cart is empty</p>
                </motion.div>
              ) : (
                cart.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm md:text-base dark:text-white break-words">{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">₹{item.price} each</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-2 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4 dark:text-white" />
                      </motion.button>
                      <motion.span
                        key={item.quantity}
                        initial={{ scale: 1.2, color: '#f58700' }}
                        animate={{ scale: 1, color: 'inherit' }}
                        className="font-semibold w-8 text-center dark:text-white"
                      >
                        {item.quantity}
                      </motion.span>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-2 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 dark:text-white" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <motion.div
                      key={item.price * item.quantity}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="ml-3 text-right min-w-[60px]"
                    >
                      <p className="font-bold text-sm md:text-base dark:text-white">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </motion.div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="border-t dark:border-gray-600 pt-4 space-y-3">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold dark:text-white">Total</span>
              <motion.span
                key={calculateTotal()}
                initial={{ scale: 1.2, color: '#f58700' }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400"
              >
                ₹{calculateTotal().toFixed(2)}
              </motion.span>
            </div>

            {/* Payment Mode Selection */}
            <AnimatePresence mode="wait">
              {!selectedPayment && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-2"
                >
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-2">Select Payment Method</p>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPayment('cash')}
                    disabled={cart.length === 0}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 md:py-4 px-4 rounded-lg transition-all flex items-center justify-center shadow-md hover:shadow-lg min-h-[52px]"
                  >
                    <DollarSign className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                    Cash Payment
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPayment('online')}
                    disabled={cart.length === 0}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 md:py-4 px-4 rounded-lg transition-all flex items-center justify-center shadow-md hover:shadow-lg min-h-[52px]"
                  >
                    <CreditCard className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                    Online Payment
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Save Bill Button - Shows after payment selection */}
            <AnimatePresence mode="wait">
              {selectedPayment && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-2"
                >
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg flex items-center justify-between border border-blue-200 dark:border-blue-800"
                  >
                    <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                      Payment: {selectedPayment === 'cash' ? '💵 Cash' : '💳 Online'}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedPayment(null)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={saveBill}
                    disabled={cart.length === 0}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all min-h-[56px]"
                  >
                    <FileText className="w-6 h-6 mr-2" />
                    Save Bill
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
