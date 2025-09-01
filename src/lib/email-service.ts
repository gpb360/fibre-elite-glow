// Email service for order confirmations and notifications
import { OrderDetails, OrderItem } from '@/types/order';

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

// Basic email service implementation
// In production, you'd want to use a service like SendGrid, Mailgun, or AWS SES
export class EmailService {
  private static instance: EmailService;
  private emailProvider: 'console' | 'smtp' | 'sendgrid' = 'console';

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

  private async sendConsoleEmail(options: EmailOptions): Promise<boolean> {
    console.log('📧 Email Service (Console Mode)');
    console.log('To:', options.to);
    console.log('Subject:', options.subject);
    console.log('Text:', options.text || 'No text version provided');
    console.log('HTML:', options.html);
    console.log('---');
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

  async sendAdminOrderNotification(notification: AdminOrderNotification): Promise<boolean> {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@lbve.ca';
    const subject = `New Order Alert - ${notification.orderNumber}`;
    const html = this.generateAdminNotificationHTML(notification);
    const text = this.generateAdminNotificationText(notification);

    return this.sendEmail({
      to: adminEmail,
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
              <p>Questions? Contact our support team at support@fibreeliteglow.com</p>
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

Questions? Contact our support team at support@fibreeliteglow.com

Fibre Elite Glow - Premium Gut Health Solutions
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
              <p><strong>Fibre Elite Glow Admin Panel</strong></p>
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

Fibre Elite Glow Admin Panel
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