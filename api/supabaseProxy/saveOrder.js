import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
        const serviceKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl || !serviceKey) {
            return res.status(500).json({ error: 'Missing Supabase credentials' })
        }

        const supabase = createClient(supabaseUrl, serviceKey)
        const { total_amount, payment_method, items, cart, total } = req.body

        const amount = Number(total_amount || total)
        const itemsList = items || cart || []

        // Generate Order Number
        const now = new Date()
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
        const randomStr = Math.floor(1000 + Math.random() * 9000).toString()
        const orderNumber = `ORD-${dateStr}-${randomStr}`

        // Create Order
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
                order_number: orderNumber,
                total_amount: amount,
                payment_method: payment_method || 'cash',
                status: 'completed'
            })
            .select('id, order_number')
            .single()

        if (orderError) throw orderError

        // Create Order Items
        const orderItems = itemsList.map(item => ({
            order_id: orderData.id,
            menu_item_id: item.id || null,
            item_name: item.name,
            quantity: Number(item.quantity),
            price: Number(item.price),
            subtotal: Number(item.price) * Number(item.quantity)
        }))

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems)

        if (itemsError) throw itemsError

        return res.status(200).json({ success: true, order_number: orderData.order_number })
    } catch (err) {
        console.error('saveOrder error:', err)
        return res.status(500).json({ error: err.message })
    }
}
