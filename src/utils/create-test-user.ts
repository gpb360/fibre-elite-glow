'use client'

import { supabase } from '@/integrations/supabase/client'

/**
 * Utility to create test users for development and testing
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
 * Create a test user in Supabase
 */
export async function createTestUser(user: TestUser): Promise<{
  success: boolean
  data?: any
  error?: string
}> {
  try {
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
        }
      }
    })

    if (authError) {
      return {
        success: false,
        error: authError.message
      }
    }

    // If user was created successfully, create customer profile
    if (authData.user) {
      // Confirm the user's email via the new API route
      await fetch('/api/confirm-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: authData.user.id, email: authData.user.email }),
      });

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
        console.warn('Profile creation failed:', profileError.message)
        // Don't fail the entire operation for profile creation issues
      }
    }

    return {
      success: true,
      data: authData
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Create all default test users
 */
export async function createAllTestUsers(): Promise<{
  success: boolean
  results: Array<{ email: string; success: boolean; error?: string }>
}> {
  const results = []
  let overallSuccess = true

  for (const user of defaultTestUsers) {
    const result = await createTestUser(user)
    results.push({
      email: user.email,
      success: result.success,
      error: result.error
    })

    if (!result.success) {
      overallSuccess = false
    }
  }

  return {
    success: overallSuccess,
    results
  }
}

/**
 * Check if test users exist
 */
export async function checkTestUsersExist(): Promise<{
  existingUsers: string[]
  missingUsers: string[]
}> {
  const existingUsers: string[] = []
  const missingUsers: string[] = []

  for (const user of defaultTestUsers) {
    try {
      // Try to reset password to check if user exists
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: 'http://localhost:3000/reset-password',
      })

      // If no error or specific "user not found" error, determine existence
      if (!error) {
        existingUsers.push(user.email)
      } else if (error.message.includes('User not found')) {
        missingUsers.push(user.email)
      } else {
        // Assume user exists if we get other errors
        existingUsers.push(user.email)
      }
    } catch (error) {
      // Assume user doesn't exist on unexpected errors
      missingUsers.push(user.email)
    }
  }

  return {
    existingUsers,
    missingUsers
  }
}

/**
 * Development helper to set up test environment
 */
export async function setupTestEnvironment(): Promise<{
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
    // Check existing users
    const userCheck = await checkTestUsersExist()
    
    // Create missing users
    const missingUsers = defaultTestUsers.filter(user => 
      userCheck.missingUsers.includes(user.email)
    )

    const creationResults = []
    for (const user of missingUsers) {
      const result = await createTestUser(user)
      creationResults.push({
        email: user.email,
        success: result.success,
        error: result.error
      })
    }

    return {
      success: true,
      message: `Test environment setup complete. ${userCheck.existingUsers.length} existing users, ${creationResults.filter(r => r.success).length} users created.`,
      details: {
        existingUsers: userCheck.existingUsers,
        createdUsers: creationResults.filter(r => r.success).map(r => r.email),
        failedUsers: creationResults.filter(r => !r.success),
      }
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to set up test environment: ${error.message}`,
      details: { error: error.message }
    }
  }
}

// Export test credentials for easy access
export const testCredentials = {
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
  (window as any).createTestUser = createTestUser
  // Commented out due to type issues - fix later if needed
  // (window as any).createAllTestUsers = createAllTestUsers
  // (window as any).setupTestEnvironment = setupTestEnvironment
  // (window as any).testCredentials = testCredentials
  
  console.log('🧪 Test user utilities available:')
  console.log('- window.createTestUser(user)')
  // console.log('- window.createAllTestUsers()')
  // console.log('- window.setupTestEnvironment()')
  // console.log('- window.testCredentials')
}
