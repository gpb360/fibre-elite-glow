import { NextResponse } from 'next/server';
import { simpleEmailService } from '@/lib/simple-email-service';

export async function POST(request: Request) {
  try {
    console.log('📧 Testing email configuration with simple email service...');

    const { customerEmail, customerName } = await request.json();

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Customer email is required' },
        { status: 400 }
      );
    }

    // Prepare test order data
    const orderNumber = `TEST-${Date.now()}`;
    const testItems = [{
      name: 'La Belle Vie - Total Essential',
      quantity: 1,
      price: 79.99
    }];

    // Test customer confirmation email
    console.log(`Testing order confirmation to: ${customerEmail}`);
    const orderResult = await simpleEmailService.sendOrderConfirmation({
      orderNumber,
      customerEmail,
      customerName: customerName || 'Test Customer',
      items: testItems,
      totalAmount: 79.99,
      currency: 'USD',
      shippingAddress: {
        firstName: customerName?.split(' ')[0] || 'Test',
        lastName: customerName?.split(' ').slice(1).join(' ') || 'Customer',
        addressLine1: '123 Test Street',
        city: 'Test City',
        state: 'TS',
        postalCode: '12345',
        country: 'US'
      }
    });

    // Test admin notification email
    console.log(`Testing admin notification for order: ${orderNumber}`);
    const adminResult = await simpleEmailService.sendAdminNotification({
      orderNumber,
      customerEmail,
      customerName: customerName || 'Test Customer',
      items: testItems,
      totalAmount: 79.99,
      currency: 'USD',
      shippingAddress: {
        firstName: customerName?.split(' ')[0] || 'Test',
        lastName: customerName?.split(' ').slice(1).join(' ') || 'Customer',
        addressLine1: '123 Test Street',
        city: 'Test City',
        state: 'TS',
        postalCode: '12345',
        country: 'US'
      },
      paymentIntentId: 'pi_test_12345'
    });

    console.log(`Test results - Order: ${orderResult}, Admin: ${adminResult}`);

    return NextResponse.json({
      success: true,
      message: `Email test completed for ${customerEmail}`,
      orderNumber,
      results: {
        orderConfirmation: orderResult,
        adminNotification: adminResult
      },
      details: {
        customerEmail,
        orderNumber,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email test endpoint using simple email service',
    usage: 'POST /api/test-email with { customerEmail, customerName }',
    note: 'In development, customer emails are redirected to garypboyd@gmail.com'
  });
}