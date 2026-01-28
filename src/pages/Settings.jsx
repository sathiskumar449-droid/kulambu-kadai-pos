import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { convertToTamil } from '../lib/tamilTranslations'
import { supabase } from '../lib/supabase'

export default function Settings() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
    fetchMenu()
  }, [])

  const fetchMenu = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('menu_items')
        .select('id, name, price, daily_stock_quantity, unit, is_enabled')
        .order('created_at')

      if (fetchError) throw fetchError
      setMenuItems(data || [])
    } catch (err) {
      console.error('Failed to load menu:', err)
      setError('Unable to load menu items. Please retry.')
    } finally {
      setLoading(false)
    }
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
  const handleAdd = async (e) => {
    e.preventDefault()

    try {
      setError(null)
      const tamilName = convertToTamil(formData.name)

      const { error: insertError } = await supabase.from('menu_items').insert([{
        name: tamilName,
        price: Number(formData.price),
        daily_stock_quantity: Number(formData.stock_qty),
        unit: formData.unit || 'Qty',
        is_enabled: formData.is_enabled
      }])

      if (insertError) throw insertError
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
      unit: item.unit || 'Qty',
      is_enabled: item.is_enabled
    })
    setEditingId(item.id)
    setShowModal(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    try {
      setError(null)
      const tamilName = convertToTamil(formData.name)

      const { error: updateError } = await supabase
        .from('menu_items')
        .update({
          name: tamilName,
          price: Number(formData.price),
          daily_stock_quantity: Number(formData.stock_qty),
          unit: formData.unit || 'Qty',
          is_enabled: formData.is_enabled
        })
        .eq('id', editingId)

      if (updateError) throw updateError
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
      const { error: deleteError } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
      setMenuItems(menuItems.filter(item => item.id !== id))
    } catch (err) {
      console.error('Delete failed:', err)
      setError('Could not delete item.')
    }
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

      {error && (
        <div className="card bg-red-50 text-red-700 p-3">{error}</div>
      )}

      {/* MENU LIST */}
      <div className="grid gap-4">
        {menuItems.map(item => (
          <div key={item.id} className="card flex justify-between items-center">
            <div>
              <h4 className="text-lg font-semibold">{item.name}</h4>
              <p className="text-sm text-gray-600">
                ₹{item.price} • Stock: {item.daily_stock_quantity} {item.unit}
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

              <div className="grid grid-cols-3 gap-4">
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

                <div>
                  <label className="block text-sm mb-1">Unit</label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Qty / kg / litres"
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
