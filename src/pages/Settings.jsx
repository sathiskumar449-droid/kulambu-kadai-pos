import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { convertToTamil, convertToEnglish, searchWithTanglish } from '../lib/tamilTranslations'

export default function Settings() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock_qty: '',
    unit: 'bowl',
    is_enabled: true
  })

  useEffect(() => {
    fetchMenu()
  }, [])

  const fetchMenu = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/supabaseProxy/menu_items?select=id,name,price,daily_stock_quantity,unit,is_enabled&order=created_at.desc')
      if (!res.ok) throw new Error('Proxy fetch failed')
      const data = await res.json()
      setMenuItems(data || [])
    } catch (err) {
      console.error('Failed to load menu:', err)
      setError('Unable to load menu items. Please retry.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', price: '', stock_qty: '', unit: 'bowl', is_enabled: true })
    setEditingId(null)
    setShowModal(false)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  // ADD
  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      setError(null)
      const payload = {
        name: convertToTamil(formData.name),
        price: Number(formData.price),
        daily_stock_quantity: Number(formData.stock_qty),
        unit: formData.unit || 'bowl',
        is_enabled: formData.is_enabled
      }

      const res = await fetch('/api/supabaseProxy/menu_items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error('Add failed')
      await fetchMenu()
      resetForm()
    } catch (err) {
      console.error('Add failed:', err)
      setError('Could not add item.')
    }
  }

  // EDIT
  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      price: item.price?.toString() || '',
      stock_qty: (item.daily_stock_quantity ?? '').toString(),
      unit: item.unit || 'bowl',
      is_enabled: item.is_enabled
    })
    setEditingId(item.id)
    setShowModal(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      setError(null)
      const payload = {
        id: editingId,
        name: convertToTamil(formData.name),
        price: Number(formData.price),
        daily_stock_quantity: Number(formData.stock_qty),
        unit: formData.unit || 'bowl',
        is_enabled: formData.is_enabled
      }

      const res = await fetch('/api/supabaseProxy/menu_items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error('Update failed')
      await fetchMenu()
      resetForm()
    } catch (err) {
      console.error('Update failed:', err)
      setError('Could not update item.')
    }
  }

  const handleDelete = async (id) => {
    try {
      setError(null)
      const res = await fetch('/api/supabaseProxy/menu_items', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (!res.ok) throw new Error('Delete failed')
      setMenuItems(menuItems.filter(item => item.id !== id))
    } catch (err) {
      console.error('Delete failed:', err)
      setError('Could not delete item.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  const filteredItems = menuItems.filter(item => {
    if (!searchQuery) return true
    const tamilName = convertToTamil(item.name)
    const englishName = convertToEnglish(item.name)
    return searchWithTanglish(searchQuery, tamilName) || searchWithTanglish(searchQuery, englishName)
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-4">
      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold">Menu Management</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Item
          </button>
        </div>

        <div className="mt-3">
          <input
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-orange-500 focus:outline-none"
            placeholder="Search items…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="m-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
          {error}
        </div>
      )}

      <div className="p-4 space-y-2">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white border rounded-lg p-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold">{convertToTamil(item.name)}</h3>
              <p className="text-sm text-gray-500">₹{item.price} • Stock: {item.daily_stock_quantity} {item.unit}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(item)} className="bg-blue-500 text-white px-2 py-1 rounded"><Edit2 size={16} /></button>
              <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-2 py-1 rounded"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-4">
            <h3 className="font-bold mb-3">{editingId ? 'Edit Item' : 'Add Item'}</h3>
            <form onSubmit={editingId ? handleUpdate : handleAdd} className="space-y-3">
              <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Item name" className="w-full border p-2 rounded" required />
              <input name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="Price" className="w-full border p-2 rounded" required />
              <input name="stock_qty" type="number" value={formData.stock_qty} onChange={handleInputChange} placeholder="Stock" className="w-full border p-2 rounded" required />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-orange-500 text-white p-2 rounded">{editingId ? 'Update' : 'Add'}</button>
                <button type="button" onClick={resetForm} className="flex-1 bg-gray-300 p-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}