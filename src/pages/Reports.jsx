import { useState, useEffect } from 'react'
import { Calendar, Download, TrendingUp } from 'lucide-react'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

// Mock report data
const MOCK_REPORT_DATA = {
  summary: { totalRevenue: 12500, totalOrders: 28, avgOrderValue: 446.43 },
  itemWiseSales: [
    { name: 'Sambar', quantity: 15, revenue: 1800 },
    { name: 'Rasam', quantity: 12, revenue: 1200 },
    { name: 'Vaghali', quantity: 10, revenue: 1400 },
    { name: 'Curd Rice', quantity: 8, revenue: 720 },
    { name: 'Lemon Rice', quantity: 6, revenue: 510 },
    { name: 'Butter Rice', quantity: 5, revenue: 475 },
    { name: 'Ghee Puri', quantity: 18, revenue: 720 },
    { name: 'Chappati', quantity: 20, revenue: 600 }
  ],
  dailyBreakdown: [
    { date: 'Jan 16', revenue: 9500, orders: 22 },
    { date: 'Jan 17', revenue: 10200, orders: 24 },
    { date: 'Jan 18', revenue: 11000, orders: 26 },
    { date: 'Jan 19', revenue: 10800, orders: 25 },
    { date: 'Jan 20', revenue: 12000, orders: 27 },
    { date: 'Jan 21', revenue: 12300, orders: 28 },
    { date: 'Jan 22', revenue: 12500, orders: 28 }
  ]
}

export default function Reports() {
  const [reportType, setReportType] = useState('daily')
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [reportData, setReportData] = useState(MOCK_REPORT_DATA)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    updateDateRange(reportType)
  }, [reportType])

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
    setReportData(MOCK_REPORT_DATA)
  }

  const exportToCSV = () => {
    const csvContent = [
      ['Item Name', 'Quantity Sold', 'Revenue'],
      ...reportData.itemWiseSales.map(item => [
        item.name,
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
                    <BarChart data={reportData.itemWiseSales.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
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
                        data={reportData.itemWiseSales.slice(0, 8)}
                        dataKey="revenue"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(entry) => `${entry.name}: ₹${entry.revenue.toFixed(0)}`}
                      >
                        {reportData.itemWiseSales.slice(0, 8).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
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
                          <div className="font-medium text-gray-900">{item.name}</div>
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
