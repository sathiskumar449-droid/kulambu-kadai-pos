import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceKey) {
      return res.status(500).json({ error: 'Missing Supabase env vars' })
    }

    const query = req.url.split('?')[1] || ''
    const url = `${supabaseUrl}/rest/v1/order_items?${query}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    return res.status(response.status).json(data)
  } catch (err) {
    console.error('order_items proxy error:', err)
    return res.status(500).json({ error: 'Proxy failed', details: err.message })
  }
}