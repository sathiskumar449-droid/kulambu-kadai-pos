// api/supabaseProxy/orders.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL),
  (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)
)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      total_amount,
      payment_method,
      created_at,
      order_items (
        item_name,
        quantity,
        price,
        subtotal
      )
    `)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.status(200).json(data)
}