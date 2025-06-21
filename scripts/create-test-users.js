/**
 * Script to create test users directly via Supabase API
 * Run this script to quickly resolve authentication testing issues
 */

const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lyynavswxtzhsmwetgtn.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5eW5hdnN3eHR6aHNtd2V0Z3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwOTQ1ODEsImV4cCI6MjA2MzY3MDU4MX0.bm7UieeTN7W9RHw7yDxMP9K8zi3GPu2iAnu_iUeHKdM'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const testUsers = [
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

async function createTestUser(user) {
  try {
    console.log(`Creating user: ${user.email}`)
    
    const { data, error } = await supabase.auth.signUp({
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

    if (error) {
      if (error.message.includes('User already registered')) {
        console.log(`✅ User ${user.email} already exists`)
        return { success: true, exists: true }
      }
      throw error
    }

    console.log(`✅ User ${user.email} created successfully`)
    return { success: true, data }
  } catch (error) {
    console.error(`❌ Failed to create user ${user.email}:`, error.message)
    return { success: false, error: error.message }
  }
}

async function createAllTestUsers() {
  console.log('🚀 Starting test user creation...')
  console.log(`📡 Connecting to: ${SUPABASE_URL}`)
  
  let successCount = 0
  let existingCount = 0
  let failureCount = 0

  for (const user of testUsers) {
    const result = await createTestUser(user)
    
    if (result.success) {
      if (result.exists) {
        existingCount++
      } else {
        successCount++
      }
    } else {
      failureCount++
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log('\n📊 Summary:')
  console.log(`✅ Created: ${successCount} users`)
  console.log(`ℹ️ Already existed: ${existingCount} users`)
  console.log(`❌ Failed: ${failureCount} users`)
  
  if (successCount > 0 || existingCount > 0) {
    console.log('\n🎉 Test users are ready!')
    console.log('\n🔑 Test Credentials:')
    testUsers.forEach(user => {
      console.log(`   Email: ${user.email}`)
      console.log(`   Password: ${user.password}`)
      console.log('')
    })
  }

  return {
    success: failureCount === 0,
    created: successCount,
    existing: existingCount,
    failed: failureCount
  }
}

// Run the script
if (require.main === module) {
  createAllTestUsers()
    .then(result => {
      if (result.success) {
        console.log('🎯 All test users are ready for authentication testing!')
        process.exit(0)
      } else {
        console.error('❌ Some users failed to create. Check the errors above.')
        process.exit(1)
      }
    })
    .catch(error => {
      console.error('💥 Script failed:', error)
      process.exit(1)
    })
}

module.exports = { createAllTestUsers, createTestUser }
