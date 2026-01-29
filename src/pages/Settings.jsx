import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { convertToTamil, convertToEnglish } from '../lib/tamilTranslations'
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
    unit: 'bowl',
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
      unit: 'bowl',
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
        unit: formData.unit || 'bowl',
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
      const tamilName = convertToTamil(formData.name)

      const { error: updateError } = await supabase
        .from('menu_items')
        .update({
          name: tamilName,
          price: Number(formData.price),
          daily_stock_quantity: Number(formData.stock_qty),
          unit: formData.unit || 'bowl',
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
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-4">
      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold">Menu Management</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg font-semibold flex items-center gap-2 text-sm md:text-base transition"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Item</span>
          </button>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="m-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
          {error}
        </div>
      )}

      {/* MENU LIST - List View */}
      <div className="p-4 space-y-2">
        {menuItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No items found
          </div>
        ) : (
          <div className="space-y-2">
            {menuItems.map((item) => {
              const tamilName = convertToTamil(item.name)
              const isTamilName = /[\u0B80-\u0BFF]/.test(item.name)
              const englishName = isTamilName ? convertToEnglish(item.name) : item.name
              
              return (
                <div key={item.id} className="bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition p-3">
                  <div className="flex items-center gap-3">
                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-base md:text-lg text-gray-800">
                          {tamilName}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          item.is_enabled 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {item.is_enabled ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        {englishName}
                      </p>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-lg font-bold text-orange-600">
                          ₹{item.price}
                        </span>
                        <span className="text-gray-600">
                          Stock: <span className="font-semibold">{item.daily_stock_quantity} {item.unit}</span>
                        </span>
                        <span className="text-gray-400 text-xs">#{item.id}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-3 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-1"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span className="hidden md:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-3 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden md:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* MODAL - Mobile Optimized */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-2xl">
              <h3 className="text-lg md:text-xl font-bold">
                {editingId ? 'Edit Item' : 'Add New Item'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={editingId ? handleUpdate : handleAdd}
              className="p-4 space-y-4"
            >
              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-base transition"
                  placeholder="sambar / சாம்பார்"
                />
              </div>

              {/* Price & Stock Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-base transition"
                    placeholder="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock_qty"
                    value={formData.stock_qty}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-base transition"
                    placeholder="20"
                  />
                </div>
              </div>

              {/* Status Checkbox */}
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <input
                  type="checkbox"
                  id="is_enabled"
                  name="is_enabled"
                  checked={formData.is_enabled}
                  onChange={handleInputChange}
                  className="w-5 h-5 cursor-pointer"
                />
                <label htmlFor="is_enabled" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  This item is available
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white py-3 rounded-lg font-bold text-base transition flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingId ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-700 py-3 rounded-lg font-bold text-base transition"
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
