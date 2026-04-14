export default async function handler(req, res) {
  try {
    const supabaseUrl = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)
    const serviceKey = (process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)

    if (!supabaseUrl || !serviceKey) {
      return res.status(500).json({ error: 'Missing Supabase env vars' })
    }

    let url = `${supabaseUrl}/rest/v1/orders`
    
    // Pass query params from frontend (handles select, eq, order etc)
    const query = req.url.split('?')[1] || ''
    if (query) {
      url += `?${query}`
    }
    // If no select param was provided on a GET, fallback to the nested one for backwards compat
    if (req.method === 'GET' && !query.includes('select=')) {
      const defaultSelect = `select=id,order_number,status,total_amount,payment_method,created_at,order_items(item_name,quantity,price,subtotal)`
      const defaultOrder = `order=created_at.desc`
      url += (query ? '&' : '?') + `${defaultSelect}&${defaultOrder}`
    }

    const options = {
      method: req.method,
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        'Prefer': req.method === 'POST' ? 'return=representation' : 'return=minimal'
      }
    }

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body && Object.keys(req.body).length > 0) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, options)

    if (response.status === 204) {
      return res.status(204).end();
    }

    const text = await response.text()
    if (!response.ok) {
      return res.status(response.status).json({ error: text || 'Supabase request failed' })
    }

    const data = text ? JSON.parse(text) : {}
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}