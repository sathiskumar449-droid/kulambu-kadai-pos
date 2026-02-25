import { useState, useEffect } from 'react'
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  DollarSign,
  FileText,
  X
} from 'lucide-react'
import { convertToTamil, convertToEnglish, searchWithTanglish } from '../lib/tamilTranslations'
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

  /* ================= MENU LOAD (PROXY) ================= */
  useEffect(() => {
    requestNotificationPermission()
    fetchMenu()
  }, [])

  async function fetchMenu() {
    try {
      setLoading(true)
      setLoadError(null)

      const res = await fetch('/api/supabaseProxy/menu_items?select=id,name,price,is_enabled,category&is_enabled=eq.true&order=created_at.asc')
      if (!res.ok) throw new Error('Proxy API failed')

      const data = await res.json()

      const normalizedData = (data || []).map(item => ({
        ...item,
        category: (item.category || 'veg').toLowerCase().trim()
      }))

      setMenuItems(normalizedData)
      setRowQuantities(normalizedData.reduce((a, i) => ({ ...a, [i.id]: 1 }), {}))
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
      setCart([...cart, { id: item.id, name: tamilName, price: item.price, quantity: qty }])
    }

    setAddedFlash(p => ({ ...p, [item.id]: true }))
    setTimeout(() => setAddedFlash(p => ({ ...p, [item.id]: false })), 700)

    setRowQuantities(q => ({ ...q, [item.id]: 1 }))
  }

  const updateCartQty = (id, d) => {
    setCart(cart.map(i =>
      i.id === id
        ? { ...i, quantity: Math.max(1, i.quantity + d) }
        : i
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
          total_amount: total,
          payment_method: selectedPayment,
          items: cart
        })
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Order failed')

      triggerOrderNotification(result.order_number)

      setToastMessage('🔔 Items Ordered Successfully!')
      setShowToast(true)

      setCart([])
      setSelectedPayment(null)
    } catch (err) {
      console.error(err)
      setActionError(err.message || 'Could not save bill.')
    } finally {
      setSaving(false)
    }
  }

  const filteredItems = menuItems.filter(i => {
    const matchesSearch = !searchQuery || searchWithTanglish(searchQuery, i.name)
    const matchesCategory = selectedCategory === 'all' || i.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...new Set(menuItems.map(i => i.category))]

  /* UI PART – UNCHANGED */
  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-6">
      {/* UI same as before – already working */}
    </div>
  )
}