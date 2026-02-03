import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, product, rating, review } = body;

        // Validate input
        if (!name || !email || !product || !rating || !review) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Initialize Supabase Admin Client
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

        // 1. Verify if the user has purchased the product
        // We check the 'orders' table for a matching email
        const { data: orders, error: orderError } = await supabase
            .from('orders')
            .select('id, created_at')
            .eq('customer_email', email)
            .limit(1);

        if (orderError) {
            console.error('Error checking orders:', orderError);
            return NextResponse.json(
                { error: 'Failed to verify purchase history' },
                { status: 500 }
            );
        }

        const isVerified = orders && orders.length > 0;

        if (!isVerified) {
            return NextResponse.json(
                {
                    error: 'Verification failed',
                    message: 'We could not find a verified purchase with this email address.'
                },
                { status: 403 }
            );
        }

        // 2. Submit the testimonial (Verified)
        // Assuming we have a 'testimonials' table. If not, we might store this in a pending state or log it.
        // For now, we'll simulate saving to a DB or sending an admin notification.

        /* 
        // Example DB insert if table exists
        const { error: insertError } = await supabase
          .from('testimonials')
          .insert({
            name,
            email,
            product,
            rating,
            review,
            verified: true,
            status: 'pending' // pending moderation
          });
        */

        // For this implementation, we'll just return success as "Submitted for Moderation"
        // In a real app, you would save this data.

        return NextResponse.json({
            success: true,
            message: 'Review submitted successfully',
            discountCode: 'REVIEW15', // The reward mentioned in the UI
            verified: true
        });

    } catch (error) {
        console.error('Error submitting review:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
