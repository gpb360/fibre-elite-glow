'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ValidatedInput, FormSecurityIndicator, FormValidationSummary } from '@/components/ui/FormValidation'
import { useFormValidation } from '@/hooks/useFormValidation'
import { loginSchema } from '@/lib/validation'
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, Shield } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validFields, setValidFields] = useState(0)
  
  // Use enhanced form validation
  const {
    errors,
    isValid,
    isValidating,
    validate,
    clearErrors,
    resetValidation
  } = useFormValidation(loginSchema, {
    validateOnChange: true,
    showErrorToast: false
  })

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push('/account')
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Validate form data
    const validation = await validate(form)
    if (!validation.isValid) {
      setError('Please fix the validation errors above.')
      return
    }
    
    setIsSubmitting(true)

    try {
      // Additional security checks
      const sanitizedEmail = form.email.trim().toLowerCase()
      
      // Check for suspicious patterns
      if (sanitizedEmail.includes('<') || sanitizedEmail.includes('>')) {
        throw new Error('Invalid email format')
      }
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: form.password,
      })

      if (signInError) {
        // Enhanced error handling with security awareness
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.')
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link before signing in.')
        } else if (signInError.message.includes('Too many requests')) {
          setError('Too many login attempts. Please wait a few minutes before trying again.')
        } else if (signInError.message.includes('User not found')) {
          setError('No account found with this email address. Please check your email or sign up.')
        } else {
          setError('Login failed. Please try again or contact support if the problem persists.')
        }
        return
      }

      // Clear form data for security
      setForm({ email: '', password: '' })
      resetValidation()
      
      // Successful login - redirect will happen via useEffect
      router.push('/account')
    } catch (error) {
      console.error('Login error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError(null)
    clearErrors()
  }
  
  const handleValidationChange = (field: string) => (isValid: boolean, error?: string) => {
    setValidFields(prev => {
      const newCount = isValid ? prev + 1 : Math.max(0, prev - 1)
      return Math.min(2, newCount) // Maximum 2 fields (email, password)
    })
  }

  const handleForgotPassword = async () => {
    if (!form.email) {
      setError('Please enter your email address first.')
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        setError(error.message)
      } else {
        setError(null)
        alert('Password reset email sent! Check your inbox.')
      }
    } catch (error) {
      setError('Failed to send reset email. Please try again.')
    }
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  // Don't render if user is already logged in
  if (user) {
    return null
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account to view your orders and manage your profile
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
                {/* Security and validation indicators */}
                <FormSecurityIndicator 
                  isSecure={isValid && validFields === 2}
                  validFields={validFields}
                  totalFields={2}
                />
                
                {/* Form validation summary */}
                <FormValidationSummary 
                  errors={errors}
                  onFieldFocus={(fieldName) => {
                    const element = document.getElementById(fieldName)
                    element?.focus()
                  }}
                />
                
                {/* General error alert */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Email field with validation */}
                <ValidatedInput
                  id="email"
                  name="email"
                  type="email"
                  label="Email Address"
                  schema={loginSchema}
                  fieldName="email"
                  value={form.email}
                  onChange={handleChange}
                  onValidationChange={handleValidationChange('email')}
                  showSecurityIndicator={true}
                  helperText="Enter the email address associated with your account"
                  required
                  placeholder="your@email.com"
                />

                {/* Password field with validation */}
                <ValidatedInput
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  schema={loginSchema}
                  fieldName="password"
                  value={form.password}
                  onChange={handleChange}
                  onValidationChange={handleValidationChange('password')}
                  showSecurityIndicator={true}
                  helperText="Enter your account password"
                  required
                  placeholder="Enter your password"
                />

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-green-600 hover:text-green-700"
                    data-testid="forgot-password-link"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid || isValidating}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  data-testid="submit-button"
                >
                  {isSubmitting ? (
                    "Signing in..."
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Sign In Securely
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/signup" className="text-green-600 hover:text-green-700 font-medium">
                    Sign up here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  )
}