// Enhanced Supabase client with better error handling and debugging
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Use environment variables - required for security
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Enhanced client configuration
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    // Debug logging disabled — enable with NEXT_PUBLIC_SUPABASE_DEBUG=true if needed
    debug: process.env.NEXT_PUBLIC_SUPABASE_DEBUG === 'true',
  },
  global: {
    headers: {
      'X-Client-Info': 'fibre-elite-glow@1.0.0',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Development debugging — gated behind explicit flag to avoid console noise
if (process.env.NEXT_PUBLIC_SUPABASE_DEBUG === 'true') {
  console.log('🔧 Supabase Client Configuration:', {
    url: SUPABASE_URL,
    hasKey: !!SUPABASE_PUBLISHABLE_KEY,
  });
}
