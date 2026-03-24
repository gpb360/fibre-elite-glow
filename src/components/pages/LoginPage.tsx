'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, ArrowRight, AlertCircle, Leaf } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-green-50/60 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-green-600 border-t-transparent mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    }>
      <LoginPageInner />
    </Suspense>
  )
}

function LoginPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const redirectTo = searchParams.get('redirectTo') || '/account'

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Basic client validation
    if (!form.email.trim() || !form.password) {
      setError('Please enter your email and password.')
      setTouched({ email: true, password: true })
      return
    }

    setIsSubmitting(true)

    try {
      const sanitizedEmail = form.email.trim().toLowerCase()

      if (sanitizedEmail.includes('<') || sanitizedEmail.includes('>')) {
        throw new Error('Invalid email format')
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: form.password,
      })

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.')
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link before signing in.')
        } else if (signInError.message.includes('Too many requests')) {
          setError('Too many login attempts. Please wait a few minutes before trying again.')
        } else if (signInError.message.includes('User not found')) {
          setError('No account found with this email. Please check your email or sign up.')
        } else {
          setError('Login failed. Please try again or contact support.')
        }
        return
      }

      // Clear form for security
      setForm({ email: '', password: '' })
      router.push(redirectTo)
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (error) setError(null)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }))
  }

  const handleForgotPassword = async () => {
    if (!form.email) {
      setError('Please enter your email address first.')
      setTouched(prev => ({ ...prev, email: true }))
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setError(error.message)
      } else {
        setError(null)
        alert('Password reset email sent! Check your inbox.')
      }
    } catch {
      setError('Failed to send reset email. Please try again.')
    }
  }

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-green-50/60 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-green-600 border-t-transparent mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (user) return null

  // Inline field errors — only after blur
  const emailError = touched.email && !form.email.trim() ? 'Email is required' : null
  const passwordError = touched.password && !form.password ? 'Password is required' : null

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-green-50/60 to-white flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-[420px] space-y-6">

          {/* Branding header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-2">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500">
              Sign in to view your orders and manage your profile
            </p>
          </div>

          {/* Login card */}
          <Card className="shadow-sm border-gray-200/80">
            <CardContent className="pt-6 pb-6 px-6">
              <form onSubmit={handleSubmit} className="space-y-5" data-testid="login-form">

                {/* Error alert */}
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`h-11 ${emailError ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                    data-testid="email-input"
                  />
                  {emailError && (
                    <p className="text-xs text-red-500 mt-1">{emailError}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
                      data-testid="forgot-password-link"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`h-11 pr-10 ${passwordError ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                      data-testid="password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-xs text-red-500 mt-1">{passwordError}</p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm transition-all duration-150"
                  data-testid="login-button"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Divider + sign-up link */}
              <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500">
                  Don&apos;t have an account?{' '}
                  <Link href="/signup" className="text-green-600 hover:text-green-700 font-medium transition-colors">
                    Create one
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Trust footer */}
          <p className="text-center text-xs text-gray-400">
            Secured with SSL encryption · Your data is never shared
          </p>
        </div>
      </div>
      <Footer />
    </>
  )
}
