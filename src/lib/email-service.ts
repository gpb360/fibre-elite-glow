// Email service for order confirmations and notifications
import { OrderDetails } from '@/types/order';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
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

  private formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  }
}

export const emailService = EmailService.getInstance();