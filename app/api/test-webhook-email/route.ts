import { NextResponse } from 'next/server';
import { simpleEmailService } from '@/lib/simple-email-service';

// Test endpoint to simulate the exact email sending from a Stripe webhook
export async function GET() {
  try {
    console.log('🧪 Testing webhook email flow...');

    // Simulate the exact data structure that the webhook uses
    const mockOrderData = {
      orderNumber: 'WEBHOOK-TEST-' + Date.now(),
      customerEmail: 'garypboyd@gmail.com', // Using known working email for testing
      customerName: 'Test Customer',
      items: [
        {
          name: 'Total Essential',
          quantity: 1,
          price: 79.99
        }
      ],
      totalAmount: 79.99,
      currency: 'USD',
      customerPhone: '+1-555-0123',
      shippingAddress: {
        firstName: 'Test',
        lastName: 'Customer',
        addressLine1: '123 Test Street',
        addressLine2: 'Apt 4B',
        city: 'Toronto',
        state: 'ON',
        postalCode: 'M5V 2T6',
        country: 'Canada'
      }
    };

    console.log('📧 Sending customer order confirmation...');
    const orderConfirmationSent = await simpleEmailService.sendOrderConfirmation({
      orderNumber: mockOrderData.orderNumber,
      customerEmail: mockOrderData.customerEmail,
      customerName: mockOrderData.customerName,
      items: mockOrderData.items,
      totalAmount: mockOrderData.totalAmount,
      currency: mockOrderData.currency,
      customerPhone: mockOrderData.customerPhone,
      shippingAddress: mockOrderData.shippingAddress
    });

    console.log('📧 Sending admin notification...');
    const adminNotificationSent = await simpleEmailService.sendAdminNotification({
      orderNumber: mockOrderData.orderNumber,
      customerEmail: mockOrderData.customerEmail,
      customerName: mockOrderData.customerName,
      items: mockOrderData.items,
      totalAmount: mockOrderData.totalAmount,
      currency: mockOrderData.currency,
      customerPhone: mockOrderData.customerPhone,
      shippingAddress: mockOrderData.shippingAddress,
      paymentIntentId: 'pi_test_' + Date.now()
    });

    console.log('📊 Webhook email test results:', {
      orderConfirmationSent,
      adminNotificationSent,
      customerEmail: mockOrderData.customerEmail,
      adminEmail: 'admin@lbve.ca'
    });

    return NextResponse.json({
      success: true,
      testOrderNumber: mockOrderData.orderNumber,
      results: {
        orderConfirmationSent,
        adminNotificationSent
      },
      message: 'Webhook email flow test completed. Check console logs for details.',
      note: 'Customer email was sent to test@example.com - in production this would be the actual customer email'
    });

  } catch (error) {
    console.error('❌ Webhook email test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}