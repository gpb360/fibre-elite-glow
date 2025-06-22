'use client'

import { useState } from 'react'
import { AuthError } from '@supabase/supabase-js'
import { useToast } from '@/hooks/use-toast'
import { authDebugger } from '@/utils/auth-debug'

export interface AuthErrorState {
  hasError: boolean
  errorType: string
  message: string
  suggestions: string[]
  canRetry: boolean
  retryAction?: () => void
}

/**
 * Hook for handling authentication errors with detailed feedback
 */
export function useAuthErrorHandler() {
  const { toast } = useToast()
  const [errorState, setErrorState] = useState<AuthErrorState>({
    hasError: false,
    errorType: '',
    message: '',
    suggestions: [],
    canRetry: false,
  })

  const handleAuthError = (
    error: AuthError | Error,
    action: string,
    email?: string,
    retryCallback?: () => void
  ) => {
    // Log the error for debugging
    authDebugger.log({
      action,
      email,
      error,
      success: false,
    })

    // Get detailed error information
    const errorDetails = authDebugger.getErrorDetails(error)

    // Update error state
    const newErrorState: AuthErrorState = {
      hasError: true,
      errorType: errorDetails.type,
      message: errorDetails.message,
      suggestions: errorDetails.suggestions,
      canRetry: !errorDetails.type.includes('Rate Limited'),
      retryAction: retryCallback,
    }

    setErrorState(newErrorState)

    // Show toast notification
    toast({
      title: `${action} Failed`,
      description: errorDetails.message,
      variant: "destructive",
    })

    return newErrorState
  }

  const handleAuthSuccess = (action: string, email?: string, details?: any) => {
    // Log success for debugging
    authDebugger.log({
      action,
      email,
      success: true,
      details,
    })

    // Clear error state
    setErrorState({
      hasError: false,
      errorType: '',
      message: '',
      suggestions: [],
      canRetry: false,
    })

    // Show success toast
    toast({
      title: `${action} Successful`,
      description: getSuccessMessage(action),
    })
  }

  const clearError = () => {
    setErrorState({
      hasError: false,
      errorType: '',
      message: '',
      suggestions: [],
      canRetry: false,
    })
  }

  const retryLastAction = () => {
    if (errorState.retryAction) {
      clearError()
      errorState.retryAction()
    }
  }

  return {
    errorState,
    handleAuthError,
    handleAuthSuccess,
    clearError,
    retryLastAction,
  }
}

/**
 * Get success message for different actions
 */
function getSuccessMessage(action: string): string {
  switch (action.toLowerCase()) {
    case 'sign in':
      return 'Welcome back! You have successfully signed in.'
    case 'sign up':
      return 'Account created successfully! Please check your email to confirm.'
    case 'password reset':
      return 'Password reset email sent. Check your inbox.'
    case 'email confirmation':
      return 'Email confirmed successfully!'
    default:
      return 'Operation completed successfully.'
  }
}

/**
 * Hook for checking authentication prerequisites
 */
export function useAuthPrerequisites() {
  const checkEmailFormat = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const checkPasswordStrength = (password: string): {
    isValid: boolean
    issues: string[]
  } => {
    const issues: string[] = []

    if (password.length < 6) {
      issues.push('Password must be at least 6 characters long')
    }

    if (password.length < 8) {
      issues.push('Consider using at least 8 characters for better security')
    }

    if (!/[A-Z]/.test(password)) {
      issues.push('Consider adding uppercase letters for better security')
    }

    if (!/[0-9]/.test(password)) {
      issues.push('Consider adding numbers for better security')
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      issues.push('Consider adding special characters for better security')
    }

    return {
      isValid: password.length >= 6,
      issues,
    }
  }

  const validateCredentials = (email: string, password: string): {
    isValid: boolean
    errors: string[]
  } => {
    const errors: string[] = []

    if (!email) {
      errors.push('Email is required')
    } else if (!checkEmailFormat(email)) {
      errors.push('Please enter a valid email address')
    }

    if (!password) {
      errors.push('Password is required')
    } else {
      const passwordCheck = checkPasswordStrength(password)
      if (!passwordCheck.isValid) {
        errors.push(...passwordCheck.issues.filter(issue => 
          issue.includes('must be at least')
        ))
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  return {
    checkEmailFormat,
    checkPasswordStrength,
    validateCredentials,
  }
}
