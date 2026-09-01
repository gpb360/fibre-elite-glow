import 'server-only';

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Service-role client. This module cannot be imported into a client bundle. */
export const supabaseAdmin = supabaseUrl && serviceRoleKey
  ? createClient<Database>(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: { 'X-Client-Info': 'fibre-elite-glow-admin@1.0.0' },
      },
      db: { schema: 'public' },
    })
  : undefined;
