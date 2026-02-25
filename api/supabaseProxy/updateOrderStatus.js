import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { id, status } = req.body
    if (!id || !status) return res.status(400).json({ error: 'Missing id or status' })

    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)

    if (error) throw error

    res.status(200).json({ success: true })
  } catch (err) {
    console.error('Update status failed:', err)
    res.status(500).json({ error: err.message || 'Update failed' })
  }
}