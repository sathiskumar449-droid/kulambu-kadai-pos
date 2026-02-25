export default async function handler(req, res) {
  try {
    const supabaseUrl = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)
    const serviceKey = (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)

    if (!supabaseUrl || !serviceKey) {
      return res.status(500).json({ error: 'Missing Supabase env vars' })
    }

    let url = `${supabaseUrl}/rest/v1/menu_items`
    if (req.method === 'GET') {
      const query = req.url.split('?')[1] || ''
      if (query) url += `?${query}`
    } else if (req.method === 'PUT' || req.method === 'DELETE') {
      const id = req.body?.id
      if (!id) return res.status(400).json({ error: 'Missing id for update/delete' })
      url += `?id=eq.${id}`
    }

    const options = {
      method: req.method,
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    }

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      if (req.method === 'PUT') {
        const { id, ...updateData } = req.body;
        options.body = JSON.stringify(updateData);
      } else {
        options.body = JSON.stringify(req.body);
      }
    }

    const response = await fetch(url, options)

    // For 204 No Content
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