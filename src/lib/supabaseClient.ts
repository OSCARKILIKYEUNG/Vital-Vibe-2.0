// src/lib/supabaseClient.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function assertEnv() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      'Missing Supabase env. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel Environment Variables.'
    );
  }
}

const isBrowser = typeof window !== 'undefined';

/**
 * 單例：用於一般 client 元件、hooks。
 * 在伺服器端載入時不會嘗試持久化 session，避免 Node 環境報錯。
 */
let singleton: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  assertEnv();
  if (singleton) return singleton;

  singleton = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    auth: {
      flowType: 'pkce',
      persistSession: isBrowser,        // 只有瀏覽器才保存 session
      autoRefreshToken: isBrowser
    },
    global: {
      fetch: (input, init) => fetch(input as any, init)
    }
  });

  return singleton;
}

/**
 * 每次呼叫回傳一個新的 client。
 * 適合在 Server Components / Server Actions／Route Handlers 使用。
 */
export function createSupabaseServerClient(): SupabaseClient {
  assertEnv();
  return createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    auth: {
      flowType: 'pkce',
      persistSession: false,
      autoRefreshToken: false
    },
    global: {
      fetch: (input, init) => fetch(input as any, init)
    }
  });
}

// 方便舊碼直接 import { supabase } 使用
export const supabase = getSupabase();
export default supabase;
