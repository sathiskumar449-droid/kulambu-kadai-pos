import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { start, end, shift = 'all' } = req.query

    const startDate = new Date(start)
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(end)
    endDate.setHours(23, 59, 59, 999)

    let { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('id, order_number, status, total_amount, payment_method, created_at, order_items (item_name, quantity, price, subtotal)')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false })

    if (ordersError && ordersError.message?.includes('payment_method')) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('orders')
        .select('id, order_number, status, total_amount, created_at, order_items (item_name, quantity, price, subtotal)')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false })

      if (fallbackError) throw fallbackError
      ordersData = fallbackData
    } else if (ordersError) {
      throw ordersError
    }

    // Shift calculation
    let shift1 = { orders: 0, revenue: 0, items: [] }
    let shift2 = { orders: 0, revenue: 0, items: [] }

    ;(ordersData || []).forEach(order => {
      const hour = new Date(order.created_at).getHours()
      const isShift1 = hour < 17
      const revenue = order.total_amount || 0

      if (isShift1) {
        shift1.orders++
        shift1.revenue += revenue
        if (order.order_items) shift1.items.push(...order.order_items)
      } else {
        shift2.orders++
        shift2.revenue += revenue
        if (order.order_items) shift2.items.push(...order.order_items)
      }
    })

    let totalRevenue = 0
    let totalOrders = 0

    if (shift === 'shift1') {
      totalRevenue = shift1.revenue
      totalOrders = shift1.orders
    } else if (shift === 'shift2') {
      totalRevenue = shift2.revenue
      totalOrders = shift2.orders
    } else {
      totalRevenue = shift1.revenue + shift2.revenue
      totalOrders = shift1.orders + shift2.orders
    }

    const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0

    // Item-wise aggregation
    const byItem = {}
    const itemsToProcess =
      shift === 'shift1' ? shift1.items : shift === 'shift2' ? shift2.items : [...shift1.items, ...shift2.items]

    ;(itemsToProcess || []).forEach(row => {
      const key = row.item_name || 'Unknown'
      const qty = Number(row.quantity || 0)
      const revenue = Number(row.subtotal || (row.price || 0) * qty)
      if (!byItem[key]) byItem[key] = { name: key, quantity: 0, revenue: 0 }
      byItem[key].quantity += qty
      byItem[key].revenue += revenue
    })

    const itemWiseSales = Object.values(byItem).sort((a, b) => b.revenue - a.revenue)

    return res.status(200).json({
      summary: { totalRevenue, totalOrders, avgOrderValue },
      itemWiseSales,
      dailyBreakdown: [], // optional
      shift1: { orders: shift1.orders, revenue: shift1.revenue },
      shift2: { orders: shift2.orders, revenue: shift2.revenue },
      ordersDetail: ordersData || []
    })
  } catch (err) {
    console.error('Reports API error:', err)
    return res.status(500).json({ error: err.message || 'Failed to load reports' })
  }
}