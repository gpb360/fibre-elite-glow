// Enhanced Supabase client with better error handling and debugging
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use environment variables with fallbacks for development
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lyynavswxtzhsmwetgtn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5eW5hdnN3eHR6aHNtd2V0Z3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwOTQ1ODEsImV4cCI6MjA2MzY3MDU4MX0.bm7UieeTN7W9RHw7yDxMP9K8zi3GPu2iAnu_iUeHKdM";

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
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

// Development debugging
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Supabase Client Configuration:', {
    url: SUPABASE_URL,
    hasKey: !!SUPABASE_PUBLISHABLE_KEY,
    keyPrefix: SUPABASE_PUBLISHABLE_KEY.substring(0, 20) + '...',
  });
}