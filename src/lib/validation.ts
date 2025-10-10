import { z } from 'zod';
import { 
  enhancedEmailSchema, 
  enhancedPasswordSchema, 
  enhancedNameSchema, 
  enhancedPhoneSchema,
  enhancedRegisterSchema,
  enhancedLoginSchema,
  enhancedCheckoutSchema,
  SecurityValidation
} from './form-validation'

// Legacy dangerous patterns (deprecated - use SecurityValidation instead)
const DANGEROUS_PATTERNS = [
  /<script[^>]*>/gi,
  /<\/script>/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /onload=/gi,
  /onerror=/gi,
  /onclick=/gi,
  /onmouseover=/gi,
  /<iframe[^>]*>/gi,
  /<object[^>]*>/gi,
  /<embed[^>]*>/gi,
];

// Legacy validation functions (deprecated - use SecurityValidation from form-validation.ts instead)
const isSecureInput = SecurityValidation.isSecureInput
const sanitizeAndValidate = SecurityValidation.sanitizeInput

// Re-export enhanced schemas for backward compatibility
export const emailSchema = enhancedEmailSchema
export const passwordSchema = enhancedPasswordSchema
export const nameSchema = enhancedNameSchema
export const registerSchema = enhancedRegisterSchema
export const loginSchema = enhancedLoginSchema
export const checkoutCustomerSchema = enhancedCheckoutSchema



// Address schema with comprehensive validation
export const addressSchema = z.object({
  line1: z.string()
    .min(1, 'Address is required')
    .max(100, 'Address is too long')
    .refine((value) => isSecureInput(value), 'Address contains invalid characters')
    .transform(sanitizeAndValidate),
  line2: z.string()
    .max(100, 'Address line 2 is too long')
    .optional()
    .transform(val => val ? sanitizeAndValidate(val) : val),
  city: z.string()
    .min(1, 'City is required')
    .max(50, 'City name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'City contains invalid characters')
    .refine((value) => isSecureInput(value), 'City contains invalid characters')
    .transform(sanitizeAndValidate),
  state: z.string()
    .min(2, 'State is required')
    .max(50, 'State name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'State contains invalid characters')
    .refine((value) => isSecureInput(value), 'State contains invalid characters')
    .transform(sanitizeAndValidate),
  postal_code: z.string()
    .min(5, 'Postal code is required')
    .max(10, 'Postal code is too long')
    .regex(/^[a-zA-Z0-9\s-]+$/, 'Invalid postal code format')
    .refine((value) => isSecureInput(value), 'Postal code contains invalid characters')
    .transform(sanitizeAndValidate),
  country: z.string()
    .length(2, 'Country code must be 2 characters')
    .regex(/^[A-Z]{2}$/, 'Invalid country code format')
    .default('US'),
});

// Complete checkout form validation
export const checkoutFormSchema = z.object({
  customerInfo: checkoutCustomerSchema,
  address: addressSchema,
  items: z.array(z.object({
    id: z.string().min(1, 'Product ID is required'),
    productName: z.string().min(1, 'Product name is required'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1').max(10, 'Maximum 10 items per product'),
    price: z.number().min(0.01, 'Price must be greater than 0'),
  })).min(1, 'Cart cannot be empty'),
});

// Contact form schema
export const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  email: emailSchema,
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject is too long'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message is too long'),
});

// Cart item schema
export const cartItemSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
  productName: z.string().min(1, 'Product name is required'),
  productType: z.enum(['total_essential', 'total_essential_plus']),
  packageType: z.string().min(1, 'Package type is required'),
  price: z.number().min(0, 'Price must be positive'),
  originalPrice: z.number().min(0, 'Original price must be positive').optional(),
  savings: z.number().min(0, 'Savings must be positive').optional(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(10, 'Maximum 10 items per product'),
  image: z.string().url('Invalid image URL').optional(),
});

// Checkout session schema
export const checkoutSessionSchema = z.object({
  items: z.array(cartItemSchema).min(1, 'Cart cannot be empty'),
  customerEmail: emailSchema.optional(),
  successUrl: z.string().url('Invalid success URL'),
  cancelUrl: z.string().url('Invalid cancel URL'),
});



// Product review schema
export const reviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
  title: z.string().min(1, 'Review title is required').max(200, 'Title is too long'),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(1000, 'Comment is too long'),
  productId: z.string().min(1, 'Product ID is required'),
  verified: z.boolean().optional(),
});

// Search schema
export const searchSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(100, 'Search query is too long')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Search query contains invalid characters'),
  limit: z.number().int().min(1).max(50).optional().default(10),
  page: z.number().int().min(1).optional().default(1),
});

// File upload schema
export const fileUploadSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  contentType: z.string().regex(/^[a-zA-Z0-9\/\-\+]+$/, 'Invalid content type'),
  size: z.number().int().min(1).max(5 * 1024 * 1024), // 5MB max
});

// API key validation (for admin endpoints)
export const apiKeySchema = z.string().min(32, 'Invalid API key format');

// Webhook validation schema
export const webhookSchema = z.object({
  signature: z.string().min(1, 'Webhook signature is required'),
  payload: z.string().min(1, 'Webhook payload is required'),
  timestamp: z.number().int().min(0, 'Invalid timestamp'),
});

// Environment validation schema
export const envSchema = z.object({
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(100),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(100),
});

// Validation helper function
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: string[] } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return {
      success: false,
      errors: ['Validation failed']
    };
  }
}

// Sanitization helpers
export function sanitizeHtml(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim()
    .substring(0, 1000); // Limit length
}