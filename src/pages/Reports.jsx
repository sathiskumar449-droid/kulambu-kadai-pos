import { useState, useEffect } from 'react'
import { Calendar, Download } from 'lucide-react'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { convertToTamil } from '../lib/tamilTranslations'

export default function Reports() {
  const [reportType, setReportType] = useState('daily')
  const [shiftFilter, setShiftFilter] = useState('all')
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [reportData, setReportData] = useState({
    summary: { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
    itemWiseSales: [],
    dailyBreakdown: [],
    shift1: { orders: 0, revenue: 0 },
    shift2: { orders: 0, revenue: 0 },
    ordersDetail: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    updateDateRange(reportType)
  }, [reportType])

  useEffect(() => {
    fetchReports()
  }, [startDate, endDate, shiftFilter])

  const updateDateRange = (type) => {
    const today = new Date()
    let start, end

    if (type === 'weekly') {
      start = format(startOfWeek(today), 'yyyy-MM-dd')
      end = format(endOfWeek(today), 'yyyy-MM-dd')
    } else if (type === 'monthly') {
      start = format(startOfMonth(today), 'yyyy-MM-dd')
      end = format(endOfMonth(today), 'yyyy-MM-dd')
    } else {
      start = end = format(today, 'yyyy-MM-dd')
    }

    setStartDate(start)
    setEndDate(end)
  }

  const fetchReports = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`/api/supabaseProxy/reports?start=${startDate}&end=${endDate}&shift=${shiftFilter}`)
      if (!res.ok) throw new Error('Report API failed')
      const data = await res.json()
      setReportData(data)
    } catch (err) {
      console.error(err)
      setError('Unable to load reports data.')
    } finally {
      setLoading(false)
    }
  }

  const exportSoldItemsReport = () => {
    const rows = [
      ['Item Name (Tamil)', 'Quantity', 'Revenue (₹)'],
      ...reportData.itemWiseSales.map(item => [
        convertToTamil(item.name),
        item.quantity,
        item.revenue.toFixed(2)
      ])
    ]

    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sales-report-${startDate}-to-${endDate}.csv`
    a.click()
  }

  const COLORS = ['#f58700', '#2563eb', '#10b981', '#ef4444', '#8b5cf6', '#f59e0b']

  return (
    <div className="space-y-6">
      {error && <div className="card bg-red-50 text-red-700 p-3">{error}</div>}

      {/* Controls */}
      <div className="card grid grid-cols-1 md:grid-cols-5 gap-4">
        <select value={reportType} onChange={e => setReportType(e.target.value)} className="input-field">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <select value={shiftFilter} onChange={e => setShiftFilter(e.target.value)} className="input-field">
          <option value="all">All Shifts</option>
          <option value="shift1">Shift 1</option>
          <option value="shift2">Shift 2</option>
        </select>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input-field" />
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="input-field" />
        <button onClick={exportSoldItemsReport} className="btn-primary flex items-center justify-center">
          <Download size={16} className="mr-2" /> Export
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading report…</div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card bg-green-600 text-white">Revenue ₹{reportData.summary.totalRevenue.toFixed(0)}</div>
            <div className="card bg-blue-600 text-white">Orders {reportData.summary.totalOrders}</div>
            <div className="card bg-purple-600 text-white">Avg ₹{reportData.summary.avgOrderValue.toFixed(0)}</div>
          </div>

          {/* Charts */}
          {reportData.itemWiseSales.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.itemWiseSales.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tickFormatter={convertToTamil} />
                  <YAxis />
                  <Tooltip formatter={v => `₹${v}`} />
                  <Bar dataKey="revenue" fill="#f58700" />
                </BarChart>
              </ResponsiveContainer>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={reportData.itemWiseSales.slice(0, 6)} dataKey="revenue" nameKey="name" outerRadius={100}>
                    {reportData.itemWiseSales.slice(0, 6).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {reportData.itemWiseSales.length === 0 && (
            <div className="card text-center py-12">
              <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No sales data found</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}