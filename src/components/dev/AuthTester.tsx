'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/integrations/supabase/client'
import { authDebugger } from '@/utils/auth-debug'
import { useAuthErrorHandler } from '@/hooks/use-auth-error-handler'
import { testCredentials } from '@/utils/create-test-user'
import { Loader2, CheckCircle, XCircle, AlertCircle, User, Mail, Key } from 'lucide-react'

/**
 * Development component for testing authentication functionality
 * Only renders in development mode
 */
export function AuthTester() {
  const [testEmail, setTestEmail] = useState(testCredentials.user.email)
  const [testPassword, setTestPassword] = useState(testCredentials.user.password)
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])
  const { errorState, handleAuthError, handleAuthSuccess } = useAuthErrorHandler()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setIsLoading(true)
    const startTime = Date.now()
    
    try {
      const result = await testFn()
      const duration = Date.now() - startTime
      
      setTestResults(prev => [...prev, {
        name: testName,
        success: true,
        result,
        duration,
        timestamp: new Date().toISOString()
      }])
      
      return result
    } catch (error) {
      const duration = Date.now() - startTime
      
      setTestResults(prev => [...prev, {
        name: testName,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        duration,
        timestamp: new Date().toISOString()
      }])
      
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const testConnection = async () => {
    await runTest('Connection Test', async () => {
      return await authDebugger.testConnection()
    })
  }

  const testSignUp = async () => {
    await runTest('Sign Up Test', async () => {
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            first_name: 'Test',
            last_name: 'User',
          }
        }
      })
      
      if (error) throw error
      return data
    })
  }

  const testSignIn = async () => {
    await runTest('Sign In Test', async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      })
      
      if (error) throw error
      return data
    })
  }

  const testInvalidCredentials = async () => {
    await runTest('Invalid Credentials Test', async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      })
      
      if (error) throw error
      return data
    })
  }

  const testPasswordReset = async () => {
    await runTest('Password Reset Test', async () => {
      const { error } = await supabase.auth.resetPasswordForEmail(testEmail, {
        redirectTo: 'http://localhost:3000/reset-password',
      })
      
      if (error) throw error
      return { success: true }
    })
  }

  const testEmailExists = async () => {
    await runTest('Email Existence Check', async () => {
      return await authDebugger.checkEmailExists(testEmail)
    })
  }

  const clearResults = () => {
    setTestResults([])
    authDebugger.clearLogs()
  }

  const generateReport = () => {
    const report = authDebugger.generateReport()
    console.log('📊 Authentication Debug Report:', report)
    
    // Download report as JSON file
    const blob = new Blob([report], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `auth-debug-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Authentication Tester
          </CardTitle>
          <CardDescription>
            Test authentication functionality and debug issues in development mode
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Credentials */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Test Email</label>
              <Input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder={testCredentials.user.email}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Test Password</label>
              <Input
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder={testCredentials.user.password}
              />
            </div>
          </div>

          {/* Test Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Button onClick={testConnection} disabled={isLoading} size="sm">
              Test Connection
            </Button>
            <Button onClick={testSignUp} disabled={isLoading} size="sm">
              Test Sign Up
            </Button>
            <Button onClick={testSignIn} disabled={isLoading} size="sm">
              Test Sign In
            </Button>
            <Button onClick={testInvalidCredentials} disabled={isLoading} size="sm">
              Test Invalid Creds
            </Button>
            <Button onClick={testPasswordReset} disabled={isLoading} size="sm">
              Test Password Reset
            </Button>
            <Button onClick={testEmailExists} disabled={isLoading} size="sm">
              Check Email Exists
            </Button>
          </div>

          {/* Utility Buttons */}
          <div className="flex gap-2">
            <Button onClick={clearResults} variant="outline" size="sm">
              Clear Results
            </Button>
            <Button onClick={generateReport} variant="outline" size="sm">
              Download Report
            </Button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>Running authentication test...</AlertDescription>
            </Alert>
          )}

          {/* Error State */}
          {errorState.hasError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorState.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              {testResults.filter(r => r.success).length} passed, {testResults.filter(r => !r.success).length} failed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium">{result.name}</span>
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.duration}ms
                    </Badge>
                  </div>
                  {result.error && (
                    <span className="text-sm text-red-500 max-w-md truncate">
                      {result.error}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
