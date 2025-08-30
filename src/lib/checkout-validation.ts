'use client'

import { useEffect, useState, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { FormValidationUtils, SecurityValidation } from '@/lib/form-validation'

interface CartItem {
  id: string
  productName: string
  price: number
  quantity: number
  image?: string
}

interface CheckoutValidationOptions {
  validateOnChange?: boolean
  enableCartPersistence?: boolean
  maxRetries?: number
  timeoutMs?: number
}

interface CheckoutValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  securityScore: number
}

/**
 * Enhanced checkout validation hook with cart persistence
 */
export function useCheckoutValidation(options: CheckoutValidationOptions = {}) {
  const {
    validateOnChange = true,
    enableCartPersistence = true,
    maxRetries = 3,
    timeoutMs = 30000
  } = options
  
  const { toast } = useToast()
  const [validationResult, setValidationResult] = useState<CheckoutValidationResult>({
    isValid: false,
    errors: [],
    warnings: [],
    securityScore: 0
  })
  const [isValidating, setIsValidating] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  /**
   * Validate checkout form data comprehensively
   */
  const validateCheckout = useCallback(async (formData: any, cartItems: CartItem[]) => {
    setIsValidating(true)
    const errors: string[] = []
    const warnings: string[] = []
    
    try {
      // 1. Basic required field validation
      if (!formData.email) errors.push('Email address is required')
      if (!formData.firstName) errors.push('First name is required')
      if (!formData.lastName) errors.push('Last name is required')
      if (!formData.address) errors.push('Street address is required')
      if (!formData.city) errors.push('City is required')
      if (!formData.state) errors.push('State is required')
      if (!formData.zipCode) errors.push('ZIP code is required')
      
      // 2. Cart validation
      if (!cartItems || cartItems.length === 0) {
        errors.push('Cart is empty. Please add items before checkout.')
      } else {
        // Validate each cart item
        cartItems.forEach((item, index) => {
          if (!item.id) errors.push(`Item ${index + 1}: Missing product ID`)
          if (!item.productName) errors.push(`Item ${index + 1}: Missing product name`)
          if (item.price <= 0) errors.push(`Item ${index + 1}: Invalid price`)
          if (item.quantity <= 0 || item.quantity > 10) {
            errors.push(`Item ${index + 1}: Invalid quantity (must be 1-10)`)
          }
        })
        
        // Check cart total
        const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        if (cartTotal <= 0) errors.push('Cart total must be greater than $0')
        if (cartTotal > 10000) warnings.push('Large order detected. Please verify amounts.')
      }
      
      // 3. Email validation
      if (formData.email && !SecurityValidation.isValidEmail(formData.email)) {
        errors.push('Please enter a valid email address')
      }
      
      // 4. Phone validation (if provided)
      if (formData.phone && !SecurityValidation.isValidPhone(formData.phone)) {
        errors.push('Please enter a valid phone number')
      }
      
      // 5. Name validation
      if (formData.firstName && !SecurityValidation.isValidName(formData.firstName)) {
        errors.push('First name contains invalid characters')
      }
      if (formData.lastName && !SecurityValidation.isValidName(formData.lastName)) {
        errors.push('Last name contains invalid characters')
      }
      
      // 6. Address validation
      if (formData.address && formData.address.length < 5) {
        errors.push('Please enter a complete street address')
      }
      
      // 7. ZIP code validation
      if (formData.zipCode && !/^\\d{5}(-\\d{4})?$/.test(formData.zipCode)) {
        errors.push('Please enter a valid ZIP code (12345 or 12345-6789)')
      }
      
      // 8. Security validation
      const securityValidation = FormValidationUtils.getFormSecurityScore(formData)
      
      if (!securityValidation.isSecure) {
        errors.push('Form contains potentially dangerous content')
      }
      
      if (securityValidation.percentage < 80) {
        warnings.push('Some form fields may need review')
      }
      
      // 9. Additional business logic validation
      
      // Check for duplicate orders (basic check)
      const orderSignature = `${formData.email}-${cartItems.map(i => i.id).join('-')}-${Date.now()}`
      const recentOrders = JSON.parse(localStorage.getItem('recentOrderSignatures') || '[]')
      
      if (recentOrders.includes(orderSignature.substring(0, orderSignature.lastIndexOf('-')))) {
        warnings.push('This appears to be a duplicate order. Please verify your cart.')
      }
      
      // Store order signature
      const updatedSignatures = [...recentOrders.slice(-9), orderSignature.substring(0, orderSignature.lastIndexOf('-'))]
      localStorage.setItem('recentOrderSignatures', JSON.stringify(updatedSignatures))
      
      const result = {
        isValid: errors.length === 0,
        errors,
        warnings,
        securityScore: securityValidation.percentage
      }
      
      setValidationResult(result)
      
      // Show warnings as toasts
      if (warnings.length > 0) {
        warnings.forEach(warning => {
          toast({
            title: 'Warning',
            description: warning,
            variant: 'default'
          })
        })
      }
      
      return result
      
    } catch (error) {
      console.error('Checkout validation error:', error)
      const result = {
        isValid: false,
        errors: ['Validation failed. Please try again.'],
        warnings: [],
        securityScore: 0
      }
      setValidationResult(result)
      return result
    } finally {
      setIsValidating(false)
    }
  }, [toast])
  
  /**
   * Validate individual field
   */
  const validateField = useCallback(async (fieldName: string, value: any) => {
    const errors: string[] = []
    
    switch (fieldName) {
      case 'email':
        if (value && !SecurityValidation.isValidEmail(value)) {
          errors.push('Please enter a valid email address')
        }
        break
      case 'firstName':
      case 'lastName':
        if (value && !SecurityValidation.isValidName(value)) {
          errors.push(`${fieldName === 'firstName' ? 'First' : 'Last'} name contains invalid characters`)
        }
        break
      case 'phone':
        if (value && !SecurityValidation.isValidPhone(value)) {
          errors.push('Please enter a valid phone number')
        }
        break
      case 'zipCode':
        if (value && !/^\\d{5}(-\\d{4})?$/.test(value)) {
          errors.push('Please enter a valid ZIP code')
        }
        break
      default:
        if (value && !SecurityValidation.isSecureInput(value)) {
          errors.push('Field contains invalid characters')
        }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }, [])
  
  return {
    validationResult,
    isValidating,
    validateCheckout,
    validateField,
    retryCount,
    setRetryCount
  }
}

/**
 * Cart persistence hook for checkout reliability
 */
export function useCartPersistence() {
  const [persistedCart, setPersistedCart] = useState<CartItem[]>([])
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  
  const STORAGE_KEY = 'fibre_elite_cart_backup'
  const MAX_AGE_HOURS = 24
  
  /**
   * Save cart to localStorage with timestamp
   */
  const saveCart = useCallback((cartItems: CartItem[]) => {
    try {
      const cartData = {
        items: cartItems,
        timestamp: Date.now(),
        version: '1.0'
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartData))
      setLastSaved(new Date())
    } catch (error) {
      console.error('Failed to save cart:', error)
    }
  }, [])
  
  /**
   * Load cart from localStorage
   */
  const loadCart = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return null
      
      const cartData = JSON.parse(saved)
      const age = Date.now() - cartData.timestamp
      const maxAge = MAX_AGE_HOURS * 60 * 60 * 1000
      
      if (age > maxAge) {
        localStorage.removeItem(STORAGE_KEY)
        return null
      }
      
      setPersistedCart(cartData.items)
      setLastSaved(new Date(cartData.timestamp))
      return cartData.items
    } catch (error) {
      console.error('Failed to load cart:', error)
      return null
    }
  }, [])
  
  /**
   * Clear persisted cart
   */
  const clearPersistedCart = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      setPersistedCart([])
      setLastSaved(null)
    } catch (error) {
      console.error('Failed to clear cart:', error)
    }
  }, [])
  
  /**
   * Check if cart needs recovery
   */
  const needsRecovery = useCallback((currentCart: CartItem[]) => {
    const saved = loadCart()
    if (!saved || saved.length === 0) return false
    if (currentCart.length === 0 && saved.length > 0) return true
    
    // Check if saved cart has more items
    return saved.length > currentCart.length
  }, [loadCart])
  
  // Auto-load on mount
  useEffect(() => {
    loadCart()
  }, [])
  
  return {
    persistedCart,
    lastSaved,
    saveCart,
    loadCart,
    clearPersistedCart,
    needsRecovery
  }
}

