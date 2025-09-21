// scripts/test-order-integration.js
/**
 * Test script to verify order data flow from database through Edge Functions to frontend
 * Run with: node scripts/test-order-integration.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Please check your .env.local file.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testOrderIntegration() {
  console.log('🧪 Testing Order Integration Flow...\n')

  try {
    // Test 1: Check if we can authenticate
    console.log('1️⃣ Testing authentication...')
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.log('❌ Authentication failed:', authError.message)
      console.log('💡 Please run: pnpm dev and login to the application first')
      return
    }

    if (!session) {
      console.log('❌ No active session found')
      console.log('💡 Please login to the application first')
      return
    }

    console.log('✅ Authentication successful')
    console.log(`📧 User email: ${session.user.email}\n`)

    // Test 2: Test get-orders Edge Function
    console.log('2️⃣ Testing get-orders Edge Function...')
    
    const { data: ordersData, error: ordersError } = await supabase.functions.invoke('get-orders', {
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    })

    if (ordersError) {
      console.log('❌ get-orders function failed:', ordersError)
      return
    }

    console.log('✅ get-orders function successful')
    console.log(`📦 Found ${ordersData.orders.length} orders`)
    
    if (ordersData.orders.length > 0) {
      console.log('📋 Sample order:')
      const sampleOrder = ordersData.orders[0]
      console.log(`   - Order ID: ${sampleOrder.id}`)
      console.log(`   - Order Number: ${sampleOrder.order_number}`)
      console.log(`   - Status: ${sampleOrder.status}`)
      console.log(`   - Total: $${sampleOrder.total_amount}`)
      console.log(`   - Items: ${sampleOrder.order_items.length}`)
      console.log(`   - Created: ${sampleOrder.created_at}\n`)

      // Test 3: Test get-order-details Edge Function
      console.log('3️⃣ Testing get-order-details Edge Function...')
      
      const { data: orderDetails, error: detailsError } = await supabase.functions.invoke('get-order-details', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        },
        body: { orderId: sampleOrder.id }
      })

      if (detailsError) {
        console.log('❌ get-order-details function failed:', detailsError)
        return
      }

      console.log('✅ get-order-details function successful')
      console.log('📄 Order details retrieved:')
      console.log(`   - Order Number: ${orderDetails.order_number}`)
      console.log(`   - Status: ${orderDetails.status}`)
      console.log(`   - Payment Status: ${orderDetails.payment_status}`)
      console.log(`   - Shipping Address: ${orderDetails.shipping_address?.name}`)
      console.log(`   - Tracking Number: ${orderDetails.tracking_number || 'Not available'}`)
      console.log(`   - Order Items: ${orderDetails.order_items.length}`)
      
      orderDetails.order_items.forEach((item, index) => {
        console.log(`     ${index + 1}. ${item.product_name} - Qty: ${item.quantity} - $${item.total_price}`)
      })
    } else {
      console.log('ℹ️  No orders found. This is normal for a new account.')
    }

    console.log('\n🎉 Order integration test completed successfully!')

  } catch (error) {
    console.error('❌ Test failed with error:', error.message)
  }
}

// Check if this is being run directly
if (require.main === module) {
  testOrderIntegration()
}

module.exports = { testOrderIntegration }