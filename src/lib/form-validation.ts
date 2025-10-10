import { z } from 'zod'

// Enhanced security patterns for input validation
const DANGEROUS_PATTERNS = [
  /<script[^>]*>/gi,
  /<\/script>/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /onload=/gi,
  /onerror=/gi,
  /onclick=/gi,
  /onmouseover=/gi,
  /onmouseout=/gi,
  /onfocus=/gi,
  /onblur=/gi,
  /<iframe[^>]*>/gi,
  /<object[^>]*>/gi,
  /<embed[^>]*>/gi,
  /<form[^>]*>/gi,
  /<input[^>]*>/gi,
  /document\.cookie/gi,
  /document\.write/gi,
  /eval\(/gi,
  /setTimeout\(/gi,
  /setInterval\(/gi
]

// Common SQL injection patterns
const SQL_INJECTION_PATTERNS = [
  /('|(\\');|(\\');|(\\")|(\\")|(\`;)|(\\`;))/gi,
  /(union|select|insert|delete|update|drop|create|alter|exec|execute)/gi,
  /(--)|(\/\*)|(\*\/)/gi,
  /(or\s+1\s*=\s*1)|(and\s+1\s*=\s*1)/gi
]

// Suspicious email patterns
const SUSPICIOUS_EMAIL_PATTERNS = [
  /\+.*\+/g, // Multiple plus signs
  /\.{2,}/g, // Multiple consecutive dots
  /@.*@/g,   // Multiple @ symbols
  /[<>]/g    // HTML brackets
]

/**
 * Enhanced security validation functions
 */
export const SecurityValidation = {
  /**
   * Check if input contains dangerous XSS patterns
   */
  isSecureInput: (value: string): boolean => {
    return !DANGEROUS_PATTERNS.some(pattern => pattern.test(value))
  },

  /**
   * Check if input contains SQL injection patterns
   */
  isSQLSafe: (value: string): boolean => {
    return !SQL_INJECTION_PATTERNS.some(pattern => pattern.test(value))
  },

  /**
   * Sanitize input by removing dangerous patterns
   */
  sanitizeInput: (value: string): string => {
    let sanitized = value
    DANGEROUS_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '')
    })
    SQL_INJECTION_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '')
    })
    return sanitized.trim()
  },

  /**
   * Enhanced email validation
   */
  isValidEmail: (email: string): boolean => {
    const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const hasValidFormat = basicEmailRegex.test(email)
    const hasSuspiciousPatterns = SUSPICIOUS_EMAIL_PATTERNS.some(pattern => pattern.test(email))
    const hasValidLength = email.length <= 254 // RFC 5321 limit
    
    return hasValidFormat && !hasSuspiciousPatterns && hasValidLength
  },

  /**
   * Password strength validation
   */
  getPasswordStrength: (password: string) => {
    const checks = {
      length: password.length >= 8,
      minLength: password.length >= 12, // Recommended minimum
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      noCommonWords: !/(password|123456|qwerty|admin|user|guest)/i.test(password),
      noRepeating: !/(.)\1{2,}/.test(password) // No character repeated 3+ times
    }
    
    const score = Object.values(checks).filter(Boolean).length
    return {
      score,
      maxScore: Object.keys(checks).length,
      checks,
      strength: score >= 7 ? 'strong' : score >= 5 ? 'medium' : score >= 3 ? 'weak' : 'very-weak'
    }
  },

  /**
   * Phone number validation
   */
  isValidPhone: (phone: string): boolean => {
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '')
    
    // Must be 10-15 digits (international format)
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return false
    }
    
    // Check for valid phone format patterns
    const validPatterns = [
      /^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/, // US/Canada format
      /^\+?[1-9]\d{1,14}$/                 // International format
    ]
    
    return validPatterns.some(pattern => pattern.test(digitsOnly))
  },

  /**
   * Name validation (preventing malicious input)
   */
  isValidName: (name: string): boolean => {
    // Allow letters, spaces, apostrophes, hyphens, and dots
    const namePattern = /^[a-zA-Z\s'\-\.]+$/
    const hasValidLength = name.length >= 1 && name.length <= 50
    const hasValidFormat = namePattern.test(name)
    const hasNoExcessiveSpaces = !/\s{3,}/.test(name) // No more than 2 consecutive spaces
    
    return hasValidLength && hasValidFormat && hasNoExcessiveSpaces && SecurityValidation.isSecureInput(name)
  }
}

