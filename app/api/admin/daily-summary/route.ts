import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/integrations/supabase/client';
import { emailService } from '@/lib/email-service';

// API route for daily admin summary (can be triggered by cron)
export async function GET(request: Request) {
  try {
    // Check for authorization (simple API key check)
    const url = new URL(request.url);
    const apiKey = url.searchParams.get('api_key');
    
    if (apiKey !== process.env.ADMIN_API_KEY) {
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

    // Transform orders for email notification
    const adminNotificationData = orders.map(order => ({
      orderNumber: order.order_number,
      customerEmail: order.email,
      customerName: `${order.billing_first_name} ${order.billing_last_name}`.trim(),
      amount: order.total_amount,
      currency: order.currency || 'USD',
      items: (order.order_items || []).map((item: any) => ({
        name: item.product_name,
        quantity: item.quantity,
        price: item.unit_price
      })),
      paymentStatus: order.payment_status || 'pending',
      createdAt: order.created_at || new Date().toISOString(),
    }));

    // Send daily summary email
    await emailService.sendDailyOrderSummary(adminNotificationData);

    const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);

    console.log(`📈 Daily summary sent: ${orders.length} orders, ${totalRevenue} ${orders[0]?.currency || 'USD'} revenue`);

    return NextResponse.json({
      message: 'Daily summary sent successfully',
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

export async function POST(request: Request) {
  // Also support POST for webhook-style triggers
  return GET(request);
}