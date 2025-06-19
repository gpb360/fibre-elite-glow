'use client'

import { supabase } from '@/integrations/supabase/client'
import { AuthError } from '@supabase/supabase-js'

/**
 * Authentication debugging utilities for development
 */

export interface AuthDebugInfo {
  timestamp: string
  action: string
  email?: string
  error?: AuthError | Error
  success: boolean
  details?: any
}

class AuthDebugger {
  private logs: AuthDebugInfo[] = []
  private isEnabled: boolean = process.env.NODE_ENV === 'development'

  /**
   * Log authentication events for debugging
   */
  log(info: Omit<AuthDebugInfo, 'timestamp'>): void {
    if (!this.isEnabled) return

    const logEntry: AuthDebugInfo = {
      ...info,
      timestamp: new Date().toISOString(),
    }

    this.logs.push(logEntry)
    
    // Keep only last 50 logs
    if (this.logs.length > 50) {
      this.logs = this.logs.slice(-50)
    }

    // Console output with styling
    const style = info.success ? 'color: green' : 'color: red'
    console.group(`🔐 Auth Debug: ${info.action}`)
    console.log(`%c${info.success ? '✅ Success' : '❌ Failed'}`, style)
    if (info.email) console.log('📧 Email:', info.email)
    if (info.error) console.error('🚨 Error:', info.error)
    if (info.details) console.log('📋 Details:', info.details)
    console.groupEnd()
  }

  /**
   * Get all authentication logs
   */
  getLogs(): AuthDebugInfo[] {
    return [...this.logs]
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = []
    console.log('🧹 Auth debug logs cleared')
  }

  /**
   * Test Supabase connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.getSession()
      
      this.log({
        action: 'Connection Test',
        success: !error,
        error: error || undefined,
        details: { hasSession: !!data.session }
      })

      return !error
    } catch (error) {
      this.log({
        action: 'Connection Test',
        success: false,
        error: error as Error,
      })
      return false
    }
  }

  /**
   * Check if email exists in the system
   */
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      // This is a workaround since Supabase doesn't expose user lookup directly
      // We'll try to trigger a password reset to see if the email exists
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:3000/reset-password',
      })

      // If no error, email likely exists
      // If error contains "User not found", email doesn't exist
      const emailExists = !error || !error.message.includes('User not found')

      this.log({
        action: 'Email Existence Check',
        email,
        success: true,
        details: { emailExists, error: error?.message }
      })

      return emailExists
    } catch (error) {
      this.log({
        action: 'Email Existence Check',
        email,
        success: false,
        error: error as Error,
      })
      return false
    }
  }

  /**
   * Get detailed error information
   */
  getErrorDetails(error: AuthError | Error): {
    type: string
    message: string
    suggestions: string[]
  } {
    const errorMessage = error.message.toLowerCase()

    if (errorMessage.includes('invalid login credentials')) {
      return {
        type: 'Invalid Credentials',
        message: 'The email or password you entered is incorrect.',
        suggestions: [
          'Double-check your email address for typos',
          'Verify your password is correct',
          'Try resetting your password if you forgot it',
          'Make sure you have an account - try signing up instead'
        ]
      }
    }

    if (errorMessage.includes('email not confirmed')) {
      return {
        type: 'Email Not Confirmed',
        message: 'Please check your email and click the confirmation link.',
        suggestions: [
          'Check your email inbox and spam folder',
          'Click the confirmation link in the email',
          'Request a new confirmation email if needed'
        ]
      }
    }

    if (errorMessage.includes('too many requests')) {
      return {
        type: 'Rate Limited',
        message: 'Too many login attempts. Please wait before trying again.',
        suggestions: [
          'Wait a few minutes before trying again',
          'Check if you have the correct credentials',
          'Contact support if the issue persists'
        ]
      }
    }

    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return {
        type: 'Network Error',
        message: 'Unable to connect to the authentication service.',
        suggestions: [
          'Check your internet connection',
          'Try refreshing the page',
          'Contact support if the issue persists'
        ]
      }
    }

    return {
      type: 'Unknown Error',
      message: error.message,
      suggestions: [
        'Try again in a few moments',
        'Refresh the page and try again',
        'Contact support if the issue persists'
      ]
    }
  }

  /**
   * Generate debug report
   */
  generateReport(): string {
    const report = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      recentLogs: this.logs.slice(-10),
      summary: {
        totalLogs: this.logs.length,
        successfulActions: this.logs.filter(log => log.success).length,
        failedActions: this.logs.filter(log => !log.success).length,
      }
    }

    return JSON.stringify(report, null, 2)
  }
}

// Export singleton instance
export const authDebugger = new AuthDebugger()

// Global access for debugging in console
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).authDebugger = authDebugger
  console.log('🔧 Auth debugger available globally as window.authDebugger')
}
