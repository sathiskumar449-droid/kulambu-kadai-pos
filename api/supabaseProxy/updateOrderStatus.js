export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ error: 'Missing id or status' });
    }

    // Ensure dependencies are dynamically imported in this serverless environment
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Key must be provided in environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: status.toUpperCase() })
      .eq('id', id);

    if (updateError) throw updateError;

    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('API Error /updateOrderStatus:', error);
    res.status(500).json({ error: error.message });
  }
}