'use client'

import { useState, useEffect, useCallback } from 'react'
import { z } from 'zod'

interface UseFormValidationOptions {
  validateOnChange?: boolean
  showErrorToast?: boolean
  debounceMs?: number
}

interface FormError {
  field: string
  message: string
  code?: string
}

interface UseFormValidationReturn {
  errors: FormError[]
  isValid: boolean
  isValidating: boolean
  validate: (data: any) => Promise<boolean>
  validateField: (fieldName: string, value: any) => Promise<boolean>
  clearErrors: () => void
  resetValidation: () => void
  getFieldError: (fieldName: string) => string | undefined
}

export function useFormValidation<T>(
  schema: z.ZodSchema<T>,
  options: UseFormValidationOptions = {}
): UseFormValidationReturn {
  const {
    validateOnChange = false,
    showErrorToast = false,
    debounceMs = 300
  } = options

  const [errors, setErrors] = useState<FormError[]>([])
  const [isValid, setIsValid] = useState(false)
  const [isValidating, setIsValidating] = useState(false)

  // Debounced validation
  const [validationTimeout, setValidationTimeout] = useState<NodeJS.Timeout | null>(null)

  const validate = useCallback(async (data: any): Promise<boolean> => {
    setIsValidating(true)
    
    try {
      await schema.parseAsync(data)
      setErrors([])
      setIsValid(true)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }))
        setErrors(formErrors)
        setIsValid(false)
        return false
      }
      
      setErrors([{ field: 'general', message: 'Validation failed' }])
      setIsValid(false)
      return false
    } finally {
      setIsValidating(false)
    }
  }, [schema])

  const validateField = useCallback(async (fieldName: string, value: any): Promise<boolean> => {
    try {
      // Extract field schema if possible
      const shape = (schema as any).shape
      if (shape && shape[fieldName]) {
        const fieldSchema = shape[fieldName]
        await fieldSchema.parseAsync(value)
        
        // Remove any existing errors for this field
        setErrors(prev => prev.filter(err => err.field !== fieldName))
        return true
      }
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = {
          field: fieldName,
          message: error.errors[0]?.message || 'Invalid input',
          code: error.errors[0]?.code
        }
        
        // Update errors for this field
        setErrors(prev => {
          const filtered = prev.filter(err => err.field !== fieldName)
          return [...filtered, fieldError]
        })
        return false
      }
      return false
    }
  }, [schema])

  const clearErrors = useCallback(() => {
    setErrors([])
    setIsValid(false)
  }, [])

  const resetValidation = useCallback(() => {
    setErrors([])
    setIsValid(false)
    setIsValidating(false)
    if (validationTimeout) {
      clearTimeout(validationTimeout)
      setValidationTimeout(null)
    }
  }, [validationTimeout])

  const getFieldError = useCallback((fieldName: string): string | undefined => {
    const error = errors.find(err => err.field === fieldName)
    return error?.message
  }, [errors])

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (validationTimeout) {
        clearTimeout(validationTimeout)
      }
    }
  }, [validationTimeout])

  return {
    errors,
    isValid,
    isValidating,
    validate,
    validateField,
    clearErrors,
    resetValidation,
    getFieldError
  }
}