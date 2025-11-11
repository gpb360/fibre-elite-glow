import { NextResponse } from 'next/server';
import { SimpleEmailService } from '@/lib/simple-email-service';

export async function GET() {
  try {
    console.log('🧪 Testing admin email routing...');

    const simpleEmailService = new SimpleEmailService();

    // Test admin notification
    const adminNotificationResult = await simpleEmailService.sendAdminNotification({
      orderNumber: 'TEST-' + Date.now(),
      customerEmail: 'test@example.com',
      customerName: 'Test Customer',
      items: [{
        name: 'Total Essential',
        quantity: 1,
        price: 79.99
      }],
      totalAmount: 79.99,
      currency: 'USD',
      customerPhone: '+1-555-123-4567',
      shippingAddress: {
        firstName: 'Test',
        lastName: 'Customer',
        addressLine1: '123 Test St',
        city: 'Test City',
        state: 'TS',
        postalCode: '12345',
        country: 'Canada'
      },
      paymentIntentId: 'pi_test_' + Date.now()
    });

    if (adminNotificationResult) {
      return NextResponse.json({
        success: true,
        message: 'Admin email test sent successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Admin email test failed',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
  } catch (error) {
    console.error('❌ Admin email test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Admin email test error: ' + error,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}