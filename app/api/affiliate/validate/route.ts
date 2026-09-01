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
