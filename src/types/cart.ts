export interface CartItem {
  id: string;
  productName: string;
  productType: 'total_essential' | 'total_essential_plus';
  quantity: number;
  price: number;
  originalPrice?: number;
  savings?: number;
  image?: string;
  packageSize?: string;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  totalSavings: number;
}

export interface CartContextType {
  cart: CartState;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
}
