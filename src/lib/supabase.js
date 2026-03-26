// ============================================================
// Script: supabase.js
// Path:   src/lib/supabase.js
// Desc:   Supabase client — lazy init for build compatibility
// ============================================================

import { createClient } from '@supabase/supabase-js'

let _supabase = null

export function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  }
  return _supabase
}

// backward-compatible named export (calls getter)
export const supabase = new Proxy({}, {
  get(_, prop) {
    return getSupabase()[prop]
  }
})

// end of file
