// ============================================================
// Script: page.js (auth-callback)
// Path:   src/app/auth/callback/page.js
// Desc:   Handles both PKCE flow (?code=) and implicit flow
//         (#access_token). PKCE is the Supabase default.
// ============================================================

'use client'
import { Suspense, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

// ── inner component (needs useSearchParams → requires Suspense) ────────────

function AuthCallbackInner() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Signing you in...')

  useEffect(() => {
    async function handleCallback() {
      const code = searchParams.get('code')

      if (code) {
        // ── PKCE flow (Supabase default) ─────────────────────────────────
        // Exchange the one-time code for a real session
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          setStatus('Sign in failed. Please try again.')
          setTimeout(() => router.replace('/login'), 2000)
        } else {
          router.replace('/dashboard')
        }
      } else {
        // ── Implicit flow fallback (#access_token hash) ──────────────────
        // Supabase JS auto-processes the hash; we just wait for the event
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (event === 'SIGNED_IN' && session) {
              subscription.unsubscribe()
              router.replace('/dashboard')
            }
          }
        )

        const timeout = setTimeout(() => {
          subscription.unsubscribe()
          setStatus('Sign in failed. Please try again.')
          setTimeout(() => router.replace('/login'), 2000)
        }, 6000)

        return () => {
          subscription.unsubscribe()
          clearTimeout(timeout)
        }
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <section className="min-h-screen flex items-center justify-center bg-cream-100">
      <div className="text-center">
        <div className="text-4xl mb-4">🔐</div>
        <p className="text-gray-400 font-light">{status}</p>
      </div>
    </section>
  )
}

// ── outer wrapper — Suspense required by Next.js for useSearchParams ────────

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <section className="min-h-screen flex items-center justify-center bg-cream-100">
        <div className="text-center">
          <div className="text-4xl mb-4">🔐</div>
          <p className="text-gray-400 font-light">Signing you in...</p>
        </div>
      </section>
    }>
      <AuthCallbackInner />
    </Suspense>
  )
}

// end of file
