// ============================================================
// Script: page.js (auth-callback)
// Path:   src/app/auth/callback/page.js
// Desc:   Handles Supabase magic link — single clean check
// ============================================================

'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Signing you in...')

  useEffect(() => {
    async function handleCallback() {
      // Wait briefly for Supabase to process URL hash tokens
      await new Promise(r => setTimeout(r, 1500))

      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        router.replace('/dashboard')
      } else {
        setStatus('Sign in failed — please try again.')
        setTimeout(() => router.replace('/login'), 2000)
      }
    }
    handleCallback()
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
