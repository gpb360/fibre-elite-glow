// Email service for order confirmations and admin notifications
import { OrderDetails } from '@/types/order';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface AdminNotificationData {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  amount: number;
  currency: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  paymentStatus: string;
  createdAt: string;
}

// Enhanced email service with admin notifications
export class EmailService {
  private static instance: EmailService;
  private emailProvider: 'console' | 'smtp' | 'sendgrid' = 'console';

  // Admin notification settings
  private readonly ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@lbve.ca';
  private readonly SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@lbve.ca';

  private constructor() {
    // Initialize email provider based on environment
    if (process.env.EMAIL_PROVIDER === 'sendgrid' && process.env.SENDGRID_API_KEY) {
      this.emailProvider = 'sendgrid';
    } else if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      this.emailProvider = 'smtp';
    } else {
      this.emailProvider = 'console';
    }
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      switch (this.emailProvider) {
        case 'console':
          return this.sendConsoleEmail(options);
        case 'smtp':
          return this.sendSmtpEmail(options);
        case 'sendgrid':
          return this.sendSendGridEmail(options);
        default:
          throw new Error(`Unsupported email provider: ${this.emailProvider}`);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  // Send admin notification for new orders
  async sendAdminOrderNotification(data: AdminNotificationData): Promise<boolean> {
    const subject = `🛒 New Order: ${data.orderNumber} - ${this.formatCurrency(data.amount, data.currency)}`;
    const html = this.generateAdminOrderHTML(data);
    const text = this.generateAdminOrderText(data);

    console.log(`📧 Sending admin notification for order ${data.orderNumber}`);

    return this.sendEmail({
      to: this.ADMIN_EMAIL,
      subject,
      html,
      text,
    });
  }

  // Send admin notification for payment failures
  async sendAdminPaymentFailureNotification(data: Partial<AdminNotificationData> & { 
    error: string;
    attemptCount?: number;
  }): Promise<boolean> {
    const subject = `⚠️ Payment Failed: ${data.orderNumber || 'Unknown Order'}`;
    const html = this.generatePaymentFailureHTML(data);
    const text = this.generatePaymentFailureText(data);

    return this.sendEmail({
      to: this.ADMIN_EMAIL,
      subject,
      html,
      text,
    });
  }

  // Send admin notification for refunds
  async sendAdminRefundNotification(data: AdminNotificationData & { 
    refundAmount: number;
    refundReason?: string;
  }): Promise<boolean> {
    const subject = `💰 Refund Processed: ${data.orderNumber} - ${this.formatCurrency(data.refundAmount, data.currency)}`;
    const html = this.generateRefundNotificationHTML(data);
    const text = this.generateRefundNotificationText(data);

    return this.sendEmail({
      to: this.ADMIN_EMAIL,
      subject,
      html,
      text,
    });
  }

  // Daily order summary for admins
  async sendDailyOrderSummary(orders: AdminNotificationData[]): Promise<boolean> {
    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    const currency = orders[0]?.currency || 'USD';
    
    const subject = `📈 Daily Summary: ${orders.length} Orders - ${this.formatCurrency(totalRevenue, currency)}`;
    const html = this.generateDailySummaryHTML(orders, totalRevenue, currency);
    const text = this.generateDailySummaryText(orders, totalRevenue, currency);

    return this.sendEmail({
      to: this.ADMIN_EMAIL,
      subject,
      html,
      text,
    });
  }

  private generateAdminOrderHTML(data: AdminNotificationData): string {
    const itemsHtml = data.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">
            ${this.formatCurrency(item.price * item.quantity, data.currency)}
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
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
            .content { padding: 30px 20px; }
            .alert-box { background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 15px; margin: 20px 0; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .info-item { background: #f8f9fa; padding: 15px; border-radius: 8px; }
            .info-label { font-size: 12px; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
            .info-value { font-size: 16px; font-weight: 600; color: #333; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #dee2e6; border-radius: 8px; overflow: hidden; }
            .items-table th { background: #f8f9fa; padding: 12px; text-align: left; font-weight: 600; color: #495057; border-bottom: 1px solid #dee2e6; }
            .items-table td { padding: 12px; border-bottom: 1px solid #dee2e6; }
            .total-box { background: #28a745; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .total-amount { font-size: 28px; font-weight: 700; margin: 0; }
            .actions { margin: 30px 0; text-align: center; }
            .btn { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 0 10px; }
            .btn-success { background: #28a745; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 New Order Received!</h1>
              <p>Order ${data.orderNumber}</p>
            </div>

            <div class="content">
              <div class="alert-box">
                <strong>Action Required:</strong> New order needs processing and fulfillment.
              </div>

              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Customer</div>
                  <div class="info-value">${data.customerName}</div>
                  <div style="color: #6c757d; font-size: 14px;">${data.customerEmail}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Order Date</div>
                  <div class="info-value">${new Date(data.createdAt).toLocaleDateString()}</div>
                  <div style="color: #6c757d; font-size: 14px;">${new Date(data.createdAt).toLocaleTimeString()}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Payment Status</div>
                  <div class="info-value" style="color: #28a745;">${data.paymentStatus}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Order Number</div>
                  <div class="info-value">${data.orderNumber}</div>
                </div>
              </div>

              <h3>Order Details</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <div class="total-box">
                <div style="font-size: 14px; margin-bottom: 5px;">ORDER TOTAL</div>
                <div class="total-amount">${this.formatCurrency(data.amount, data.currency)}</div>
              </div>

              <div class="actions">
                <a href="https://dashboard.stripe.com" class="btn">View in Stripe</a>
                <a href="https://app.netlify.com" class="btn btn-success">Admin Dashboard</a>
              </div>
            </div>

            <div class="footer">
              <p><strong>Fibre Elite Glow</strong> - Order Management System</p>
              <p>This is an automated notification. Reply to this email for support.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateAdminOrderText(data: AdminNotificationData): string {
    const itemsText = data.items
      .map((item) => `${item.name} x${item.quantity} - ${this.formatCurrency(item.price * item.quantity, data.currency)}`)
      .join('\n');

    return `
🎉 NEW ORDER RECEIVED - ${data.orderNumber}

Customer: ${data.customerName}
Email: ${data.customerEmail}
Order Date: ${new Date(data.createdAt).toLocaleString()}
Payment Status: ${data.paymentStatus}

Order Details:
${itemsText}

TOTAL: ${this.formatCurrency(data.amount, data.currency)}

Action Required: Process and fulfill this order.

View in Stripe: https://dashboard.stripe.com
Admin Dashboard: https://app.netlify.com

---
Fibre Elite Glow - Order Management System
    `;
  }

  private generatePaymentFailureHTML(data: Partial<AdminNotificationData> & { error: string; attemptCount?: number }): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Payment Failure Alert</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
            .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .error-box { background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; padding: 15px; margin: 20px 0; color: #721c24; }
            .info-grid { background: #f8f9fa; padding: 15px; border-radius: 4px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Payment Failure</h1>
              <p>Order: ${data.orderNumber || 'Unknown'}</p>
            </div>
            <div class="content">
              <div class="error-box">
                <strong>Error:</strong> ${data.error}
              </div>
              <div class="info-grid">
                <p><strong>Customer:</strong> ${data.customerName || 'Unknown'}</p>
                <p><strong>Email:</strong> ${data.customerEmail || 'Unknown'}</p>
                <p><strong>Amount:</strong> ${data.amount ? this.formatCurrency(data.amount, data.currency || 'USD') : 'Unknown'}</p>
                ${data.attemptCount ? `<p><strong>Attempt #:</strong> ${data.attemptCount}</p>` : ''}
              </div>
              <p>Please investigate this payment failure and take appropriate action.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generatePaymentFailureText(data: Partial<AdminNotificationData> & { error: string; attemptCount?: number }): string {
    return `
⚠️ PAYMENT FAILURE ALERT

Order: ${data.orderNumber || 'Unknown'}
Customer: ${data.customerName || 'Unknown'}
Email: ${data.customerEmail || 'Unknown'}
Amount: ${data.amount ? this.formatCurrency(data.amount, data.currency || 'USD') : 'Unknown'}
${data.attemptCount ? `Attempt #: ${data.attemptCount}` : ''}

Error: ${data.error}

Please investigate this payment failure and take appropriate action.
    `;
  }

  private generateRefundNotificationHTML(data: AdminNotificationData & { refundAmount: number; refundReason?: string }): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Refund Processed</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
            .header { background: #ffc107; color: #333; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .info-box { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💰 Refund Processed</h1>
              <p>Order: ${data.orderNumber}</p>
            </div>
            <div class="content">
              <div class="info-box">
                <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
                <p><strong>Refund Amount:</strong> ${this.formatCurrency(data.refundAmount, data.currency)}</p>
                <p><strong>Original Order Total:</strong> ${this.formatCurrency(data.amount, data.currency)}</p>
                ${data.refundReason ? `<p><strong>Reason:</strong> ${data.refundReason}</p>` : ''}
              </div>
              <p>A refund has been successfully processed for this order.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateRefundNotificationText(data: AdminNotificationData & { refundAmount: number; refundReason?: string }): string {
    return `
💰 REFUND PROCESSED

Order: ${data.orderNumber}
Customer: ${data.customerName} (${data.customerEmail})
Refund Amount: ${this.formatCurrency(data.refundAmount, data.currency)}
Original Order Total: ${this.formatCurrency(data.amount, data.currency)}
${data.refundReason ? `Reason: ${data.refundReason}` : ''}

A refund has been successfully processed for this order.
    `;
  }

  private generateDailySummaryHTML(orders: AdminNotificationData[], totalRevenue: number, currency: string): string {
    const ordersHtml = orders
      .map(
        (order) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${order.orderNumber}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${order.customerName}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">
            ${this.formatCurrency(order.amount, currency)}
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
          <title>Daily Order Summary</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
            .header { background: #17a2b8; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .summary-box { background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 4px; padding: 20px; margin: 20px 0; text-align: center; }
            .orders-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .orders-table th { background: #f8f9fa; padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            .orders-table td { padding: 8px; border-bottom: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📈 Daily Order Summary</h1>
              <p>${new Date().toLocaleDateString()}</p>
            </div>
            <div class="content">
              <div class="summary-box">
                <h2 style="margin: 0; color: #0c5460;">${orders.length} Orders</h2>
                <h3 style="margin: 10px 0 0 0; color: #0c5460;">${this.formatCurrency(totalRevenue, currency)} Total Revenue</h3>
              </div>
              
              <h3>Orders Today</h3>
              <table class="orders-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th style="text-align: right;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${ordersHtml}
                </tbody>
              </table>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateDailySummaryText(orders: AdminNotificationData[], totalRevenue: number, currency: string): string {
    const ordersText = orders
      .map((order) => `${order.orderNumber} - ${order.customerName} - ${this.formatCurrency(order.amount, currency)}`)
      .join('\n');

    return `
📈 DAILY ORDER SUMMARY - ${new Date().toLocaleDateString()}

Orders Today: ${orders.length}
Total Revenue: ${this.formatCurrency(totalRevenue, currency)}

Order Details:
${ordersText}

---
Fibre Elite Glow - Daily Report
    `;
  }

  private async sendConsoleEmail(options: EmailOptions): Promise<boolean> {
    console.log('\n📧 =============== EMAIL NOTIFICATION ===============');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log('Text Content:');
    console.log(options.text || 'No text version provided');
    console.log('HTML Content Preview:');
    console.log(options.html.substring(0, 200) + '...');
    console.log('================================================\n');
    return true;
  }

  private async sendSmtpEmail(options: EmailOptions): Promise<boolean> {
    // TODO: Implement SMTP email sending
    console.log('📧 SMTP Email sending not implemented yet');
    return this.sendConsoleEmail(options);
  }

  private async sendSendGridEmail(options: EmailOptions): Promise<boolean> {
    // TODO: Implement SendGrid email sending
    console.log('📧 SendGrid Email sending not implemented yet');
    return this.sendConsoleEmail(options);
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
              <p>Thank you for your order. We're excited to get your Fibre Elite Glow products to you!</p>
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
              <p>Questions? Contact our support team at support@lbve.ca</p>
              <p>Fibre Elite Glow - Premium Gut Health Solutions</p>
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

Questions? Contact our support team at support@lbve.ca

Fibre Elite Glow - Premium Gut Health Solutions
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