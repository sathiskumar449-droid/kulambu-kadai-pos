export default async function handler(req, res) {
  try {
    const supabaseUrl = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)
    const serviceKey = (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)

    if (!supabaseUrl || !serviceKey) {
      return res.status(500).json({ error: 'Missing Supabase env vars' })
    }

    const query = req.url.split('?')[1] || ''
    const url = `${supabaseUrl}/rest/v1/stock_logs?${query}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json'
      }
    })

    const text = await response.text()

    if (!response.ok) {
      return res.status(response.status).json({ error: text })
    }

    const data = JSON.parse(text)
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}