'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { setupTestEnvironmentFixed, testCredentialsFixed, validateTestEnvironment } from '@/utils/create-test-user-fixed'
import { authDebugger } from '@/utils/auth-debug'
import { Loader2, CheckCircle, XCircle, AlertCircle, Users, Key, Database, RefreshCw } from 'lucide-react'

/**
 * Enhanced development component for setting up authentication test environment
 * Provides comprehensive validation and setup with better error handling
 */
export function AuthSetupFixed() {
  const [isLoading, setIsLoading] = useState(false)
  const [setupResult, setSetupResult] = useState<any>(null)
  const [validationResult, setValidationResult] = useState<any>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [setupProgress, setSetupProgress] = useState(0)

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  // Validate environment on component mount
  useEffect(() => {
    validateEnvironment()
  }, [])

  const validateEnvironment = async () => {
    setIsValidating(true)
    try {
      const result = await validateTestEnvironment()
      setValidationResult(result)
    } catch (error: any) {
      setValidationResult({
        ready: false,
        issues: [`Validation failed: ${error.message}`],
        recommendations: ['Check your Supabase configuration and try again']
      })
    } finally {
      setIsValidating(false)
    }
  }

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const isConnected = await authDebugger.testConnection()
      if (isConnected) {
        alert('✅ Connection successful!')
      } else {
        alert('❌ Connection failed!')
      }
    } catch (error) {
      alert('❌ Connection test failed!')
    } finally {
      setIsLoading(false)
    }
  }

  const runSetup = async () => {
    setIsLoading(true)
    setSetupProgress(0)
    
    try {
      // Progress updates
      setSetupProgress(20)
      console.log('🚀 Starting test environment setup...')
      
      setSetupProgress(40)
      const result = await setupTestEnvironmentFixed()
      
      setSetupProgress(80)
      setSetupResult(result)
      
      if (result.success) {
        setSetupProgress(100)
        // Re-validate after successful setup
        await validateEnvironment()
      }
    } catch (error: any) {
      setSetupResult({
        success: false,
        message: error.message,
        details: {}
      })
    } finally {
      setIsLoading(false)
      setSetupProgress(0)
    }
  }

  const quickTestSignIn = async () => {
    setIsLoading(true)
    try {
      const { supabase } = await import('@/integrations/supabase/client')
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testCredentialsFixed.user.email,
        password: testCredentialsFixed.user.password,
      })

      if (error) {
        throw error
      }

      alert('✅ Test sign-in successful! Authentication is working correctly.')
      
      // Sign out immediately
      await supabase.auth.signOut()
    } catch (error: any) {
      alert(`❌ Test sign-in failed: ${error.message}\n\nTry creating test users first.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Authentication Setup (Enhanced)
          </CardTitle>
          <CardDescription>
            Comprehensive setup and validation for authentication testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Environment Validation */}
          {isValidating ? (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>Validating test environment...</AlertDescription>
            </Alert>
          ) : validationResult ? (
            <Alert variant={validationResult.ready ? "default" : "destructive"}>
              {validationResult.ready ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">
                    {validationResult.ready ? 
                      '✅ Test environment is ready!' : 
                      '⚠️ Test environment needs setup'
                    }
                  </p>
                  {validationResult.issues.length > 0 && (
                    <div className="text-sm">
                      <p className="font-medium">Issues found:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {validationResult.issues.map((issue: string, index: number) => (
                          <li key={index}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {validationResult.recommendations.length > 0 && (
                    <div className="text-sm">
                      <p className="font-medium">Recommendations:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {validationResult.recommendations.map((rec: string, index: number) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          ) : null}

          {/* Setup Progress */}
          {setupProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Setup Progress</span>
                <span>{setupProgress}%</span>
              </div>
              <Progress value={setupProgress} className="w-full" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-2">
            <Button 
              onClick={testConnection} 
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Key className="h-4 w-4 mr-2" />
              )}
              Test Supabase Connection
            </Button>

            <Button 
              onClick={runSetup} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Users className="h-4 w-4 mr-2" />
              )}
              {validationResult?.ready ? 'Refresh Test Users' : 'Create Test Users'}
            </Button>

            <Button 
              onClick={quickTestSignIn} 
              disabled={isLoading || !validationResult?.ready}
              variant="outline"
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Test Authentication
            </Button>

            <Button 
              onClick={validateEnvironment} 
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Re-validate Environment
            </Button>
          </div>

          {/* Setup Results */}
          {setupResult && (
            <Alert variant={setupResult.success ? "default" : "destructive"}>
              {setupResult.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">{setupResult.message}</p>
                  {setupResult.details?.userCreation && (
                    <div className="text-sm">
                      <p>User Creation Summary: {setupResult.details.userCreation.summary}</p>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Test Credentials */}
          {(setupResult?.success || validationResult?.ready) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Test Credentials</CardTitle>
                <CardDescription>
                  Use these credentials to test the authentication system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm">Test User</p>
                    <p className="text-sm text-gray-600">Email: {testCredentialsFixed.user.email}</p>
                    <p className="text-sm text-gray-600">Password: {testCredentialsFixed.user.password}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm">Admin User</p>
                    <p className="text-sm text-gray-600">Email: {testCredentialsFixed.admin.email}</p>
                    <p className="text-sm text-gray-600">Password: {testCredentialsFixed.admin.password}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm">Customer User</p>
                    <p className="text-sm text-gray-600">Email: {testCredentialsFixed.customer.email}</p>
                    <p className="text-sm text-gray-600">Password: {testCredentialsFixed.customer.password}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Quick Start Guide:</p>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  <li>Click "Test Supabase Connection" to verify connectivity</li>
                  <li>Click "Create Test Users" to set up authentication test data</li>
                  <li>Click "Test Authentication" to verify everything works</li>
                  <li>Use the provided credentials in your sign-in forms</li>
                  <li>Check the AuthTester component for comprehensive testing</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
