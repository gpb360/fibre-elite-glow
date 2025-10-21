"use client";

import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import { CartItem, CartState, CartContextType } from '@/types/cart';
import { toast } from '@/hooks/use-toast';
import { ErrorBoundary } from '@/components/error';

// Cart Actions
type CartAction =
  | { type: 'ADD_TO_CART'; payload: { item: Omit<CartItem, 'quantity'>; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { itemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: { items: CartItem[] } }
  | { type: 'SET_LOADING'; payload: { isLoading: boolean } };

// Initial state
const initialState: CartState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  totalSavings: 0,
};

// Helper function to calculate cart totals
const calculateTotals = (items: CartItem[]): Omit<CartState, 'items'> => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalSavings = items.reduce((sum, item) => {
    if (item.originalPrice && item.savings) {
      return sum + (item.savings * item.quantity);
    }
    return sum;
  }, 0);

  return {
    totalItems,
    subtotal: Math.round(subtotal * 100) / 100, // Round to 2 decimal places
    totalSavings: Math.round(totalSavings * 100) / 100,
  };
};

// Cart reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  // Development logging
  if (process.env.NODE_ENV === 'development') {
    console.log('🔄 Cart reducer called:', { action: action.type, state, payload: action });
  }

  switch (action.type) {
    case 'ADD_TO_CART': {
      const { item, quantity } = action.payload;

      const existingItemIndex = state.items.findIndex(cartItem => cartItem.id === item.id);

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        // Add new item
        newItems = [...state.items, { ...item, quantity }];
      }

      const totals = calculateTotals(newItems);
      const newState = {
        items: newItems,
        ...totals,
      };

      return newState;
    }
    
    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.id !== action.payload.itemId);
      const totals = calculateTotals(newItems);
      return {
        items: newItems,
        ...totals,
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        const newItems = state.items.filter(item => item.id !== itemId);
        const totals = calculateTotals(newItems);
        return {
          items: newItems,
          ...totals,
        };
      }
      
      const newItems = state.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      const totals = calculateTotals(newItems);
      return {
        items: newItems,
        ...totals,
      };
    }
    
    case 'CLEAR_CART':
      return initialState;
    
    case 'LOAD_CART': {
      const totals = calculateTotals(action.payload.items);
      return {
        items: action.payload.items,
        ...totals,
      };
    }
    
    default:
      return state;
  }
};

// Create context
const CartContext = createContext<(CartContextType & { isLoading: boolean }) | undefined>(undefined);

// Local storage key
const CART_STORAGE_KEY = 'fibre-elite-cart';

// Cart Provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  const [isLoading, setIsLoading] = React.useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: { items: parsedCart } });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart.items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart.items]);

  // Cart actions - memoized to prevent re-renders
  const addToCart = useCallback(async (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setIsLoading(true);

    try {
      dispatch({ type: 'ADD_TO_CART', payload: { item, quantity } });

      // Try to show toast, but don't fail if it doesn't work
      try {
        toast({
          title: "Added to cart",
          description: `${item.productName} has been added to your cart.`,
        });
      } catch (toastError) {
      }
    } catch (error) {
      console.error('Failed to add item to cart:', error);

      // Try to show error toast, but don't fail if it doesn't work
      try {
        toast({
          title: "Error",
          description: "Failed to add item to cart. Please try again.",
          variant: "destructive",
        });
      } catch (toastError) {
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { itemId } });

    try {
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
    } catch (toastError) {
    }
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });

    try {
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    } catch (toastError) {
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isLoading,
  }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, isLoading]);

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Cart Error:', error, errorInfo)
        // Clear cart on critical errors to prevent corruption
        try {
          localStorage.removeItem(CART_STORAGE_KEY)
        } catch (e) {
          console.warn('Failed to clear cart storage:', e)
        }
      }}
      resetKeys={[]} // Remove automatic reset on cart changes to prevent re-renders
    >
      <CartContext.Provider value={contextValue}>
        {children}
      </CartContext.Provider>
    </ErrorBoundary>
  );
};

// Custom hook to use cart context
export const useCart = (): CartContextType & { isLoading: boolean } => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
