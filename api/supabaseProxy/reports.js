export default async function handler(req, res) {
  try {
    const { start, end, shift } = req.query;

    if (!start || !end) {
      return res.status(400).json({ error: 'Start and end dates are required' });
    }

    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    // Ensure dependencies are dynamically imported in this serverless environment
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Key must be provided in environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Fetch Orders within date range
    let { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('id, order_number, status, total_amount, payment_method, created_at, order_items (item_name, quantity, price, subtotal)')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false });

    // Fallback if payment_method doesn't exist
    if (ordersError && ordersError.message.includes('payment_method')) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('orders')
        .select('id, order_number, status, total_amount, created_at, order_items (item_name, quantity, price, subtotal)')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

      if (fallbackError) throw fallbackError;
      ordersData = fallbackData;
    } else if (ordersError) {
      throw ordersError;
    }

    // 2. Fetch Daily Sales Summary within date range
    const { data: summaryRows, error: summaryError } = await supabase
      .from('daily_sales_summary')
      .select('date, total_revenue, total_orders')
      .gte('date', start)
      .lte('date', end)
      .order('date');

    if (summaryError) throw summaryError;

    res.status(200).json({ ordersData, summaryRows });
  } catch (error) {
    console.error('API Error /reports:', error);
    res.status(500).json({ error: error.message });
  }
}