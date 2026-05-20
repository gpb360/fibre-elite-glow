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

// GET /api/affiliate/validate?code=XXXX — validate affiliate code at checkout
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code')?.toUpperCase().trim();

  if (!code) {
    return NextResponse.json({ valid: false, error: 'No code provided' }, { status: 400 });
  }

  const supabase = getAdminClient();
  if (!supabase) {
    // Gracefully degrade — don't block checkout if DB unavailable
    return NextResponse.json({ valid: false, error: 'Service unavailable' }, { status: 200 });
  }

  try {
    const { data: affiliate, error } = await supabase
      .from('affiliates')
      .select('id, name, affiliate_code, commission_percent, is_active')
      .eq('affiliate_code', code)
      .eq('is_active', true)
      .single();

    if (error || !affiliate) {
      return NextResponse.json({ valid: false, error: 'Invalid affiliate code' });
    }

    return NextResponse.json({
      valid: true,
      affiliate_code: affiliate.affiliate_code,
      affiliate_name: affiliate.name,
      commission_percent: affiliate.commission_percent,
    });
  } catch (error) {
    console.error('Affiliate validation error:', error);
    return NextResponse.json({ valid: false, error: 'Validation failed' });
  }
}

// POST /api/affiliate/validate — record a sale for an affiliate (called from webhook)
export async function POST(request: Request) {
  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { affiliate_code, order_id, order_number, customer_email, sale_amount } = body;

    if (!affiliate_code || !sale_amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Look up the affiliate
    const { data: affiliate, error: affError } = await supabase
      .from('affiliates')
      .select('id, commission_percent')
      .eq('affiliate_code', affiliate_code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (affError || !affiliate) {
      return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 });
    }

    const commissionAmount = (sale_amount * affiliate.commission_percent) / 100;

    // Create the sale record
    const { error: saleError } = await supabase
      .from('affiliate_sales')
      .insert({
        affiliate_id: affiliate.id,
        order_id: order_id || null,
        order_number: order_number || null,
        customer_email: customer_email || null,
        sale_amount,
        commission_amount: commissionAmount,
        commission_percent: affiliate.commission_percent,
        status: 'pending',
      });

    if (saleError) {
      console.error('Error recording affiliate sale:', saleError);
      return NextResponse.json({ error: 'Failed to record sale' }, { status: 500 });
    }

    // Update affiliate totals
    const { error: updateError } = await supabase.rpc('increment_affiliate_totals', {
      p_affiliate_id: affiliate.id,
      p_sale_amount: sale_amount,
      p_commission_amount: commissionAmount,
    });

    // If the RPC doesn't exist, do a manual update
    if (updateError) {
      const { data: currentAffiliate } = await supabase
        .from('affiliates')
        .select('total_sales, total_commission')
        .eq('id', affiliate.id)
        .single();

      if (currentAffiliate) {
        await supabase
          .from('affiliates')
          .update({
            total_sales: (currentAffiliate.total_sales || 0) + sale_amount,
            total_commission: (currentAffiliate.total_commission || 0) + commissionAmount,
          })
          .eq('id', affiliate.id);
      }
    }

    return NextResponse.json({
      success: true,
      commission_amount: commissionAmount,
      commission_percent: affiliate.commission_percent,
    });
  } catch (error) {
    console.error('Affiliate sale recording error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
