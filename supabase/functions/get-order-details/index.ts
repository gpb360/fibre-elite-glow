// supabase/functions/get-order-details/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the auth token from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Verify the user token
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Get order ID from query parameters
    const url = new URL(req.url)
    const orderId = url.searchParams.get('id')
    
    if (!orderId) {
      throw new Error('Order ID is required')
    }

    // Fetch order details with items
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_name,
          product_type,
          quantity,
          unit_price,
          total_price,
          package_id
        )
      `)
      .eq('id', orderId)
      .eq('email', user.email) // Ensure user can only access their own orders
      .single()

    if (error) {
      console.error('Database error:', error)
      if (error.code === 'PGRST116') {
        throw new Error('Order not found')
      }
      throw new Error('Failed to fetch order details')
    }

    // Fetch package details for each order item
    const packageIds = order.order_items
      .map((item: any) => item.package_id)
      .filter(Boolean)

    let packageDetails: any = {}
    if (packageIds.length > 0) {
      const { data: packages } = await supabase
        .from('packages')
        .select('id, product_name, product_type, sku, weight_grams')
        .in('id', packageIds)

      if (packages) {
        packageDetails = packages.reduce((acc: any, pkg: any) => {
          acc[pkg.id] = pkg
          return acc
        }, {})
      }
    }

    // Enhance order items with package details
    const enhancedOrderItems = order.order_items.map((item: any) => ({
      ...item,
      package_details: item.package_id ? packageDetails[item.package_id] : null
    }))

    // Format shipping and billing addresses
    const formatAddress = (address: any) => {
      if (!address) return null
      return {
        name: `${address.first_name} ${address.last_name}`,
        company: address.company,
        line1: address.address_line_1,
        line2: address.address_line_2,
        city: address.city,
        state: address.state_province,
        postal_code: address.postal_code,
        country: address.country
      }
    }

    const formattedOrder = {
      ...order,
      order_items: enhancedOrderItems,
      shipping_address: formatAddress({
        first_name: order.shipping_first_name,
        last_name: order.shipping_last_name,
        company: order.shipping_company,
        address_line_1: order.shipping_address_line_1,
        address_line_2: order.shipping_address_line_2,
        city: order.shipping_city,
        state_province: order.shipping_state_province,
        postal_code: order.shipping_postal_code,
        country: order.shipping_country
      }),
      billing_address: formatAddress({
        first_name: order.billing_first_name,
        last_name: order.billing_last_name,
        company: order.billing_company,
        address_line_1: order.billing_address_line_1,
        address_line_2: order.billing_address_line_2,
        city: order.billing_city,
        state_province: order.billing_state_province,
        postal_code: order.billing_postal_code,
        country: order.billing_country
      })
    }

    return new Response(
      JSON.stringify(formattedOrder),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in get-order-details function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message === 'Unauthorized' ? 401 : 
               error.message === 'Order not found' ? 404 : 400,
      }
    )
  }
})