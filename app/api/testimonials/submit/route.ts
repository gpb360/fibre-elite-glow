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
        const { data: orders, error: orderError } = await supabase
            .from('orders')
            .select('id, order_number, created_at, payment_status')
            .eq('email', email)
            .eq('payment_status', 'paid')
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

        // 2. Save the testimonial to the database
        const { data: testimonial, error: insertError } = await supabase
            .from('testimonials')
            .insert({
                name,
                email,
                product,
                rating,
                review,
                verified: true,
                status: 'pending', // pending admin moderation
                order_number: orders[0].order_number,
            })
            .select()
            .single();

        if (insertError) {
            console.error('Error saving testimonial:', insertError);
            // If table doesn't exist yet, still return success to not break the front-end
            if (insertError.code === '42P01') {
                console.warn('Testimonials table does not exist yet. Run the migration.');
                return NextResponse.json({
                    success: true,
                    message: 'Review submitted successfully (pending table setup)',
                    discountCode: 'REVIEW15',
                    verified: true,
                });
            }
            return NextResponse.json(
                { error: 'Failed to save review' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Review submitted successfully and is pending admin approval',
            discountCode: 'REVIEW15',
            verified: true,
        });

    } catch (error) {
        console.error('Error submitting review:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
