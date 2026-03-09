// ============================================================
// Script: page.js (auth-callback)
// Path:   src/app/auth/callback/page.js
// Desc:   Implicit flow — waits for Supabase to auto-process
//         #access_token hash, then redirects to dashboard
// ============================================================

'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Signing you in...')

  useEffect(() => {
    // Supabase JS automatically detects and processes
    // the #access_token hash in the URL on page load.
    // We just listen for the SIGNED_IN event.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        subscription.unsubscribe()
        router.replace('/dashboard')
      }
    })

    // Hard timeout — 6 seconds then give up
    const timeout = setTimeout(() => {
      subscription.unsubscribe()
      setStatus('Sign in failed. Please try again.')
      setTimeout(() => router.replace('/login'), 2000)
    }, 6000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [router])

  return (
    <section className="min-h-screen flex items-center justify-center bg-cream-100">
      <div className="text-center">
        <div className="text-4xl mb-4">🔐</div>
        <p className="text-gray-400 font-light">{status}</p>
      </div>
    </section>
  )
}

// end of file
