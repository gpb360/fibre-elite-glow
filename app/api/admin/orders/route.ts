import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
}

function verifyAdmin(request: Request): boolean {
  const authHeader = request.headers.get('x-admin-auth');
  return authHeader === 'true';
}

// GET /api/admin/orders — fetch orders from Supabase with Stripe metadata
export async function GET(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('orders')
      .select('*, order_items(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`order_number.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: orders, error, count } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    // Compute stats
    const { data: statsData } = await supabase
      .from('orders')
      .select('status, total_amount, payment_status, created_at');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = {
      totalOrders: statsData?.length || 0,
      todayOrders: statsData?.filter(o => new Date(o.created_at!) >= today).length || 0,
      todayRevenue: statsData
        ?.filter(o => new Date(o.created_at!) >= today && o.payment_status === 'paid')
        .reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0,
      totalRevenue: statsData
        ?.filter(o => o.payment_status === 'paid')
        .reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0,
      pendingOrders: statsData?.filter(o => o.status === 'pending').length || 0,
      processingOrders: statsData?.filter(o => o.status === 'processing').length || 0,
    };

    return NextResponse.json({
      orders: orders || [],
      total: count || 0,
      page,
      limit,
      stats,
    });
  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/orders — update order status
export async function PATCH(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { orderId, status, trackingNumber, notes } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (trackingNumber !== undefined) updateData.tracking_number = trackingNumber;
    if (notes !== undefined) updateData.notes = notes;
    if (status === 'shipped') updateData.shipped_at = new Date().toISOString();
    if (status === 'delivered') updateData.delivered_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    return NextResponse.json({ order: data });
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
