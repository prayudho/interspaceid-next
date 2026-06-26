import { createClient, type SupabaseClient } from '@supabase/supabase-js'

function makeLazy(getUrl: () => string, getKey: () => string): SupabaseClient {
  let client: SupabaseClient | null = null
  return new Proxy({} as SupabaseClient, {
    get(_, prop) {
      if (!client) {
        const url = getUrl()
        const key = getKey()
        if (!url || !key) throw new Error('Missing Supabase environment variables')
        client = createClient(url, key, { auth: { persistSession: false } })
      }
      const val = client[prop as keyof SupabaseClient]
      return typeof val === 'function' ? (val as Function).bind(client) : val
    },
  })
}

// Server-only — uses service role key, bypasses RLS
export const supabaseAdmin: SupabaseClient = makeLazy(
  () => process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  () => process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
)

// Client-safe — uses anon key, respects RLS
export const supabase: SupabaseClient = makeLazy(
  () => process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
)
