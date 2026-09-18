import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key-for-build'

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey,
  )
