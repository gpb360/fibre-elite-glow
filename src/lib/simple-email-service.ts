// Simple email service that calls Resend directly - bypassing complex Supabase Edge Function
// This fixes the admin email redirect issue and simplifies the email workflow

import { BUILD_TIMESTAMP } from './build-cache-buster';

interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface OrderConfirmationData {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    packageSize?: string;
    totalBoxes?: number;
  }>;
  orderDate?: Date;
  subtotalAmount?: number;
  shippingAmount?: number;
  taxAmount?: number;
  totalAmount: number;
  currency: string;
  timeZone?: string;
  customerPhone?: string;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

interface AdminNotificationData {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    packageSize?: string;
    totalBoxes?: number;
  }>;
  orderDate?: Date;
  subtotalAmount?: number;
  shippingAmount?: number;
  taxAmount?: number;
  totalAmount: number;
  currency: string;
  timeZone?: string;
  customerPhone?: string;
  shippingAddress?: {
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
}

class SimpleEmailService {
  private resendApiKey: string;
  private adminEmail: string;
  private isDevelopment: boolean;

  constructor() {
    this.resendApiKey = process.env.RESEND_API_KEY || '';
    this.adminEmail = process.env.ADMIN_EMAIL || 'admin@lbve.ca';
    this.isDevelopment = process.env.NODE_ENV === 'development';

    // Debug logging to identify admin email issue
    console.log('🔍 SimpleEmailService Debug:');
    console.log('  BUILD_TIMESTAMP:', BUILD_TIMESTAMP);
    console.log('  ADMIN_EMAIL from env:', process.env.ADMIN_EMAIL);
    console.log('  Final adminEmail:', this.adminEmail);
    console.log('  Is development:', this.isDevelopment);
  }

