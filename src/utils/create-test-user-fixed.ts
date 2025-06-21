'use client'

import { supabase } from '@/integrations/supabase/client'

/**
 * Enhanced utility to create test users for development and testing
 * Uses proper Supabase Auth API and handles edge cases
 */

export interface TestUser {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export const defaultTestUsers: TestUser[] = [
  {
    email: 'test@fibreeliteglow.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    phone: '+1234567890'
  },
  {
    email: 'admin@fibreeliteglow.com',
    password: 'AdminPassword123!',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+1234567891'
  },
  {
    email: 'customer@fibreeliteglow.com',
    password: 'CustomerPassword123!',
    firstName: 'Customer',
    lastName: 'Test',
    phone: '+1234567892'
  }
]

/**
 * Create a test user in Supabase using the Auth API
 */
export async function createTestUserFixed(user: TestUser): Promise<{
  success: boolean
  data?: any
  error?: string
  userExists?: boolean
}> {
  try {
    console.log(`🔧 Creating test user: ${user.email}`)
    
    // First, check if user already exists by trying to reset password
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: 'http://localhost:3000/reset-password',
      })
      
      // If no error or specific error messages, user likely exists
      if (!resetError || !resetError.message.includes('User not found')) {
        console.log(`ℹ️ User ${user.email} already exists`)
        return {
          success: true,
          userExists: true,
          data: { message: 'User already exists' }
        }
      }
    } catch (error) {
      // Continue with user creation if check fails
    }

    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          first_name: user.firstName,
          last_name: user.lastName,
          phone: user.phone,
          marketing_consent: false,
          newsletter_subscription: false,
        },
        emailRedirectTo: 'http://localhost:3000/auth/callback'
      }
    })

    if (authError) {
      // Handle specific error cases
      if (authError.message.includes('User already registered')) {
        console.log(`ℹ️ User ${user.email} already exists`)
        return {
          success: true,
          userExists: true,
          data: authData
        }
      }
      
      return {
        success: false,
        error: authError.message
      }
    }

    console.log(`✅ User ${user.email} created successfully`)

    // If user was created successfully and confirmed, create customer profile
    if (authData.user) {
      try {
        const { error: profileError } = await supabase
          .from('customer_profiles')
          .insert({
            user_id: authData.user.id,
            first_name: user.firstName,
            last_name: user.lastName,
            phone: user.phone,
            marketing_consent: false,
            newsletter_subscription: false,
          })

        if (profileError) {
          console.warn(`⚠️ Profile creation failed for ${user.email}:`, profileError.message)
          // Don't fail the entire operation for profile creation issues
        } else {
          console.log(`✅ Profile created for ${user.email}`)
        }
      } catch (profileError) {
        console.warn(`⚠️ Profile creation error for ${user.email}:`, profileError)
      }
    }

    return {
      success: true,
      data: authData,
      userExists: false
    }
  } catch (error: any) {
    console.error(`❌ Failed to create user ${user.email}:`, error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Create all default test users with better error handling
 */
export async function createAllTestUsersFixed(): Promise<{
  success: boolean
  results: Array<{ email: string; success: boolean; error?: string; userExists?: boolean }>
  summary: string
}> {
  console.log('🚀 Starting test user creation process...')
  
  const results = []
  let successCount = 0
  let existingCount = 0
  let failureCount = 0

  for (const user of defaultTestUsers) {
    const result = await createTestUserFixed(user)
    
    results.push({
      email: user.email,
      success: result.success,
      error: result.error,
      userExists: result.userExists
    })

    if (result.success) {
      if (result.userExists) {
        existingCount++
      } else {
        successCount++
      }
    } else {
      failureCount++
    }

    // Add a small delay between user creations to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  const summary = `Created ${successCount} new users, found ${existingCount} existing users, ${failureCount} failures`
  console.log(`📊 Test user creation summary: ${summary}`)

  return {
    success: failureCount === 0,
    results,
    summary
  }
}

/**
 * Enhanced test environment setup with better validation
 */
export async function setupTestEnvironmentFixed(): Promise<{
  success: boolean
  message: string
  details: any
}> {
  if (process.env.NODE_ENV !== 'development') {
    return {
      success: false,
      message: 'Test environment setup is only available in development mode',
      details: {}
    }
  }

  try {
    console.log('🔧 Setting up test environment...')
    
    // Test connection first
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      throw new Error(`Connection test failed: ${sessionError.message}`)
    }
    
    console.log('✅ Supabase connection verified')

    // Create test users
    const creationResult = await createAllTestUsersFixed()

    return {
      success: true,
      message: `Test environment setup complete. ${creationResult.summary}`,
      details: {
        connectionTest: 'passed',
        userCreation: creationResult,
        testCredentials: testCredentialsFixed
      }
    }
  } catch (error: any) {
    console.error('❌ Test environment setup failed:', error)
    return {
      success: false,
      message: `Failed to set up test environment: ${error.message}`,
      details: { error: error.message }
    }
  }
}

/**
 * Check if a specific test user exists
 */
export async function checkTestUserExists(email: string): Promise<boolean> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/reset-password',
    })

    // If no error or specific error messages, user likely exists
    return !error || !error.message.includes('User not found')
  } catch (error) {
    return false
  }
}

/**
 * Validate test environment readiness
 */
export async function validateTestEnvironment(): Promise<{
  ready: boolean
  issues: string[]
  recommendations: string[]
}> {
  const issues: string[] = []
  const recommendations: string[] = []

  // Check Supabase connection
  try {
    const { error } = await supabase.auth.getSession()
    if (error) {
      issues.push(`Supabase connection failed: ${error.message}`)
      recommendations.push('Check your environment variables and Supabase project status')
    }
  } catch (error) {
    issues.push('Unable to connect to Supabase')
    recommendations.push('Verify your internet connection and Supabase configuration')
  }

  // Check for test users
  let hasTestUsers = false
  for (const user of defaultTestUsers) {
    if (await checkTestUserExists(user.email)) {
      hasTestUsers = true
      break
    }
  }

  if (!hasTestUsers) {
    issues.push('No test users found in the database')
    recommendations.push('Run the test user creation process to set up authentication testing')
  }

  return {
    ready: issues.length === 0,
    issues,
    recommendations
  }
}

// Export test credentials for easy access
export const testCredentialsFixed = {
  user: {
    email: 'test@fibreeliteglow.com',
    password: 'TestPassword123!'
  },
  admin: {
    email: 'admin@fibreeliteglow.com',
    password: 'AdminPassword123!'
  },
  customer: {
    email: 'customer@fibreeliteglow.com',
    password: 'CustomerPassword123!'
  }
}

// Development console helpers
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).createTestUserFixed = createTestUserFixed
  (window as any).createAllTestUsersFixed = createAllTestUsersFixed
  (window as any).setupTestEnvironmentFixed = setupTestEnvironmentFixed
  (window as any).validateTestEnvironment = validateTestEnvironment
  (window as any).testCredentialsFixed = testCredentialsFixed
  
  console.log('🧪 Enhanced test user utilities available:')
  console.log('- window.createTestUserFixed(user)')
  console.log('- window.createAllTestUsersFixed()')
  console.log('- window.setupTestEnvironmentFixed()')
  console.log('- window.validateTestEnvironment()')
  console.log('- window.testCredentialsFixed')
}
