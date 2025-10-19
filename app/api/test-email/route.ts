import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/integrations/supabase/client';

export async function POST(request: Request) {
  try {
    const { customerEmail, customerName } = await request.json();

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Customer email is required' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      );
    }

    // Prepare test order data
    const orderNumber = `TEST-${Date.now()}`;

    const emailData = {
      type: 'order_confirmation',
      data: {
        customerEmail,
        customerName: customerName || 'Test Customer',
        orderNumber,
        orderDate: new Date().toLocaleDateString(),
        totalAmount: '79.99',
        items: [
          {
            description: 'La Belle Vie - Total Essential',
            quantity: 1,
            amount: '79.99'
          }
        ]
      }
    };

    // Also send admin notification
    const adminEmailData = {
      type: 'admin_notification',
      data: {
        customerEmail,
        customerName: customerName || 'Test Customer',
        orderNumber,
        totalAmount: '79.99',
        items: [
          {
            description: 'La Belle Vie - Total Essential',
            quantity: 1,
            amount: '79.99'
          }
        ],
        stripePaymentId: 'test_payment_intent_id'
      }
    };

    // Send customer confirmation email
    const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to send test email:', errorData);
      return NextResponse.json(
        { error: 'Failed to send test email', details: errorData },
        { status: 500 }
      );
    }

    const result = await response.json();

    // Send admin notification
    const adminResponse = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminEmailData),
    });

    const adminResult = adminResponse.ok ? await adminResponse.json() : { error: 'Failed to send admin email' };

    return NextResponse.json({
      success: true,
      message: `Test order confirmation email sent to ${customerEmail}`,
      orderNumber,
      customerEmailResult: result,
      adminEmailResult: adminResult
    });

  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}