/**
 * Order confirmation validation
 */
export function useOrderConfirmation() {
  const [isValidating, setIsValidating] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  
  /**
   * Validate order confirmation data
   */
  const validateOrderConfirmation = useCallback(async (orderData: any) => {
    setIsValidating(true)
    const errors: string[] = []
    
    try {
      // Validate required order fields
      if (!orderData.sessionId) errors.push('Missing session ID')
      if (!orderData.customerEmail) errors.push('Missing customer email')
      if (!orderData.amount) errors.push('Missing order amount')
      if (!orderData.currency) errors.push('Missing currency')
      
      // Validate session ID format
      if (orderData.sessionId && !orderData.sessionId.startsWith('cs_')) {
        errors.push('Invalid session ID format')
      }
      
      // Validate email
      if (orderData.customerEmail && !SecurityValidation.isValidEmail(orderData.customerEmail)) {
        errors.push('Invalid customer email')
      }
      
      // Validate amount
      if (orderData.amount && (orderData.amount <= 0 || orderData.amount > 100000)) {
        errors.push('Invalid order amount')
      }
      
      setValidationErrors(errors)
      return {
        isValid: errors.length === 0,
        errors
      }
    } catch (error) {
      console.error('Order confirmation validation error:', error)
      const validationError = ['Order validation failed']
      setValidationErrors(validationError)
      return {
        isValid: false,
        errors: validationError
      }
    } finally {
      setIsValidating(false)
    }
  }, [])
  
  return {
    isValidating,
    validationErrors,
    validateOrderConfirmation
  }
}