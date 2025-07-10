// Order-related TypeScript types

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  product_type?: 'total_essential' | 'total_essential_plus';
}

export interface OrderDetails {
  id: string;
  orderNumber: string;
  amount: number;
  currency: string;
  status: string;
  customerEmail: string;
  items: OrderItem[];
  createdAt: string;
}

export interface CheckoutSessionRequest {
  items: CartItem[];
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
}

export interface CartItem {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface CheckoutSessionResponse {
  url: string;
  sessionId: string;
}

export interface OrderConfirmationData {
  orderId: string;
  orderNumber: string;
  customerEmail: string;
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
  billingAddress: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}