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

// GET /api/admin/testimonials — fetch all testimonials for admin
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
    const status = searchParams.get('status');

    let query = supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching testimonials:', error);
      return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
    }

    // Get stats
    const all = data || [];
    const stats = {
      total: all.length,
      pending: all.filter(t => t.status === 'pending').length,
      approved: all.filter(t => t.status === 'approved').length,
      rejected: all.filter(t => t.status === 'rejected').length,
      verified: all.filter(t => t.verified).length,
    };

    return NextResponse.json({ testimonials: data || [], stats });
  } catch (error) {
    console.error('Testimonials API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/testimonials — create testimonial (admin)
export async function POST(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { name, email, product, rating, review, status: tStatus, verified, featured } = body;

    if (!name || !email || !product || !rating || !review) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify purchase if requested
    let isVerified = verified || false;
    let orderNumber = null;

    if (!isVerified) {
      const { data: orders } = await supabase
        .from('orders')
        .select('id, order_number, payment_status')
        .eq('email', email)
        .eq('payment_status', 'paid')
        .limit(1);

      if (orders && orders.length > 0) {
        isVerified = true;
        orderNumber = orders[0].order_number;
      }
    }

    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        name,
        email,
        product,
        rating,
        review,
        verified: isVerified,
        status: tStatus || 'pending',
        order_number: orderNumber,
        featured: featured || false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating testimonial:', error);
      return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
    }

    return NextResponse.json({ testimonial: data });
  } catch (error) {
    console.error('Testimonial create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/testimonials — update testimonial
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
    const { id, status, admin_notes, featured, verified } = body;

    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID required' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (admin_notes !== undefined) updateData.admin_notes = admin_notes;
    if (featured !== undefined) updateData.featured = featured;
    if (verified !== undefined) updateData.verified = verified;

    const { data, error } = await supabase
      .from('testimonials')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating testimonial:', error);
      return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
    }

    return NextResponse.json({ testimonial: data });
  } catch (error) {
    console.error('Testimonial update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/testimonials — delete testimonial
export async function DELETE(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting testimonial:', error);
      return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Testimonial delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
