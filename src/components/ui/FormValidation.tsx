'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Shield, AlertCircle, CheckCircle } from 'lucide-react'

interface ValidatedInputProps {
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  icon?: React.ReactNode
  className?: string
  disabled?: boolean
}

export function ValidatedInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  className,
  disabled
}: ValidatedInputProps) {
  return (
    <div className="space-y-1">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${icon ? 'pl-10' : ''} ${error ? 'border-red-500' : ''} ${className}`}
          disabled={disabled}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  )
}

interface FormSecurityIndicatorProps {
  score: number
  maxScore?: number
  issues?: string[]
}

export function FormSecurityIndicator({ 
  score, 
  maxScore = 100, 
  issues = [] 
}: FormSecurityIndicatorProps) {
  const percentage = Math.round((score / maxScore) * 100)
  const isSecure = percentage >= 80 && issues.length === 0
  
  return (
    <div className="flex items-center gap-2 text-sm">
      <Shield className={`w-4 h-4 ${isSecure ? 'text-green-600' : 'text-yellow-600'}`} />
      <span className={isSecure ? 'text-green-600' : 'text-yellow-600'}>
        Security: {isSecure ? 'Good' : 'Checking...'}
      </span>
      {!isSecure && issues.length > 0 && (
        <Badge variant="outline" className="text-xs">
          {issues.length} issue{issues.length !== 1 ? 's' : ''}
        </Badge>
      )}
    </div>
  )
}

interface FormValidationSummaryProps {
  errors: Array<{ field: string; message: string }>
  isValid?: boolean
  className?: string
}

export function FormValidationSummary({ 
  errors, 
  isValid = false, 
  className 
}: FormValidationSummaryProps) {
  if (errors.length === 0 && isValid) {
    return (
      <Alert className={`border-green-200 bg-green-50 ${className}`}>
        <CheckCircle className="w-4 h-4 text-green-600" />
        <AlertDescription className="text-green-700">
          Form is valid and ready to submit.
        </AlertDescription>
      </Alert>
    )
  }

  if (errors.length === 0) {
    return null
  }

  return (
    <Alert className={`border-red-200 bg-red-50 ${className}`}>
      <AlertCircle className="w-4 h-4 text-red-600" />
      <AlertDescription className="text-red-700">
        <div className="space-y-1">
          <p className="font-medium">Please fix the following issues:</p>
          <ul className="text-sm space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="flex items-start gap-1">
                <span>•</span>
                <span>{error.message}</span>
              </li>
            ))}
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  )
}

interface FormSecurityStatusProps {
  status: 'secure' | 'warning' | 'error'
  message?: string
  className?: string
}

export function FormSecurityStatus({ 
  status, 
  message = 'Form security check complete', 
  className 
}: FormSecurityStatusProps) {
  const statusConfig = {
    secure: {
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: <Shield className="w-4 h-4" />
    },
    warning: {
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: <AlertCircle className="w-4 h-4" />
    },
    error: {
      color: 'text-red-600',
      bgColor: 'bg-red-50', 
      borderColor: 'border-red-200',
      icon: <AlertCircle className="w-4 h-4" />
    }
  }

  const config = statusConfig[status]

  return (
    <Alert className={`${config.bgColor} ${config.borderColor} ${className}`}>
      <div className={config.color}>
        {config.icon}
      </div>
      <AlertDescription className={config.color}>
        {message}
      </AlertDescription>
    </Alert>
  )
}

interface FormErrorRecoveryProps {
  onRetry?: () => void
  onReset?: () => void
  error?: string
  className?: string
}

export function FormErrorRecovery({ 
  onRetry, 
  onReset, 
  error, 
  className 
}: FormErrorRecoveryProps) {
  if (!error) return null

  return (
    <Alert className={`border-red-200 bg-red-50 ${className}`}>
      <AlertCircle className="w-4 h-4 text-red-600" />
      <AlertDescription className="text-red-700">
        <div className="space-y-3">
          <p className="font-medium">Something went wrong</p>
          <p className="text-sm">{error}</p>
          <div className="flex gap-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            )}
            {onReset && (
              <button
                onClick={onReset}
                className="px-3 py-1 border border-red-300 text-red-700 text-sm rounded hover:bg-red-100 transition-colors"
              >
                Reset Form
              </button>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
}