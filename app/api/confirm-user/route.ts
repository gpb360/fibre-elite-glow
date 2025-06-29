import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { userId, email } = await request.json()

  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'This endpoint is only available in development' }, { status: 403 })
  }

  if (!userId || !email) {
    return NextResponse.json({ error: 'Missing userId or email' }, { status: 400 })
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    { email_confirm: true }
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}