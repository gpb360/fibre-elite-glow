// Enhanced Supabase client with better error handling and debugging
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Use environment variables - required for security
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Service-role key (server-side only ‑ NEVER expose to the browser!)
// This key bypasses RLS, so keep it secure in Supabase secrets / server env.
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Warn in development if the service role key is missing when required.
if (process.env.NODE_ENV === 'development' && !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    '⚠️  SUPABASE_SERVICE_ROLE_KEY is not set. ' +
      'Server-side operations that bypass RLS (e.g. webhooks) will fail.'
  );
}

// Enhanced client configuration with debugging
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: process.env.NODE_ENV === 'development',
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

/**
 * Admin client intended **only** for server-side code (e.g. API routes, webhooks).
 * Uses the service-role key so it can bypass RLS policies.
 * Do NOT import this from any code that is executed on the client/browser.
 */
export const supabaseAdmin = SUPABASE_SERVICE_ROLE_KEY
  ? createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        // Service role key should never be used to create user sessions.
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          'X-Client-Info': 'fibre-elite-glow-admin@1.0.0',
        },
      },
      db: {
        schema: 'public',
      },
    })
  : undefined;

// Development debugging
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Supabase Client Configuration:', {
    url: SUPABASE_URL,
    hasKey: !!SUPABASE_PUBLISHABLE_KEY,
    keyPrefix: SUPABASE_PUBLISHABLE_KEY.substring(0, 20) + '...',
    hasServiceRoleKey: !!SUPABASE_SERVICE_ROLE_KEY,
  });
}