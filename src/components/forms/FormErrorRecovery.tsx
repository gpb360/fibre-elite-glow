'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  AlertTriangle, 
  RefreshCw, 
  Shield, 
  Clock, 
  Wifi, 
  WifiOff, 
  CheckCircle,
  XCircle,
  HelpCircle,
  Mail,
  Phone
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FormError {
  type: 'validation' | 'network' | 'authentication' | 'rate-limit' | 'server' | 'unknown'
  field?: string
  message: string
  code?: string
  retryable: boolean
  timestamp: Date
}

interface FormErrorRecoveryProps {
  errors: FormError[]
  onRetry?: () => void
  onClearErrors?: () => void
  onFieldFocus?: (fieldName: string) => void
  isRetrying?: boolean
  className?: string
}

export function FormErrorRecovery({
  errors,
  onRetry,
  onClearErrors,
  onFieldFocus,
  isRetrying = false,
  className
}: FormErrorRecoveryProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    onRetry?.()
  }

  if (errors.length === 0) return null

  const errorsByType = errors.reduce((acc, error) => {
    if (!acc[error.type]) acc[error.type] = []
    acc[error.type].push(error)
    return acc
  }, {} as Record<string, FormError[]>)

  const getErrorIcon = (type: string) => {
    switch (type) {
      case 'validation':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'network':
        return <WifiOff className="h-4 w-4 text-red-600" />
      case 'authentication':
        return <Shield className="h-4 w-4 text-red-600" />
      case 'rate-limit':
        return <Clock className="h-4 w-4 text-orange-600" />
      case 'server':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <HelpCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getErrorTitle = (type: string) => {
    switch (type) {
      case 'validation':
        return 'Form Validation Issues'
      case 'network':
        return 'Connection Problems'
      case 'authentication':
        return 'Authentication Error'
      case 'rate-limit':
        return 'Too Many Attempts'
      case 'server':
        return 'Server Error'
      default:
        return 'Unexpected Error'
    }
  }

  const getRecoveryActions = (type: string, errors: FormError[]) => {
    switch (type) {
      case 'validation':
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Please review and correct the highlighted fields:
            </p>
            <div className="space-y-1">
              {errors.map((error, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-red-600">{error.message}</span>
                  {error.field && onFieldFocus && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onFieldFocus(error.field!)}
                      className="ml-2"
                    >
                      Fix
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      case 'network':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm">
                Connection: {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {isOnline 
                ? 'Connection restored. You can try submitting again.'
                : 'Please check your internet connection and try again.'
              }
            </p>
            {isOnline && (
              <Button
                onClick={handleRetry}
                disabled={isRetrying}
                size="sm"
                className="w-full"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry Submission
                  </>
                )}
              </Button>
            )}
          </div>
        )

      case 'authentication':
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Your session may have expired. Please try logging in again.
            </p>
            <div className="flex space-x-2">
              <Button
                onClick={() => window.location.href = '/login'}
                size="sm"
                variant="outline"
              >
                Go to Login
              </Button>
              <Button
                onClick={handleRetry}
                disabled={isRetrying}
                size="sm"
              >
                Try Again
              </Button>
            </div>
          </div>
        )

      case 'rate-limit':
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Too many attempts detected. Please wait a few minutes before trying again.
            </p>
            <div className="flex items-center space-x-2 text-xs text-orange-600">
              <Clock className="h-3 w-3" />
              <span>Rate limit active for security</span>
            </div>
          </div>
        )

      case 'server':
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              We're experiencing temporary technical difficulties. Please try again in a few moments.
            </p>
            <div className="flex space-x-2">
              <Button
                onClick={handleRetry}
                disabled={isRetrying || retryCount >= 3}
                size="sm"
                variant="outline"
              >
                {isRetrying ? 'Retrying...' : `Retry ${retryCount > 0 ? `(${retryCount}/3)` : ''}`}
              </Button>
              <Button
                onClick={() => window.location.href = '/contact'}
                size="sm"
                variant="ghost"
              >
                Contact Support
              </Button>
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              An unexpected error occurred. Please try again or contact support if the problem persists.
            </p>
            <div className="flex space-x-2">
              {onRetry && (
                <Button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  size="sm"
                  variant="outline"
                >
                  Try Again
                </Button>
              )}
              <Button
                onClick={() => window.location.href = '/contact'}
                size="sm"
                variant="ghost"
              >
                Get Help
              </Button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {Object.entries(errorsByType).map(([type, typeErrors]) => (
        <Alert key={type} variant="destructive" className="border-l-4">
          <div className="flex items-start space-x-3">
            {getErrorIcon(type)}
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{getErrorTitle(type)}</h4>
                <Badge variant="outline" className="text-xs">
                  {typeErrors.length} error{typeErrors.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              {getRecoveryActions(type, typeErrors)}
            </div>
          </div>
        </Alert>
      ))}

      {/* General actions */}
      <div className="flex justify-between items-center pt-2">
        {onClearErrors && (
          <Button
            onClick={onClearErrors}
            variant="ghost"
            size="sm"
            className="text-gray-600"
          >
            Clear All Errors
          </Button>
        )}
        
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Mail className="h-3 w-3" />
            <span>support@fibreliteglow.com</span>
          </div>
          <div className="flex items-center space-x-1">
            <Phone className="h-3 w-3" />
            <span>1-800-FIBER</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Hook to manage form errors with automatic recovery suggestions
 */
export function useFormErrorRecovery() {
  const [errors, setErrors] = useState<FormError[]>([])
  const [isRetrying, setIsRetrying] = useState(false)

  const addError = (error: Omit<FormError, 'timestamp'>) => {
    const newError: FormError = {
      ...error,
      timestamp: new Date()
    }
    setErrors(prev => [...prev, newError])
  }

  const clearErrors = () => {
    setErrors([])
  }

  const clearErrorsByType = (type: FormError['type']) => {
    setErrors(prev => prev.filter(error => error.type !== type))
  }

  const clearErrorsByField = (field: string) => {
    setErrors(prev => prev.filter(error => error.field !== field))
  }

  const retry = async (retryFn: () => Promise<void>) => {
    setIsRetrying(true)
    try {
      await retryFn()
      clearErrors()
    } catch (error) {
      console.error('Retry failed:', error)
    } finally {
      setIsRetrying(false)
    }
  }

  return {
    errors,
    isRetrying,
    addError,
    clearErrors,
    clearErrorsByType,
    clearErrorsByField,
    retry
  }
}

/**
 * Form error boundary for catching and handling form-specific errors
 */
interface FormErrorBoundaryProps {
  children: React.ReactNode
  onError?: (error: FormError) => void
  fallback?: React.ReactNode
}

export function FormErrorBoundary({ children, onError, fallback }: FormErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<FormError | null>(null)

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const formError: FormError = {
        type: 'unknown',
        message: event.message || 'An unexpected error occurred',
        retryable: true,
        timestamp: new Date()
      }
      setError(formError)
      setHasError(true)
      onError?.(formError)
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [onError])

  if (hasError) {
    return fallback || (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">Form Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">
            {error?.message || 'An error occurred while processing the form.'}
          </p>
          <Button
            onClick={() => {
              setHasError(false)
              setError(null)
            }}
            className="mt-3"
            variant="outline"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return <>{children}</>
}