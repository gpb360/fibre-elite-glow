import { NextResponse } from 'next/server';

// Simple test endpoint to verify webhook accessibility
export async function POST(request: Request) {
  try {
    console.log('🎯 Webhook test endpoint hit!');

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    console.log('📝 Webhook test details:', {
      hasBody: !!body,
      bodyLength: body.length,
      hasSignature: !!signature,
      signatureLength: signature?.length,
      contentType: request.headers.get('content-type'),
      userAgent: request.headers.get('user-agent')
    });

    // Check if this looks like a real Stripe webhook
    if (signature && body.includes('checkout.session.completed')) {
      console.log('✅ This appears to be a genuine Stripe checkout webhook');

      // Try to parse the event
      try {
        const event = JSON.parse(body);
        console.log('📊 Stripe event details:', {
          type: event.type,
          id: event.id,
          created: new Date(event.created * 1000).toISOString(),
          hasCheckoutSession: !!event.data.object,
          sessionId: event.data.object?.id
        });
      } catch (parseError) {
        console.error('❌ Failed to parse Stripe webhook JSON:', parseError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook test endpoint received the request',
      timestamp: new Date().toISOString(),
      details: {
        hasBody: !!body,
        hasSignature: !!signature,
        bodyPreview: body.substring(0, 200) + (body.length > 200 ? '...' : '')
      }
    });

  } catch (error) {
    console.error('❌ Webhook test endpoint error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}