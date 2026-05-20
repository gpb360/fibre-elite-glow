import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// GET /api/testimonials — fetch approved testimonials for public display
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
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
      console.error('Error fetching testimonials:', error);
      return NextResponse.json(
        { error: 'Failed to fetch testimonials' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      testimonials: testimonials || [],
      count: testimonials?.length || 0,
    });
  } catch (error) {
    console.error('Testimonials fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
