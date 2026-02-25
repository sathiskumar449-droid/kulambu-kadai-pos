export default async function handler(req, res) {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ error: 'Date parameter is required' });
        }

        // Ensure dependencies are dynamically imported in this serverless environment
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
        const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase URL and Key must be provided in environment variables');
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // 1. Fetch menu items
        const { data: items, error: itemsError } = await supabase
            .from('menu_items')
            .select('id, name, price, unit, daily_stock_quantity')
            .order('created_at');

        if (itemsError) throw itemsError;

        // 2. Fetch stock logs for the given date
        const { data: stockLogs, error: logsError } = await supabase
            .from('stock_logs')
            .select('menu_item_id, prepared_quantity, remaining_quantity')
            .eq('date', date);

        if (logsError) throw logsError;

        res.status(200).json({ items, stockLogs });
    } catch (error) {
        console.error('API Error /stock:', error);
        res.status(500).json({ error: error.message });
    }
}
