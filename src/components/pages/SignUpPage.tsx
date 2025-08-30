'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { ValidatedInput, FormSecurityIndicator, FormValidationSummary } from '@/components/ui/FormValidation'
import { useFormValidation } from '@/hooks/useFormValidation'
import { registerSchema } from '@/lib/validation'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle, Shield, Phone } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ErrorBoundary } from '@/components/error'

interface SignUpForm {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone: string
  acceptTerms: boolean
  acceptMarketing: boolean
}

export default function SignUpPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [form, setForm] = useState<SignUpForm>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    acceptTerms: false,
    acceptMarketing: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [validFields, setValidFields] = useState(0)
  const [attemptCount, setAttemptCount] = useState(0)
  
  // Use enhanced form validation
  const {
    errors,
    isValid,
    isValidating,
    validate,
    clearErrors,
    resetValidation
  } = useFormValidation(registerSchema, {
    validateOnChange: true,
    showErrorToast: false
  })

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push('/account')
    }
  }, [user, loading, router])

  // Enhanced password strength checker
  const getPasswordStrength = (password: string) => {
    let strength = 0
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
    
    strength = Object.values(checks).filter(Boolean).length
    return { strength, checks }
  }
  
  const passwordStrength = getPasswordStrength(form.password)
  
  // Enhanced security validation
  const performSecurityChecks = (formData: SignUpForm) => {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /onload=/i,
      /onerror=/i
    ]
    
    const fields = [formData.email, formData.firstName, formData.lastName]
    for (const field of fields) {
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(field)) {
          return { isValid: false, error: 'Invalid characters detected in form data.' }
        }
      }
    }
    
    return { isValid: true }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setAttemptCount(prev => prev + 1)
    
    // Rate limiting for signup attempts
    if (attemptCount >= 5) {
      setError('Too many signup attempts. Please wait 5 minutes before trying again.')
      return
    }
    
    // Validate form data with enhanced schema
    const validation = await validate(form)
    if (!validation.isValid) {
      setError('Please fix the validation errors above.')
      return
    }
    
    // Additional security checks
    const securityCheck = performSecurityChecks(form)
    if (!securityCheck.isValid) {
      setError(securityCheck.error!)
      return
    }

    setIsSubmitting(true)

    try {
      // Create user account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            first_name: form.firstName.trim(),
            last_name: form.lastName.trim(),
            phone: form.phone.trim(),
            marketing_consent: form.acceptMarketing
          }
        }
      })

      if (signUpError) {
        if (signUpError.message.includes('User already registered')) {
          setError('An account with this email already exists. Please sign in instead.')
        } else {
          setError(signUpError.message)
        }
        return
      }

      if (data.user) {
        // Create customer profile
        const { error: profileError } = await supabase
          .from('customer_profiles')
          .insert({
            user_id: data.user.id,
            first_name: form.firstName.trim(),
            last_name: form.lastName.trim(),
            phone: form.phone.trim(),
            marketing_consent: form.acceptMarketing,
            newsletter_consent: form.acceptMarketing
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          // Don't show error to user as auth succeeded
        }

        setSuccess('Account created successfully! Please check your email for a confirmation link.')
        setForm({
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          phone: '',
          acceptTerms: false,
          acceptMarketing: false
        })
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (error) setError(null)
    if (success) setSuccess(null)
    clearErrors()
  }
  
  const handleValidationChange = (field: string) => (isValid: boolean, error?: string) => {
    setValidFields(prev => {
      const change = isValid ? 1 : -1
      const newCount = Math.max(0, prev + change)
      return Math.min(6, newCount) // Maximum 6 fields (firstName, lastName, email, password, confirmPassword, phone)
    })
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
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('SignUp Error:', error, errorInfo)
      }}
      resetKeys={[attemptCount]}
    >
      <Header />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="mt-2 text-sm text-gray-600">
              Join Fibre Elite Glow and start your wellness journey today
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Fill in your details to create your secure account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="signup-form">
                {/* Security and validation indicators */}
                <FormSecurityIndicator 
                  isSecure={isValid && validFields >= 5 && form.acceptTerms}
                  validFields={validFields}
                  totalFields={6}
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

                {/* Success alert */}
                {success && (
                  <Alert className="border-green-500 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}

                {/* Name fields row */}
                <div className="grid grid-cols-2 gap-4">
                  <ValidatedInput
                    id="firstName"
                    name="firstName"
                    type="text"
                    label="First Name"
                    schema={registerSchema}
                    fieldName="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    onValidationChange={handleValidationChange('firstName')}
                    showSecurityIndicator={true}
                    helperText="Enter your first name"
                    required
                    placeholder="John"
                    data-testid="first-name-input"
                  />
                  
                  <ValidatedInput
                    id="lastName"
                    name="lastName"
                    type="text"
                    label="Last Name"
                    schema={registerSchema}
                    fieldName="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    onValidationChange={handleValidationChange('lastName')}
                    showSecurityIndicator={true}
                    helperText="Enter your last name"
                    required
                    placeholder="Doe"
                    data-testid="last-name-input"
                  />
                </div>

                {/* Email field with validation */}
                <ValidatedInput
                  id="email"
                  name="email"
                  type="email"
                  label="Email Address"
                  schema={registerSchema}
                  fieldName="email"
                  value={form.email}
                  onChange={handleChange}
                  onValidationChange={handleValidationChange('email')}
                  showSecurityIndicator={true}
                  helperText="Enter a valid email address for account verification"
                  required
                  placeholder="your@email.com"
                  data-testid="email-input"
                />

                {/* Phone field with validation */}
                <ValidatedInput
                  id="phone"
                  name="phone"
                  type="tel"
                  label="Phone Number (Optional)"
                  schema={registerSchema}
                  fieldName="phone"
                  value={form.phone}
                  onChange={handleChange}
                  onValidationChange={handleValidationChange('phone')}
                  showSecurityIndicator={false}
                  helperText="Optional: For order updates and customer support"
                  placeholder="(555) 123-4567"
                  data-testid="phone-input"
                />

                {/* Password field with strength indicator */}
                <div className="space-y-2">
                  <ValidatedInput
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    schema={registerSchema}
                    fieldName="password"
                    value={form.password}
                    onChange={handleChange}
                    onValidationChange={handleValidationChange('password')}
                    showSecurityIndicator={true}
                    helperText="Minimum 8 characters with uppercase, lowercase, number, and special character"
                    required
                    placeholder="Create a strong password"
                    data-testid="password-input"
                  />
                  
                  {/* Password strength indicator */}
                  {form.password && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Password Strength:</span>
                        <span className={passwordStrength.strength >= 4 ? 'text-green-600' : passwordStrength.strength >= 2 ? 'text-yellow-600' : 'text-red-600'}>
                          {passwordStrength.strength >= 4 ? 'Strong' : passwordStrength.strength >= 2 ? 'Medium' : 'Weak'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordStrength.strength >= 4 ? 'bg-green-500' : 
                            passwordStrength.strength >= 2 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <span className={passwordStrength.checks.length ? 'text-green-600' : 'text-gray-400'}>
                          ✓ 8+ characters
                        </span>
                        <span className={passwordStrength.checks.uppercase ? 'text-green-600' : 'text-gray-400'}>
                          ✓ Uppercase
                        </span>
                        <span className={passwordStrength.checks.lowercase ? 'text-green-600' : 'text-gray-400'}>
                          ✓ Lowercase
                        </span>
                        <span className={passwordStrength.checks.numbers ? 'text-green-600' : 'text-gray-400'}>
                          ✓ Numbers
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password field */}
                <ValidatedInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  schema={registerSchema}
                  fieldName="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onValidationChange={handleValidationChange('confirmPassword')}
                  showSecurityIndicator={true}
                  helperText="Re-enter your password to confirm"
                  required
                  placeholder="Confirm your password"
                  data-testid="confirm-password-input"
                />

                {/* Terms and conditions */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="acceptTerms"
                      name="acceptTerms"
                      checked={form.acceptTerms}
                      onCheckedChange={(checked) => setForm(prev => ({ ...prev, acceptTerms: checked as boolean }))}
                      data-testid="terms-checkbox"
                      className="mt-0.5"
                    />
                    <label htmlFor="acceptTerms" className="text-sm text-gray-700 leading-5">
                      I agree to the{' '}
                      <Link href="/terms" className="text-green-600 hover:text-green-700 underline">
                        Terms and Conditions
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-green-600 hover:text-green-700 underline">
                        Privacy Policy
                      </Link>
                      {' '}*
                    </label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="acceptMarketing"
                      name="acceptMarketing"
                      checked={form.acceptMarketing}
                      onCheckedChange={(checked) => setForm(prev => ({ ...prev, acceptMarketing: checked as boolean }))}
                      data-testid="marketing-checkbox"
                      className="mt-0.5"
                    />
                    <label htmlFor="acceptMarketing" className="text-sm text-gray-700 leading-5">
                      I'd like to receive marketing emails and special offers (optional)
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid || !form.acceptTerms || isValidating}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  data-testid="submit-button"
                >
                  {isSubmitting ? (
                    "Creating Account..."
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Create Secure Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </ErrorBoundary>