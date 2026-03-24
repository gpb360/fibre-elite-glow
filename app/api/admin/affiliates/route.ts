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

function generateAffiliateCode(name: string): string {
  const clean = name.replace(/[^a-zA-Z]/g, '').toUpperCase().substring(0, 4);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${clean}${random}`;
}

// GET /api/admin/affiliates — fetch all affiliates + their sales
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
    const affiliateId = searchParams.get('id');

    // Single affiliate with sales detail
    if (affiliateId) {
      const { data: affiliate, error: affErr } = await supabase
        .from('affiliates')
        .select('*')
        .eq('id', affiliateId)
        .single();

      if (affErr) {
        return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 });
      }

      const { data: sales } = await supabase
        .from('affiliate_sales')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .order('created_at', { ascending: false });

      return NextResponse.json({ affiliate, sales: sales || [] });
    }

    // All affiliates
    const { data: affiliates, error } = await supabase
      .from('affiliates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching affiliates:', error);
      return NextResponse.json({ error: 'Failed to fetch affiliates' }, { status: 500 });
    }

    const all = affiliates || [];
    const stats = {
      total: all.length,
      active: all.filter(a => a.is_active).length,
      totalSales: all.reduce((sum, a) => sum + (a.total_sales || 0), 0),
      totalCommission: all.reduce((sum, a) => sum + (a.total_commission || 0), 0),
    };

    return NextResponse.json({ affiliates: all, stats });
  } catch (error) {
    console.error('Affiliates API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/affiliates — create affiliate
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
    const { name, email, commission_percent, affiliate_code, notes } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Check for existing affiliate with same email
    const { data: existing } = await supabase
      .from('affiliates')
      .select('id')
      .eq('email', email)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'An affiliate with this email already exists' }, { status: 409 });
    }

    const code = affiliate_code || generateAffiliateCode(name);

    const { data, error } = await supabase
      .from('affiliates')
      .insert({
        name,
        email,
        affiliate_code: code,
        commission_percent: commission_percent || 10,
        notes: notes || null,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating affiliate:', error);
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Affiliate code already exists. Try a different code.' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to create affiliate' }, { status: 500 });
    }

    return NextResponse.json({ affiliate: data });
  } catch (error) {
    console.error('Affiliate create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/affiliates — update affiliate
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
    const { id, name, email, commission_percent, is_active, notes, affiliate_code } = body;

    if (!id) {
      return NextResponse.json({ error: 'Affiliate ID required' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (commission_percent !== undefined) updateData.commission_percent = commission_percent;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (notes !== undefined) updateData.notes = notes;
    if (affiliate_code !== undefined) updateData.affiliate_code = affiliate_code;

    const { data, error } = await supabase
      .from('affiliates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating affiliate:', error);
      return NextResponse.json({ error: 'Failed to update affiliate' }, { status: 500 });
    }

    return NextResponse.json({ affiliate: data });
  } catch (error) {
    console.error('Affiliate update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/affiliates — delete affiliate
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
      return NextResponse.json({ error: 'Affiliate ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('affiliates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting affiliate:', error);
      return NextResponse.json({ error: 'Failed to delete affiliate' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Affiliate delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
