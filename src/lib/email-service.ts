// Email service for order confirmations and notifications using Supabase Resend integration
import { OrderDetails, OrderItem } from '@/types/order';
import { supabaseAdmin } from '@/integrations/supabase/client';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface AdminOrderNotification {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentIntentId?: string;
  createdAt: string;
}

interface CustomerOrderConfirmation {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
}

// Email service implementation using Supabase Resend integration
export class EmailService {
  private static instance: EmailService;

  private constructor() {
    // Private constructor for singleton pattern
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      // Get Supabase URL and service role key from environment
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Supabase configuration missing - cannot send email');
        return this.sendConsoleEmail(options);
      }

      console.log('📧 Attempting to send email via Supabase Edge Function:', {
        to: options.to,
        subject: options.subject,
        supabaseUrl: `${supabaseUrl}/functions/v1/send-email`
      });

      // Call the existing Supabase Edge Function for email
      // Note: The existing function expects a different structure, so we need to adapt
      const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'order_confirmation',
          data: {
            customerEmail: options.to,
            subject: options.subject,
            htmlContent: options.html,
            textContent: options.text,
            orderNumber: this.extractOrderNumber(options.subject),
            customerName: this.extractCustomerName(options.to),
            totalAmount: this.extractAmount(options.subject),
            orderDate: new Date().toISOString().split('T')[0],
            items: [] // Items will be populated by calling methods
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to send email via Supabase Edge Function:', errorData);
        console.error('Response status:', response.status);
        console.error('Response text:', await response.text());
        // Fallback to console logging for development
        return this.sendConsoleEmail(options);
      }

