import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/integrations/supabase/admin';
import { verifyAdminRequest } from '@/lib/admin-auth';

// Authenticated on-demand summary for the admin dashboard.
export async function GET(request: Request) {
  try {
    if (!verifyAdminRequest(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database unavailable' },
        { status: 500 }
      );
    }

    // Get date range for today
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Fetch today's orders
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (
          product_name,
          quantity,
          unit_price
        )
      `)
      .gte('created_at', startOfDay.toISOString())
      .lt('created_at', endOfDay.toISOString())
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching daily orders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    if (!orders || orders.length === 0) {
      console.log('No orders found for today');
      return NextResponse.json({ 
        message: 'No orders today', 
        orders: 0, 
        revenue: 0 
      });
    }

    const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);

    // Daily summary email functionality removed for simplicity
    console.log(`📈 Daily summary: ${orders.length} orders, ${totalRevenue} ${orders[0]?.currency || 'USD'} revenue`);

    return NextResponse.json({
      message: 'Daily summary retrieved successfully',
      orders: orders.length,
      revenue: totalRevenue,
      currency: orders[0]?.currency || 'USD'
    });

  } catch (error) {
    console.error('Error generating daily summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate daily summary' },
      { status: 500 }
    );
  }
}
