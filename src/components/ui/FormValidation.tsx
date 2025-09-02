'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Shield, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { z } from 'zod'

interface ValidatedInputProps {
  id?: string
  name?: string
  type?: string
  label?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onValidationChange?: (isValid: boolean, error?: string) => void
  error?: string
  icon?: React.ReactNode
  className?: string
  disabled?: boolean
  required?: boolean
  helperText?: string
  showSecurityIndicator?: boolean
  schema?: z.ZodObject<any> | z.ZodEffects<any>
  fieldName?: string
  'data-testid'?: string
}

export function ValidatedInput({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onValidationChange,
  error: externalError,
  icon,
  className,
  disabled,
  required,
  helperText,
  showSecurityIndicator = false,
  schema,
  fieldName,
  'data-testid': dataTestId,
  ...props
}: ValidatedInputProps) {
  const [internalError, setInternalError] = useState<string | undefined>()
  const [isValid, setIsValid] = useState(false)

  // Use external error if provided, otherwise use internal error
  const displayError = externalError || internalError

  // Validate field when value changes
  useEffect(() => {
    if (schema && fieldName && value !== undefined) {
      try {
        // Create a partial object for validation
        const fieldData = { [fieldName]: value }

        // Try to validate the specific field
        if ('shape' in schema && schema.shape && fieldName in schema.shape) {
          // For ZodObject, validate the specific field
          const fieldSchema = schema.shape[fieldName]
          fieldSchema.parse(value)
        } else {
          // For other schema types, validate the full object
          schema.parse(fieldData)
        }

        setInternalError(undefined)
        setIsValid(true)
        onValidationChange?.(true)
      } catch (err) {
        if (err instanceof z.ZodError) {
          const fieldError = err.errors.find(e =>
            e.path.length === 0 || e.path.includes(fieldName)
          )
          const errorMessage = fieldError?.message || 'Invalid input'
          setInternalError(errorMessage)
          setIsValid(false)
          onValidationChange?.(false, errorMessage)
        }
      }
    } else {
      // If no schema validation, consider it valid if not empty (when required)
      const fieldIsValid = required ? value.trim().length > 0 : true
      setIsValid(fieldIsValid)
      onValidationChange?.(fieldIsValid)
    }
  }, [value, schema, fieldName, required, onValidationChange])

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${icon ? 'pl-10' : ''} ${displayError ? 'border-red-500 focus:border-red-500' : isValid && value ? 'border-green-500' : ''} ${className}`}
          disabled={disabled}
          required={required}
          data-testid={dataTestId}
          {...props}
        />

        {showSecurityIndicator && isValid && value && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
        )}
      </div>

      {displayError && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {displayError}
        </p>
      )}

      {helperText && !displayError && (
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <Info className="w-3 h-3" />
          {helperText}
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