      const result = await response.json();
      console.log('📧 Email sent successfully via Supabase Edge Function:', result);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      // Fallback to console logging for development
      return this.sendConsoleEmail(options);
    }
  }

  // Helper methods to extract information for compatibility with existing Edge Function
  private extractOrderNumber(subject: string): string {
    const match = subject.match(/Order\s+(?:Confirmation\s+)?-?\s*([A-Z0-9-]+)/i);
    return match ? match[1] : 'Unknown';
  }

  private extractCustomerName(email: string): string {
    // Extract name from email or use a default
    const namePart = email.split('@')[0];
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  }

  private extractAmount(subject: string): string {
    // Try to extract amount from subject, return default if not found
    const match = subject.match(/\$(\d+\.?\d*)/);
    return match ? match[1] : '0.00';
  }

  private async sendConsoleEmail(options: EmailOptions): Promise<boolean> {
    console.log('📧 Email Service (Console Mode - Fallback)');
    console.log('To:', options.to);
    console.log('Subject:', options.subject);
    console.log('Text:', options.text || 'No text version provided');
    console.log('HTML:', options.html);
    console.log('---');
    return true;
  }

  async sendOrderConfirmation(orderDetails: OrderDetails): Promise<boolean> {
    const subject = `Order Confirmation - ${orderDetails.orderNumber}`;
    const html = this.generateOrderConfirmationHTML(orderDetails);
    const text = this.generateOrderConfirmationText(orderDetails);

    return this.sendEmail({
      to: orderDetails.customerEmail,
      subject,
      html,
      text,
    });
  }

  async sendOrderConfirmationWithAddress(orderDetails: CustomerOrderConfirmation): Promise<boolean> {
    try {
      // Get Supabase URL and service role key from environment
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Supabase configuration missing - cannot send email');
        return this.sendConsoleEmail({
          to: orderDetails.customerEmail,
          subject: `Order Confirmation - ${orderDetails.orderNumber}`,
          html: this.generateOrderConfirmationHTMLWithAddress(orderDetails),
          text: this.generateOrderConfirmationTextWithAddress(orderDetails),
        });
      }

      console.log('📧 Sending order confirmation with address:', {
        orderNumber: orderDetails.orderNumber,
        customerEmail: orderDetails.customerEmail,
        customerName: `${orderDetails.shippingAddress.firstName} ${orderDetails.shippingAddress.lastName}`,
        itemCount: orderDetails.items.length
      });

      // Prepare data in the format expected by the existing send-email Edge Function
      const emailData = {
        type: 'order_confirmation',
        data: {
          customerEmail: orderDetails.customerEmail,
          customerName: `${orderDetails.shippingAddress.firstName} ${orderDetails.shippingAddress.lastName}`,
          orderNumber: orderDetails.orderNumber,
          totalAmount: orderDetails.totalAmount.toString(),
          items: orderDetails.items.map(item => ({
            description: item.name,
            quantity: item.quantity,
            amount: (item.price * item.quantity).toFixed(2)
          })),
          orderDate: new Date(orderDetails.createdAt).toLocaleDateString(),
          stripePaymentId: undefined // Will be added if available
        }
      };

      // Call the existing Supabase Edge Function
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
        console.error('Failed to send order confirmation email:', errorData);
        console.error('Response status:', response.status);
        console.error('Response text:', await response.text());
        // Fallback to console logging for development
        return this.sendConsoleEmail({
          to: orderDetails.customerEmail,
          subject: `Order Confirmation - ${orderDetails.orderNumber}`,
          html: this.generateOrderConfirmationHTMLWithAddress(orderDetails),
          text: this.generateOrderConfirmationTextWithAddress(orderDetails),
        });
      }

      const result = await response.json();
      console.log('📧 Order confirmation email sent successfully:', result);
      return true;
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      // Fallback to console logging for development
      return this.sendConsoleEmail({
        to: orderDetails.customerEmail,
        subject: `Order Confirmation - ${orderDetails.orderNumber}`,
        html: this.generateOrderConfirmationHTMLWithAddress(orderDetails),
        text: this.generateOrderConfirmationTextWithAddress(orderDetails),
      });
    }
  }

  async sendAdminOrderNotification(notification: AdminOrderNotification): Promise<boolean> {
    try {
      // Get Supabase URL and service role key from environment
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      const adminEmail = process.env.ADMIN_EMAIL || 'admin@lbve.ca';

      if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Supabase configuration missing - cannot send admin notification');
        return this.sendConsoleEmail({
          to: adminEmail,
          subject: `New Order Alert - ${notification.orderNumber}`,
          html: this.generateAdminNotificationHTML(notification),
          text: this.generateAdminNotificationText(notification),
        });
      }

      console.log('📧 Sending admin order notification:', {
        orderNumber: notification.orderNumber,
        customerEmail: notification.customerEmail,
        customerName: notification.customerName,
        totalAmount: notification.totalAmount,
        itemCount: notification.items.length
      });

      // Prepare data in the format expected by the existing send-email Edge Function
      const emailData = {
        type: 'admin_notification',
        data: {
          customerEmail: notification.customerEmail,
          customerName: notification.customerName,
          orderNumber: notification.orderNumber,
          totalAmount: (notification.totalAmount / 100).toFixed(2), // Convert from cents
          items: notification.items.map(item => ({
            description: item.name,
            quantity: item.quantity,
            amount: (item.price * item.quantity / 100).toFixed(2) // Convert from cents
          })),
          stripePaymentId: notification.paymentIntentId
        }
      };

      // Call the existing Supabase Edge Function
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
        console.error('Failed to send admin notification email:', errorData);
        console.error('Response status:', response.status);
        console.error('Response text:', await response.text());
        // Fallback to console logging for development
        return this.sendConsoleEmail({
          to: adminEmail,
          subject: `New Order Alert - ${notification.orderNumber}`,
          html: this.generateAdminNotificationHTML(notification),
          text: this.generateAdminNotificationText(notification),
        });
      }

      const result = await response.json();
      console.log('📧 Admin notification email sent successfully:', result);
      return true;
    } catch (error) {
      console.error('Failed to send admin notification email:', error);
      // Fallback to console logging for development
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@lbve.ca';
      return this.sendConsoleEmail({
        to: adminEmail,
        subject: `New Order Alert - ${notification.orderNumber}`,
        html: this.generateAdminNotificationHTML(notification),
        text: this.generateAdminNotificationText(notification),
      });
    }
  }

  private generateOrderConfirmationHTML(order: OrderDetails): string {
    const itemsHtml = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>${item.name}</strong>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
            ${this.formatCurrency(item.price * item.quantity, order.currency)}
          </td>
        </tr>
      `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
            .order-details { background: #fff; padding: 20px; margin: 20px 0; border: 1px solid #ddd; border-radius: 8px; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th { background: #f8f9fa; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; }
            .items-table td { padding: 10px; border-bottom: 1px solid #eee; }
            .total { font-size: 18px; font-weight: bold; color: #28a745; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Order Confirmed!</h1>
              <p>Thank you for your order. We're excited to get your La Belle Vie products to you!</p>
            </div>

            <div class="order-details">
              <h2>Order Details</h2>
              <p><strong>Order Number:</strong> ${order.orderNumber}</p>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Status:</strong> ${order.status}</p>

              <h3>Items Ordered</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Quantity</th>
                    <th style="text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <p class="total">Total: ${this.formatCurrency(order.amount / 100, order.currency)}</p>
            </div>

            <div class="order-details">
              <h2>What's Next?</h2>
              <ol>
                <li><strong>Processing:</strong> Your order is being prepared (1-2 business days)</li>
                <li><strong>Shipping:</strong> You'll receive tracking information once shipped</li>
                <li><strong>Delivery:</strong> Your package will arrive within 3-7 business days</li>
              </ol>
            </div>

            <div class="footer">
              <p>Questions? Contact our support team at support@fibreeliteglow.com</p>
              <p>La Belle Vie - Premium Gut Health Solutions</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateOrderConfirmationText(order: OrderDetails): string {
    const itemsText = order.items
      .map((item) => `${item.name} x${item.quantity} - ${this.formatCurrency(item.price * item.quantity, order.currency)}`)
      .join('\n');

    return `
Order Confirmation - ${order.orderNumber}

Thank you for your order! Here are your order details:

Order Number: ${order.orderNumber}
Order Date: ${new Date(order.createdAt).toLocaleDateString()}
Status: ${order.status}

Items Ordered:
${itemsText}

Total: ${this.formatCurrency(order.amount / 100, order.currency)}

What's Next?
1. Processing: Your order is being prepared (1-2 business days)
2. Shipping: You'll receive tracking information once shipped
3. Delivery: Your package will arrive within 3-7 business days

Questions? Contact our support team at support@fibreeliteglow.com

La Belle Vie - Premium Gut Health Solutions
    `;
  }

  private generateOrderConfirmationHTMLWithAddress(order: CustomerOrderConfirmation): string {
    const itemsHtml = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>${item.name}</strong>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
            ${this.formatCurrency(item.price * item.quantity, order.currency)}
          </td>
        </tr>
      `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
            .order-details { background: #fff; padding: 20px; margin: 20px 0; border: 1px solid #ddd; border-radius: 8px; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th { background: #f8f9fa; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; }
            .items-table td { padding: 10px; border-bottom: 1px solid #eee; }
            .total { font-size: 18px; font-weight: bold; color: #28a745; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; }
            .shipping-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Order Confirmed!</h1>
              <p>Thank you for your order. We're excited to get your La Belle Vie products to you!</p>
            </div>

            <div class="order-details">
              <h2>Order Details</h2>
              <p><strong>Order Number:</strong> ${order.orderNumber}</p>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Status:</strong> Confirmed</p>

              <h3>Shipping Address</h3>
              <div class="shipping-info">
                <p>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
                ${order.shippingAddress.addressLine1}<br>
                ${order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 + '<br>' : ''}
                ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
                ${order.shippingAddress.country}</p>
              </div>

              <h3>Items Ordered</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Quantity</th>
                    <th style="text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <p class="total">Total: ${this.formatCurrency(order.totalAmount, order.currency)}</p>
            </div>

            <div class="order-details">
              <h2>What's Next?</h2>
              <ol>
                <li><strong>Processing:</strong> Your order is being prepared (1-2 business days)</li>
                <li><strong>Shipping:</strong> You'll receive tracking information once shipped</li>
                <li><strong>Delivery:</strong> Your package will arrive within 3-7 business days</li>
              </ol>
            </div>

            <div class="footer">
              <p>Questions? Contact our support team at support@fibreeliteglow.com</p>
              <p>La Belle Vie - Premium Gut Health Solutions</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateOrderConfirmationTextWithAddress(order: CustomerOrderConfirmation): string {
    const itemsText = order.items
      .map((item) => `${item.name} x${item.quantity} - ${this.formatCurrency(item.price * item.quantity, order.currency)}`)
      .join('\n');

    return `
Order Confirmation - ${order.orderNumber}

Thank you for your order! Here are your order details:

Order Number: ${order.orderNumber}
Order Date: ${new Date(order.createdAt).toLocaleDateString()}
Status: Confirmed

Shipping Address:
${order.shippingAddress.firstName} ${order.shippingAddress.lastName}
${order.shippingAddress.addressLine1}
${order.shippingAddress.addressLine2 || ''}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}
${order.shippingAddress.country}

Items Ordered:
${itemsText}

Total: ${this.formatCurrency(order.totalAmount, order.currency)}

What's Next?
1. Processing: Your order is being prepared (1-2 business days)
2. Shipping: You'll receive tracking information once shipped
3. Delivery: Your package will arrive within 3-7 business days

Questions? Contact our support team at support@fibreeliteglow.com

La Belle Vie - Premium Gut Health Solutions
    `;
  }

  private generateAdminNotificationHTML(notification: AdminOrderNotification): string {
    const itemsHtml = notification.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>${item.name}</strong><br>
            <small style="color: #666;">Type: ${item.product_type || 'N/A'}</small>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
            ${this.formatCurrency(item.price * item.quantity, notification.currency)}
          </td>
        </tr>
      `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Order Alert</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 8px; }
            .alert { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 8px; }
            .order-details { background: #fff; padding: 20px; margin: 20px 0; border: 1px solid #ddd; border-radius: 8px; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th { background: #f8f9fa; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; }
            .items-table td { padding: 10px; border-bottom: 1px solid #eee; }
            .total { font-size: 18px; font-weight: bold; color: #dc3545; }
            .action-items { background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .action-item { background: white; padding: 10px; margin: 8px 0; border-left: 4px solid #007bff; }
            .customer-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 New Order Alert</h1>
              <p>A new order has been placed and requires your attention</p>
            </div>

            <div class="alert">
              <strong>⚡ Action Required:</strong> Process order ${notification.orderNumber} - Customer: ${notification.customerEmail}
            </div>

            <div class="order-details">
              <h2>Order Summary</h2>
              <p><strong>Order Number:</strong> ${notification.orderNumber}</p>
              <p><strong>Order Date:</strong> ${new Date(notification.createdAt).toLocaleDateString()} at ${new Date(notification.createdAt).toLocaleTimeString()}</p>
              <p><strong>Payment Intent:</strong> ${notification.paymentIntentId || 'N/A'}</p>

              <div class="customer-info">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> ${notification.customerName}</p>
                <p><strong>Email:</strong> ${notification.customerEmail}</p>
                <p><strong>Shipping Address:</strong><br>
                  ${notification.shippingAddress.firstName} ${notification.shippingAddress.lastName}<br>
                  ${notification.shippingAddress.addressLine1}<br>
                  ${notification.shippingAddress.addressLine2 ? notification.shippingAddress.addressLine2 + '<br>' : ''}
                  ${notification.shippingAddress.city}, ${notification.shippingAddress.state} ${notification.shippingAddress.postalCode}<br>
                  ${notification.shippingAddress.country}
                </p>
              </div>

              <h3>Items Ordered</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Quantity</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <p class="total">Order Total: ${this.formatCurrency(notification.totalAmount / 100, notification.currency)}</p>
            </div>

            <div class="action-items">
              <h3>📋 Action Items</h3>
              <div class="action-item">
                <strong>1. Verify Inventory:</strong> Check stock levels for all ordered items
              </div>
              <div class="action-item">
                <strong>2. Process Payment:</strong> Confirm payment has been processed successfully
              </div>
              <div class="action-item">
                <strong>3. Prepare Shipment:</strong> Package items and prepare shipping label
              </div>
              <div class="action-item">
                <strong>4. Update Customer:</strong> Send tracking information once shipped
              </div>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
              <p><strong>La Belle Vie Admin Panel</strong></p>
              <p>Order processing system notification</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateAdminNotificationText(notification: AdminOrderNotification): string {
    const itemsText = notification.items
      .map((item) => `${item.name} (${item.product_type || 'N/A'}) x${item.quantity} - ${this.formatCurrency(item.price * item.quantity, notification.currency)}`)
      .join('\n');

    return `
NEW ORDER ALERT - ${notification.orderNumber}

⚡ ACTION REQUIRED: Process new order

Order Details:
- Order Number: ${notification.orderNumber}
- Order Date: ${new Date(notification.createdAt).toLocaleString()}
- Payment Intent: ${notification.paymentIntentId || 'N/A'}

Customer Information:
- Name: ${notification.customerName}
- Email: ${notification.customerEmail}

Shipping Address:
${notification.shippingAddress.firstName} ${notification.shippingAddress.lastName}
${notification.shippingAddress.addressLine1}
${notification.shippingAddress.addressLine2 ? notification.shippingAddress.addressLine2 + '\n' : ''}${notification.shippingAddress.city}, ${notification.shippingAddress.state} ${notification.shippingAddress.postalCode}
${notification.shippingAddress.country}

Items Ordered:
${itemsText}

Order Total: ${this.formatCurrency(notification.totalAmount / 100, notification.currency)}

📋 ACTION ITEMS:
1. Verify Inventory: Check stock levels for all ordered items
2. Process Payment: Confirm payment has been processed successfully
3. Prepare Shipment: Package items and prepare shipping label
4. Update Customer: Send tracking information once shipped

La Belle Vie Admin Panel
Order processing system notification
    `;
  }

  private formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  }
}

export const emailService = EmailService.getInstance();