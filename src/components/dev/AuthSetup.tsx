'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { setupTestEnvironment, testCredentials, createTestUser } from '@/utils/create-test-user'
import { authDebugger } from '@/utils/auth-debug'
import { Loader2, CheckCircle, XCircle, AlertCircle, Users, Key, Database } from 'lucide-react'

/**
 * Development component for setting up authentication test environment
 * Only renders in development mode
 */
export function AuthSetup() {
  const [isLoading, setIsLoading] = useState(false)
  const [setupResult, setSetupResult] = useState<any>(null)
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'failed'>('unknown')

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const isConnected = await authDebugger.testConnection()
      setConnectionStatus(isConnected ? 'connected' : 'failed')
    } catch (error) {
      setConnectionStatus('failed')
    } finally {
      setIsLoading(false)
    }
  }

  const runSetup = async () => {
    setIsLoading(true)
    try {
      const result = await setupTestEnvironment()
      setSetupResult(result)
      
      if (result.success) {
        // Test one of the created users
        try {
          await createTestUser({
            email: 'demo@fibreeliteglow.com',
            password: 'DemoPassword123!',
            firstName: 'Demo',
            lastName: 'User',
            phone: '+1234567899'
          })
        } catch (error) {
          console.log('Demo user might already exist')
        }
      }
    } catch (error: any) {
      setSetupResult({
        success: false,
        message: error.message,
        details: {}
      })
    } finally {
      setIsLoading(false)
    }
  }

  const quickTestSignIn = async () => {
    setIsLoading(true)
    try {
      const { supabase } = await import('@/integrations/supabase/client')
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testCredentials.user.email,
        password: testCredentials.user.password,
      })

      if (error) {
        throw error
      }

      alert('✅ Test sign-in successful! You can now use the authentication system.')
      
      // Sign out immediately
      await supabase.auth.signOut()
    } catch (error: any) {
      alert(`❌ Test sign-in failed: ${error.message}`)
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
            Authentication Setup
          </CardTitle>
          <CardDescription>
            Set up test users and verify authentication is working correctly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <span>Supabase Connection</span>
            </div>
            <div className="flex items-center gap-2">
              {connectionStatus === 'connected' && (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <Badge variant="default">Connected</Badge>
                </>
              )}
              {connectionStatus === 'failed' && (
                <>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <Badge variant="destructive">Failed</Badge>
                </>
              )}
              {connectionStatus === 'unknown' && (
                <Badge variant="secondary">Unknown</Badge>
              )}
            </div>
          </div>

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
              Test Connection
            </Button>

            <Button 
              onClick={runSetup} 
              disabled={isLoading || connectionStatus === 'failed'}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Users className="h-4 w-4 mr-2" />
              )}
              Create Test Users
            </Button>

            <Button 
              onClick={quickTestSignIn} 
              disabled={isLoading || !setupResult?.success}
              variant="outline"
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Test Sign In
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
                  {setupResult.details && (
                    <div className="text-sm">
                      {setupResult.details.existingUsers?.length > 0 && (
                        <p>Existing users: {setupResult.details.existingUsers.join(', ')}</p>
                      )}
                      {setupResult.details.createdUsers?.length > 0 && (
                        <p>Created users: {setupResult.details.createdUsers.join(', ')}</p>
                      )}
                      {setupResult.details.failedUsers?.length > 0 && (
                        <p>Failed users: {setupResult.details.failedUsers.map((u: any) => u.email).join(', ')}</p>
                      )}
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Test Credentials */}
          {setupResult?.success && (
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
                    <p className="text-sm text-gray-600">Email: {testCredentials.user.email}</p>
                    <p className="text-sm text-gray-600">Password: {testCredentials.user.password}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm">Admin User</p>
                    <p className="text-sm text-gray-600">Email: {testCredentials.admin.email}</p>
                    <p className="text-sm text-gray-600">Password: {testCredentials.admin.password}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm">Customer User</p>
                    <p className="text-sm text-gray-600">Email: {testCredentials.customer.email}</p>
                    <p className="text-sm text-gray-600">Password: {testCredentials.customer.password}</p>
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
                <p className="font-medium">Setup Instructions:</p>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  <li>First, test the connection to Supabase</li>
                  <li>Create test users by clicking "Create Test Users"</li>
                  <li>Test the authentication by clicking "Test Sign In"</li>
                  <li>Use the provided credentials to test your sign-in form</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
