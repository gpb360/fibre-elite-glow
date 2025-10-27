import { NextResponse } from 'next/server';
import { simpleEmailService } from '@/lib/simple-email-service';

export async function GET() {
  try {
    console.log('📧 Testing new simple email service...');

    // Test order confirmation email
    const orderConfirmationResult = await simpleEmailService.sendOrderConfirmation({
      orderNumber: 'TEST-123456',
      customerEmail: 'garypboyd@gmail.com',
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
      shippingAddress: {
        firstName: 'Test',
        lastName: 'Customer',
        addressLine1: '123 Test Street',
        city: 'Toronto',
        state: 'ON',
        postalCode: 'M5V 2T6',
        country: 'Canada'
      }
    });

    // Test admin notification email
    const adminNotificationResult = await simpleEmailService.sendAdminNotification({
      orderNumber: 'TEST-123456',
      customerEmail: 'test@example.com',
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
      shippingAddress: {
        firstName: 'Test',
        lastName: 'Customer',
        addressLine1: '123 Test Street',
        city: 'Toronto',
        state: 'ON',
        postalCode: 'M5V 2T6',
        country: 'Canada'
      },
      paymentIntentId: 'pi_test_123456'
    });

    console.log('📧 Email test results:', {
      orderConfirmationSent: orderConfirmationResult,
      adminNotificationSent: adminNotificationResult
    });

    return NextResponse.json({
      success: true,
      results: {
        orderConfirmationSent: orderConfirmationResult,
        adminNotificationSent: adminNotificationResult
      },
      message: 'Simple email service test completed. Check console logs for details.'
    });
  } catch (error) {
    console.error('❌ Email service test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}