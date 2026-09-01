import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// GET /api/testimonials — fetch approved testimonials for public display
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn('Testimonials database is not configured; returning the public fallback set.');
      return NextResponse.json({ testimonials: [], count: 0, fallback: true });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: testimonials, error } = await supabase
      .from('testimonials')
      .select('id, name, product, rating, review, verified, featured, created_at')
      .eq('status', 'approved')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      // If table doesn't exist, return empty array instead of error
      if (error.code === '42P01') {
        console.warn('Testimonials table does not exist yet. Returning fallback data.');
        return NextResponse.json({ testimonials: [], fallback: true });
      }
      console.warn('Testimonials database is unavailable; returning the public fallback set.', {
        code: error.code,
      });
      return NextResponse.json({ testimonials: [], count: 0, fallback: true });
    }

    return NextResponse.json({
      testimonials: testimonials || [],
      count: testimonials?.length || 0,
    });
  } catch (error) {
    console.warn(
      'Testimonials database request failed; returning the public fallback set.',
      error instanceof Error ? error.message : 'Unknown error'
    );
    return NextResponse.json({ testimonials: [], count: 0, fallback: true });
  }
}
