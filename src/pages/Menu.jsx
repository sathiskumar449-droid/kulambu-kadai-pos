import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'

// Mock menu items with stock info
const MOCK_MENU_ITEMS = [
  { id: 1, name: 'Sambar', category: 'Curries', price: 120, unit: 'qty', stock_qty: 50, is_enabled: true },
  { id: 2, name: 'Rasam', category: 'Curries', price: 100, unit: 'qty', stock_qty: 40, is_enabled: true },
  { id: 3, name: 'Vaghali', category: 'Curries', price: 140, unit: 'qty', stock_qty: 30, is_enabled: true },
  { id: 4, name: 'Curd Rice', category: 'Rice Dishes', price: 90, unit: 'qty', stock_qty: 60, is_enabled: true },
  { id: 5, name: 'Lemon Rice', category: 'Rice Dishes', price: 85, unit: 'qty', stock_qty: 55, is_enabled: true },
  { id: 6, name: 'Butter Rice', category: 'Rice Dishes', price: 95, unit: 'qty', stock_qty: 45, is_enabled: true },
  { id: 7, name: 'Ghee Puri', category: 'Breads', price: 40, unit: 'qty', stock_qty: 100, is_enabled: true },
  { id: 8, name: 'Chappati', category: 'Breads', price: 30, unit: 'qty', stock_qty: 150, is_enabled: true }
]

export default function Menu() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    unit: 'qty',
    stock_qty: '',
    is_enabled: true
  })

  useEffect(() => {
    setTimeout(() => {
      const saved = localStorage.getItem('menuItems')
      if (saved) {
        setMenuItems(JSON.parse(saved))
      } else {
        setMenuItems(MOCK_MENU_ITEMS)
        localStorage.setItem('menuItems', JSON.stringify(MOCK_MENU_ITEMS))
      }
      setLoading(false)
    }, 200)
  }, [])

  const persistItems = (items) => {
    setMenuItems(items)
    localStorage.setItem('menuItems', JSON.stringify(items))
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: '',
      unit: 'qty',
      stock_qty: '',
      is_enabled: true
    })
    setEditingId(null)
    setShowAddForm(false)
  }

  const handleAdd = (e) => {
    e.preventDefault()

    const newItem = {
      id: Math.max(...menuItems.map(m => m.id), 0) + 1,
      ...formData,
      price: parseFloat(formData.price),
      stock_qty: parseInt(formData.stock_qty, 10) || 0
    }

    persistItems([...menuItems, newItem])
    resetForm()
  }

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      unit: item.unit,
      stock_qty: item.stock_qty.toString(),
      is_enabled: item.is_enabled
    })
    setEditingId(item.id)
    setShowAddForm(true)
  }

  const handleUpdate = (e) => {
    e.preventDefault()

    persistItems(menuItems.map(item =>
      item.id === editingId
        ? {
            ...item,
            ...formData,
            price: parseFloat(formData.price),
            stock_qty: parseInt(formData.stock_qty, 10) || 0
          }
        : item
    ))

    resetForm()
  }

  const handleDelete = (id) => {
    persistItems(menuItems.filter(item => item.id !== id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading menu items...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Menu Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary flex items-center"
        >
          {showAddForm ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {showAddForm ? 'Cancel' : 'Add New Item'}
        </button>
      </div>

      {showAddForm && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h3>
          <form onSubmit={editingId ? handleUpdate : handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                >
                  <option value="">Select category</option>
                  <option value="Curries">Curries</option>
                  <option value="Rice Dishes">Rice Dishes</option>
                  <option value="Breads">Breads</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock_qty"
                  value={formData.stock_qty}
                  onChange={handleInputChange}
                  required
                  step="1"
                  min="0"
                  className="input-field"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_enabled"
                  checked={formData.is_enabled}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Enable Item
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="btn-primary flex items-center"
              >
                <Save className="w-5 h-5 mr-2" />
                {editingId ? 'Update Item' : 'Add Item'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary flex items-center"
              >
                <X className="w-5 h-5 mr-2" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {menuItems.map(item => (
          <div key={item.id} className="card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-600">
                  {item.category} • ₹{item.price} • Stock: {item.stock_qty} {item.unit}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
