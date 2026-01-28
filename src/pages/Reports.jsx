import { useState, useEffect } from 'react'
import { Calendar, Download, TrendingUp } from 'lucide-react'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { convertToTamil } from '../lib/tamilTranslations'
import { supabase } from '../lib/supabase'

export default function Reports() {
  const [reportType, setReportType] = useState('daily')
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [reportData, setReportData] = useState({ summary: { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 }, itemWiseSales: [], dailyBreakdown: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    updateDateRange(reportType)
  }, [reportType])

  useEffect(() => {
    fetchReports()

    const channel = supabase.channel('reports-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchReports)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, fetchReports)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'daily_sales_summary' }, fetchReports)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [startDate, endDate])

  const updateDateRange = (type) => {
    const today = new Date()
    let start, end

    switch (type) {
      case 'daily':
        start = end = format(today, 'yyyy-MM-dd')
        break
      case 'weekly':
        start = format(startOfWeek(today), 'yyyy-MM-dd')
        end = format(endOfWeek(today), 'yyyy-MM-dd')
        break
      case 'monthly':
        start = format(startOfMonth(today), 'yyyy-MM-dd')
        end = format(endOfMonth(today), 'yyyy-MM-dd')
        break
      default:
        start = end = format(today, 'yyyy-MM-dd')
    }

    setStartDate(start)
    setEndDate(end)
  }

  const fetchReports = async () => {
    try {
      setLoading(true)
      setError(null)

      const start = new Date(startDate)
      start.setHours(0, 0, 0, 0)
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)

      const { data: summaryRows, error: summaryError } = await supabase
        .from('daily_sales_summary')
        .select('date, total_revenue, total_orders')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date')

      if (summaryError) throw summaryError

      const totalRevenue = (summaryRows || []).reduce((s, r) => s + (r.total_revenue || 0), 0)
      const totalOrders = (summaryRows || []).reduce((s, r) => s + (r.total_orders || 0), 0)
      const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0

      const dailyBreakdown = (summaryRows || []).map(r => ({
        date: format(new Date(r.date), 'MMM dd'),
        revenue: r.total_revenue || 0,
        orders: r.total_orders || 0
      }))

      const { data: itemRows, error: itemsError } = await supabase
        .from('order_items')
        .select('item_name, quantity, price, subtotal, created_at')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())

      if (itemsError) throw itemsError

      const byItem = {}
      ;(itemRows || []).forEach(row => {
        const key = row.item_name || 'Unknown'
        const qty = Number(row.quantity || 0)
        const revenue = Number(row.subtotal || (row.price || 0) * qty)
        if (!byItem[key]) byItem[key] = { name: key, quantity: 0, revenue: 0 }
        byItem[key].quantity += qty
        byItem[key].revenue += revenue
      })

      const itemWiseSales = Object.values(byItem)
        .sort((a, b) => b.revenue - a.revenue)

      setReportData({
        summary: { totalRevenue, totalOrders, avgOrderValue },
        itemWiseSales,
        dailyBreakdown
      })
    } catch (err) {
      console.error('Failed to load reports:', err)
      setError('Unable to load reports data.')
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const csvContent = [
      ['Item Name', 'Quantity Sold', 'Revenue'],
      ...reportData.itemWiseSales.map(item => [
        convertToTamil(item.name),
        item.quantity.toFixed(2),
        item.revenue.toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sales-report-${startDate}-to-${endDate}.csv`
    a.click()
  }

  const COLORS = ['#f58700', '#2563eb', '#10b981', '#ef4444', '#8b5cf6', '#f59e0b', '#06b6d4', '#ec4899']

  return (
    <div className="space-y-6">
      {error && (
        <div className="card bg-red-50 text-red-700 p-3">{error}</div>
      )}

      {/* Report Controls */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="input-field"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={exportToCSV}
              disabled={reportData.itemWiseSales.length === 0}
              className="btn-primary w-full flex items-center justify-center disabled:opacity-50"
            >
              <Download className="w-5 h-5 mr-2" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading report data...</div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
              <h4 className="text-sm font-medium text-green-100 mb-2">Total Revenue</h4>
              <p className="text-3xl font-bold">₹{reportData.summary.totalRevenue.toFixed(2)}</p>
            </div>

            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <h4 className="text-sm font-medium text-blue-100 mb-2">Total Orders</h4>
              <p className="text-3xl font-bold">{reportData.summary.totalOrders}</p>
            </div>

            <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <h4 className="text-sm font-medium text-purple-100 mb-2">Avg Order Value</h4>
              <p className="text-3xl font-bold">
                ₹{reportData.summary.avgOrderValue.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Charts */}
          {reportData.itemWiseSales.length > 0 && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue by Item Chart */}
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Revenue by Item</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportData.itemWiseSales.slice(0, 10).map(item => ({
                      ...item,
                      tamilName: convertToTamil(item.name)
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tamilName" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                        formatter={(value) => `₹${value.toFixed(2)}`}
                        labelFormatter={(label) => `Item: ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="#f58700" name="Revenue (₹)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Sales Distribution Pie Chart */}
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Sales Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={reportData.itemWiseSales.slice(0, 8).map(item => ({
                          ...item,
                          tamilName: convertToTamil(item.name)
                        }))}
                        dataKey="revenue"
                        nameKey="tamilName"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(entry) => `${entry.tamilName}: ₹${entry.revenue.toFixed(0)}`}
                      >
                        {reportData.itemWiseSales.slice(0, 8).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                        formatter={(value) => `₹${value.toFixed(2)}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Daily Breakdown Chart */}
              {reportData.dailyBreakdown.length > 1 && (
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Daily Breakdown</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportData.dailyBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="revenue" fill="#f58700" name="Revenue (₹)" />
                      <Bar yAxisId="right" dataKey="orders" fill="#2563eb" name="Orders" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Item-wise Sales Table */}
              <div className="card overflow-x-auto">
                <h3 className="text-lg font-semibold mb-4">Item-wise Sales Details</h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Item Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Quantity Sold
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        % of Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.itemWiseSales.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{convertToTamil(item.name)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.quantity.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            ₹{item.revenue.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {((item.revenue / reportData.summary.totalRevenue) * 100).toFixed(1)}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {reportData.itemWiseSales.length === 0 && (
            <div className="card text-center py-12">
              <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No sales data found for the selected period</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
