// ============================================================
// Script: supabase.js
// Path:   src/lib/supabase.js
// Desc:   Supabase client — implicit flow for magic links
// ============================================================

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// end of file