/**
 * Enhanced Zod schemas with comprehensive validation
 */

// Enhanced email schema
export const enhancedEmailSchema = z
  .string()
  .min(1, 'Email is required')
  .max(254, 'Email is too long')
  .refine(SecurityValidation.isValidEmail, 'Please enter a valid email address')
  .refine(SecurityValidation.isSecureInput, 'Email contains invalid characters')
  .transform(SecurityValidation.sanitizeInput)

// Enhanced password schema
export const enhancedPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .refine(SecurityValidation.isSecureInput, 'Password contains invalid characters')
  .refine((password) => {
    const strength = SecurityValidation.getPasswordStrength(password)
    return strength.score >= 4
  }, 'Password must include uppercase, lowercase, number, and special character')

// Enhanced name schema
export const enhancedNameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(50, 'Name is too long')
  .refine(SecurityValidation.isValidName, 'Name contains invalid characters')
  .transform(SecurityValidation.sanitizeInput)

// Enhanced phone schema
export const enhancedPhoneSchema = z
  .string()
  .optional()
  .refine((phone) => {
    if (!phone) return true // Optional field
    return SecurityValidation.isValidPhone(phone)
  }, 'Please enter a valid phone number')
  .refine((phone) => {
    if (!phone) return true
    return SecurityValidation.isSecureInput(phone)
  }, 'Phone number contains invalid characters')
  .transform((phone) => phone ? SecurityValidation.sanitizeInput(phone) : phone)

/**
 * Complete form schemas using enhanced validation
 */

