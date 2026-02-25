import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL),
  (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'Missing id' })

    // delete order items first (FK safety)
    await supabase.from('order_items').delete().eq('order_id', id)
    const { error } = await supabase.from('orders').delete().eq('id', id)
    if (error) throw error

    res.status(200).json({ success: true })
  } catch (err) {
    console.error('Delete order failed:', err)
    res.status(500).json({ error: err.message || 'Delete failed' })
  }
}