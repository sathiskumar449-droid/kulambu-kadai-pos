import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { convertToTamil } from '../lib/tamilTranslations'

// Mock menu items (Tamil only)
const MOCK_MENU_ITEMS = [
  { id: 1, name: 'சாம்பார்', price: 120, unit: 'Qty', stock_qty: 50, is_enabled: true },
  { id: 2, name: 'ரசம்', price: 100, unit: 'Qty', stock_qty: 40, is_enabled: true },
  { id: 3, name: 'தயிர் சாதம்', price: 90, unit: 'Qty', stock_qty: 60, is_enabled: true }
]

export default function Menu() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)

  // modal + edit
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock_qty: '',
    unit: 'Qty',
    is_enabled: true
  })

  // load menu
  useEffect(() => {
    const saved = localStorage.getItem('menuItems')
    if (saved) {
      setMenuItems(JSON.parse(saved))
    } else {
      setMenuItems(MOCK_MENU_ITEMS)
      localStorage.setItem('menuItems', JSON.stringify(MOCK_MENU_ITEMS))
    }
    setLoading(false)
  }, [])

  const persistItems = (items) => {
    setMenuItems(items)
    localStorage.setItem('menuItems', JSON.stringify(items))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      stock_qty: '',
      unit: 'Qty',
      is_enabled: true
    })
    setEditingId(null)
    setShowModal(false)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  // ADD
  const handleAdd = (e) => {
    e.preventDefault()

    const tamilName = convertToTamil(formData.name)

    const newItem = {
      id: Math.max(0, ...menuItems.map(m => m.id)) + 1,
      name: tamilName,
      price: Number(formData.price),
      stock_qty: Number(formData.stock_qty),
      unit: 'Qty',
      is_enabled: formData.is_enabled
    }

    persistItems([...menuItems, newItem])
    resetForm()
  }

  // EDIT
  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      price: item.price.toString(),
      stock_qty: item.stock_qty.toString(),
      unit: 'Qty',
      is_enabled: item.is_enabled
    })
    setEditingId(item.id)
    setShowModal(true)
  }

  const handleUpdate = (e) => {
    e.preventDefault()

    const tamilName = convertToTamil(formData.name)

    const updated = menuItems.map(item =>
      item.id === editingId
        ? {
            ...item,
            name: tamilName,
            price: Number(formData.price),
            stock_qty: Number(formData.stock_qty),
            is_enabled: formData.is_enabled
          }
        : item
    )

    persistItems(updated)
    resetForm()
  }

  const handleDelete = (id) => {
    persistItems(menuItems.filter(item => item.id !== id))
  }

  if (loading) {
    return <div className="text-gray-500">Loading menu…</div>
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Menu Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Item
        </button>
      </div>

      {/* MENU LIST */}
      <div className="grid gap-4">
        {menuItems.map(item => (
          <div key={item.id} className="card flex justify-between items-center">
            <div>
              <h4 className="text-lg font-semibold">{item.name}</h4>
              <p className="text-sm text-gray-600">
                ₹{item.price} • Stock: {item.stock_qty}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="p-2 bg-blue-100 text-blue-600 rounded"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 bg-red-100 text-red-600 rounded"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 relative">

            <button
              onClick={resetForm}
              className="absolute top-3 right-3 text-gray-500"
            >
              <X />
            </button>

            <h3 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Menu Item' : 'Add Menu Item'}
            </h3>

            <form
              onSubmit={editingId ? handleUpdate : handleAdd}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm mb-1">
                  Menu Name (English or Tamil)
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="sambar / சாம்பார்"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock_qty"
                    value={formData.stock_qty}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_enabled"
                  checked={formData.is_enabled}
                  onChange={handleInputChange}
                />
                <span className="ml-2 text-sm">Available Item</span>
              </div>

              <div className="flex gap-2 pt-4">
                <button type="submit" className="btn-primary flex items-center">
                  <Save className="w-5 h-5 mr-2" />
                  {editingId ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  )
}