// Enhanced registration schema
export const enhancedRegisterSchema = z.object({
  email: enhancedEmailSchema,
  password: enhancedPasswordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  firstName: enhancedNameSchema,
  lastName: enhancedNameSchema,
  phone: enhancedPhoneSchema,
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions')
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
).refine(
  (data) => SecurityValidation.isSQLSafe(data.email + data.firstName + data.lastName),
  {
    message: "Form contains potentially dangerous content",
    path: ["email"]
  }
)

// Enhanced login schema
export const enhancedLoginSchema = z.object({
  email: enhancedEmailSchema,
  password: z
    .string()
    .min(1, 'Password is required')
    .max(128, 'Password is too long')
    .refine(SecurityValidation.isSecureInput, 'Password contains invalid characters')
})

// Enhanced checkout schema
export const enhancedCheckoutSchema = z.object({
  email: enhancedEmailSchema,
  firstName: enhancedNameSchema,
  lastName: enhancedNameSchema,
  phone: enhancedPhoneSchema,
  address: z.string()
    .min(5, 'Address is required')
    .max(200, 'Address is too long')
    .refine(SecurityValidation.isSecureInput, 'Address contains invalid characters')
    .transform(SecurityValidation.sanitizeInput),
  city: enhancedNameSchema,
  state: z.string()
    .min(2, 'State is required')
    .max(50, 'State name is too long')
    .refine(SecurityValidation.isSecureInput, 'State contains invalid characters')
    .transform(SecurityValidation.sanitizeInput),
  zipCode: z.string()
    .min(5, 'ZIP code is required')
    .max(10, 'ZIP code is too long')
    .regex(/^[\d\-\s]+$/, 'ZIP code must contain only numbers, spaces, and hyphens')
    .refine(SecurityValidation.isSecureInput, 'ZIP code contains invalid characters')
    .transform(SecurityValidation.sanitizeInput),
  country: z.string()
    .min(2, 'Country is required')
    .max(50, 'Country name is too long')
    .refine(SecurityValidation.isSecureInput, 'Country contains invalid characters')
    .transform(SecurityValidation.sanitizeInput)
})

/**
 * Form validation utilities
 */
export const FormValidationUtils = {
  /**
   * Validate entire form and return detailed results
   */
  validateForm: async <T>(schema: z.ZodSchema<T>, data: unknown) => {
    try {
      const result = await schema.parseAsync(data)
      return {
        success: true,
        data: result,
        errors: []
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          data: null,
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code
          }))
        }
      }
      return {
        success: false,
        data: null,
        errors: [{ field: 'general', message: 'Validation failed', code: 'unknown' }]
      }
    }
  },

  /**
   * Validate single field
   */
  validateField: async (schema: z.ZodSchema<any>, fieldName: string, value: unknown) => {
    try {
      const shape = (schema as any).shape
      if (!shape || !shape[fieldName]) {
        return { success: true, error: null }
      }

      const fieldSchema = shape[fieldName]
      await fieldSchema.parseAsync(value)
      return { success: true, error: null }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: error.errors[0]?.message || 'Invalid input'
        }
      }
      return { success: false, error: 'Validation failed' }
    }
  },

  /**
   * Get form security score
   */
  getFormSecurityScore: (formData: Record<string, any>) => {
    let score = 0
    let maxScore = 0
    const issues: string[] = []

    // Check each field for security issues
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'string' && value.length > 0) {
        maxScore += 3 // 3 points per field

        // XSS check
        if (SecurityValidation.isSecureInput(value)) {
          score += 1
        } else {
          issues.push(`${key}: Contains potentially dangerous content`)
        }

        // SQL injection check
        if (SecurityValidation.isSQLSafe(value)) {
          score += 1
        } else {
          issues.push(`${key}: Contains SQL injection patterns`)
        }

        // Length check
        if (value.length <= 1000) { // Reasonable length limit
          score += 1
        } else {
          issues.push(`${key}: Input is too long`)
        }
      }
    })

    return {
      score,
      maxScore,
      percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 100,
      issues,
      isSecure: issues.length === 0 && score === maxScore
    }
  },

  /**
   * Sanitize entire form data
   */
  sanitizeFormData: (formData: Record<string, any>) => {
    const sanitized: Record<string, any> = {}
    
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'string') {
        sanitized[key] = SecurityValidation.sanitizeInput(value)
      } else {
        sanitized[key] = value
      }
    })
    
    return sanitized
  }
}

/**
 * Rate limiting utilities for forms
 */
export const FormRateLimiting = {
  attempts: new Map<string, { count: number; lastAttempt: Date; blocked: boolean }>(),

  /**
   * Check if form submission is allowed
   */
  isSubmissionAllowed: (identifier: string, maxAttempts = 5, windowMinutes = 15) => {
    const now = new Date()
    const key = identifier.toLowerCase()
    const record = FormRateLimiting.attempts.get(key)

    if (!record) {
      return { allowed: true, remaining: maxAttempts - 1, resetTime: null }
    }

    const windowMs = windowMinutes * 60 * 1000
    const timeSinceLastAttempt = now.getTime() - record.lastAttempt.getTime()

    // Reset if window has passed
    if (timeSinceLastAttempt > windowMs) {
      FormRateLimiting.attempts.delete(key)
      return { allowed: true, remaining: maxAttempts - 1, resetTime: null }
    }

    // Check if blocked
    if (record.count >= maxAttempts) {
      const resetTime = new Date(record.lastAttempt.getTime() + windowMs)
      return { allowed: false, remaining: 0, resetTime }
    }

    return { 
      allowed: true, 
      remaining: maxAttempts - record.count - 1,
      resetTime: null
    }
  },

  /**
   * Record form submission attempt
   */
  recordAttempt: (identifier: string, success = false) => {
    const now = new Date()
    const key = identifier.toLowerCase()
    const record = FormRateLimiting.attempts.get(key)

    if (success) {
      // Clear attempts on successful submission
      FormRateLimiting.attempts.delete(key)
      return
    }

    if (!record) {
      FormRateLimiting.attempts.set(key, {
        count: 1,
        lastAttempt: now,
        blocked: false
      })
    } else {
      record.count += 1
      record.lastAttempt = now
      record.blocked = record.count >= 5
    }
  }
}