  private formatCurrency(amount: number | undefined, currency: string): string {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: currency || 'CAD',
    }).format(amount || 0);
  }

  private formatOrderDate(date: Date | undefined, timeZone?: string): string {
    return new Intl.DateTimeFormat('en-CA', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: timeZone || 'America/Toronto',
    }).format(date || new Date());
  }

  private generateTotalsHtml(data: {
    subtotalAmount?: number;
    shippingAmount?: number;
    taxAmount?: number;
    totalAmount: number;
    currency: string;
  }): string {
    const subtotal = data.subtotalAmount ?? data.totalAmount;
    const shipping = data.shippingAmount ?? 0;
    const tax = data.taxAmount ?? 0;

    return `
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-family: Arial, sans-serif;">
        <tbody>
          <tr>
            <td style="padding: 6px 0; text-align: right; color: #555;">Subtotal</td>
            <td style="padding: 6px 0 6px 20px; text-align: right; width: 120px;">${this.formatCurrency(subtotal, data.currency)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; text-align: right; color: #555;">Shipping</td>
            <td style="padding: 6px 0 6px 20px; text-align: right;">${this.formatCurrency(shipping, data.currency)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; text-align: right; color: #555;">Tax</td>
            <td style="padding: 6px 0 6px 20px; text-align: right;">${this.formatCurrency(tax, data.currency)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0 0; text-align: right; font-weight: bold; border-top: 1px solid #ddd;">Total</td>
            <td style="padding: 10px 0 0 20px; text-align: right; font-weight: bold; border-top: 1px solid #ddd;">${this.formatCurrency(data.totalAmount, data.currency)}</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  private async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      if (!this.resendApiKey) {
        console.error('❌ RESEND_API_KEY not configured');
        return false;
      }

      console.log(`📧 Sending email via Resend:`, {
        to: emailData.to,
        subject: emailData.subject,
        from: emailData.from || 'La Belle Vie <noreply@lbve.ca>'
      });

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: emailData.from || 'La Belle Vie <noreply@stripe.venomappdevelopment.com>',
          to: [emailData.to],
          subject: emailData.subject,
          html: emailData.html,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Resend API error:', error);
        return false;
      }

      const result = await response.json();
      console.log('✅ Email sent successfully via Resend:', result);
      return true;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      return false;
    }
  }

  async sendOrderConfirmation(data: OrderConfirmationData): Promise<boolean> {
    const html = this.generateOrderConfirmationHTML(data);

    // Send to actual customer email
    const targetEmail = data.customerEmail;

    return this.sendEmail({
      to: targetEmail,
      subject: `Order Confirmation - ${data.orderNumber}`,
      html,
      from: 'La Belle Vie <noreply@stripe.venomappdevelopment.com>'
    });
  }

  async sendAdminNotification(data: AdminNotificationData): Promise<boolean> {
    const html = this.generateAdminNotificationHTML(data);

    // ALWAYS send to actual admin email - no development redirect!
    console.log(`📧 Sending admin notification to: ${this.adminEmail}`);
    console.log(`  Order: ${data.orderNumber}, Total: $${data.totalAmount.toFixed(2)}`);

    return this.sendEmail({
      to: this.adminEmail, // This fixes the admin email redirect issue
      subject: `New Order: ${data.orderNumber} - ${this.formatCurrency(data.totalAmount, data.currency)}`,
      html,
      from: 'La Belle Vie <orders@stripe.venomappdevelopment.com>'
    });
  }

  private generateOrderConfirmationHTML(data: OrderConfirmationData): string {
    const itemsHtml = data.items
      .map(item => {
        const quantityLabel = item.totalBoxes
          ? `${item.totalBoxes} box${item.totalBoxes === 1 ? '' : 'es'}`
          : String(item.quantity);
        return `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee; font-family: Arial, sans-serif;">
            <strong>${item.name}</strong>
            ${item.packageSize ? `<br><span style="color: #666; font-size: 12px;">${item.packageSize}</span>` : ''}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; font-family: Arial, sans-serif;">
            ${quantityLabel}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-family: Arial, sans-serif;">
            ${this.formatCurrency(item.price * item.quantity, data.currency)}
          </td>
        </tr>
      `;
      })
      .join('');

    const shippingHtml = data.shippingAddress ? `
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; font-family: Arial, sans-serif;">
        <h3 style="margin-top: 0; color: #333;">Shipping Address</h3>
        <p style="margin: 5px 0; color: #555;">
          ${data.shippingAddress.firstName} ${data.shippingAddress.lastName}<br>
          ${data.shippingAddress.addressLine1}<br>
          ${data.shippingAddress.addressLine2 ? data.shippingAddress.addressLine2 + '<br>' : ''}
          ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}<br>
          ${data.shippingAddress.country}
        </p>
      </div>
    ` : '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation - ${data.orderNumber}</title>
        </head>
        <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f9fafb; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

            <!-- Header -->
            <div style="background: linear-gradient(135deg, #9ED458 0%, #7FB835 100%); padding: 30px 20px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">Order Confirmed</h1>
              <p style="margin: 10px 0 0; color: white; font-size: 16px;">Thank you for your order, ${data.customerName}!</p>
            </div>

            <!-- Order Details -->
            <div style="padding: 30px 20px;">
              <h2 style="margin-top: 0; color: #333; border-bottom: 2px solid #9ED458; padding-bottom: 10px;">Order Details</h2>

              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p style="margin: 5px 0;"><strong>Order Number:</strong> ${data.orderNumber}</p>
                <p style="margin: 5px 0;"><strong>Order Date:</strong> ${this.formatOrderDate(data.orderDate, data.timeZone)}</p>
                <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">Confirmed</span></p>
                ${data.customerPhone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${data.customerPhone}</p>` : ''}
              </div>

              ${shippingHtml}

              <!-- Items -->
              <h3 style="margin-top: 20px; color: #333;">Items Ordered</h3>
              <table style="width: 100%; border-collapse: collapse; margin: 15px 0; font-family: Arial, sans-serif;">
                <thead>
                  <tr style="background: #f8f9fa;">
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd; color: #333;">Product</th>
                    <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd; color: #333;">Boxes</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd; color: #333;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              ${this.generateTotalsHtml(data)}
            </div>

            <!-- Footer -->
            <div style="background: #f8f9fa; padding: 30px 20px; text-align: center; border-top: 1px solid #eee; color: #666; font-size: 14px;">
              <p style="margin: 0 0 10px;">Questions? Contact us at <a href="mailto:support@lbve.ca" style="color: #9ED458;">support@lbve.ca</a></p>
              <p style="margin: 10px 0;">La Belle Vie - Premium Gut Health Solutions</p>
              <p style="margin: 0; font-size: 12px;">© ${new Date().getFullYear()} La Belle Vie. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateAdminNotificationHTML(data: AdminNotificationData): string {
    const itemsHtml = data.items
      .map(item => {
        const quantityLabel = item.totalBoxes
          ? `${item.totalBoxes} box${item.totalBoxes === 1 ? '' : 'es'}`
          : String(item.quantity);
        return `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee; font-family: Arial, sans-serif;">
            <strong>${item.name}</strong>
            ${item.packageSize ? `<br><span style="color: #666; font-size: 12px;">${item.packageSize}</span>` : ''}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; font-family: Arial, sans-serif;">
            ${quantityLabel}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-family: Arial, sans-serif;">
            ${this.formatCurrency(item.price * item.quantity, data.currency)}
          </td>
        </tr>
      `;
      })
      .join('');

     const shippingHtml = data.shippingAddress ? `
      <div style="background: #fff3cd; border-left: 4px solid #9ED458; padding: 15px; margin: 15px 0; font-family: Arial, sans-serif;">
        <h4 style="margin-top: 0; color: #333;">Shipping Address</h4>
        <p style="margin: 5px 0; color: #555;">
          ${data.customerName}<br>
          ${data.shippingAddress.addressLine1}<br>
          ${data.shippingAddress.addressLine2 ? data.shippingAddress.addressLine2 + '<br>' : ''}
          ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}<br>
          ${data.shippingAddress.country}
        </p>
      </div>
    ` : '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Order Alert - ${data.orderNumber}</title>
        </head>
        <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f9fafb; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

            <!-- Alert Header -->
            <div style="background: #9ED458; color: white; padding: 25px 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">New Order Alert</h1>
              <p style="margin: 10px 0 0; font-size: 16px;">Order ${data.orderNumber} requires processing</p>
            </div>

            <!-- Order Details -->
            <div style="padding: 30px 20px;">
              <h2 style="margin-top: 0; color: #333; border-bottom: 2px solid #9ED458; padding-bottom: 10px;">Order Summary</h2>

              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p style="margin: 5px 0;"><strong>Order Number:</strong> ${data.orderNumber}</p>
                <p style="margin: 5px 0;"><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
                ${data.customerPhone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${data.customerPhone}</p>` : ''}
                <p style="margin: 5px 0;"><strong>Order Date:</strong> ${this.formatOrderDate(data.orderDate, data.timeZone)}</p>
                ${data.paymentIntentId ? `<p style="margin: 5px 0;"><strong>Payment Intent:</strong> ${data.paymentIntentId}</p>` : ''}
              </div>

              ${shippingHtml}

              <!-- Items -->
              <h3 style="margin-top: 20px; color: #333;">Items Ordered</h3>
              <table style="width: 100%; border-collapse: collapse; margin: 15px 0; font-family: Arial, sans-serif;">
                <thead>
                  <tr style="background: #f8f9fa;">
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd; color: #333;">Product</th>
                    <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd; color: #333;">Boxes</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd; color: #333;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              ${this.generateTotalsHtml(data)}

              <!-- Action Items -->
              <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
                <h3 style="margin-top: 0; color: #333;">📋 Action Items</h3>
                <div style="background: white; padding: 10px; margin: 10px 0; border-radius: 4px;">
                  <p style="margin: 5px 0;"><strong>1.</strong> Verify inventory for ordered items</p>
                  <p style="margin: 5px 0;"><strong>2.</strong> Process payment (if not already completed)</p>
                  <p style="margin: 5px 0;"><strong>3.</strong> Prepare shipment and packaging</p>
                  <p style="margin: 5px 0;"><strong>4.</strong> Send tracking information to customer</p>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee; color: #666; font-size: 14px;">
              <p style="margin: 0;">La Belle Vie Order Processing System</p>
              <p style="margin: 5px 0; font-size: 12px;">This is an automated notification from your e-commerce system</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

export const simpleEmailService = new SimpleEmailService();
