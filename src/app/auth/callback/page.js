// ============================================================
// Script: page.js (auth-callback)
// Path:   src/app/auth/callback/page.js
// Desc:   Handles PKCE flow (?code=) and implicit flow
//         (#access_token). Cleanup refs prevent stale timers
//         from firing after redirect to dashboard.
// ============================================================

'use client'
import { Suspense, useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthCallbackInner() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Signing you in...')

  // Refs so the useEffect cleanup can cancel these no matter when it runs
  const timeoutRef      = useRef(null)
  const subscriptionRef = useRef(null)

  useEffect(() => {
    const code = searchParams.get('code')

    if (code) {
      // ── PKCE flow ──────────────────────────────────────────────────────
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          setStatus('Sign in failed. Please try again.')
          timeoutRef.current = setTimeout(() => router.replace('/login'), 2000)
        } else {
          timeoutRef.current = setTimeout(() => router.replace('/dashboard'), 300)
        }
      })

    } else {
      // ── Implicit flow (#access_token hash) ─────────────────────────────
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === 'SIGNED_IN' && session) {
            // Cancel the failure timeout — we succeeded
            clearTimeout(timeoutRef.current)
            subscription.unsubscribe()
            timeoutRef.current = setTimeout(() => router.replace('/dashboard'), 300)
          }
        }
      )
      subscriptionRef.current = subscription

      // Failure timeout — cleared above if SIGNED_IN fires first
      timeoutRef.current = setTimeout(() => {
        subscriptionRef.current?.unsubscribe()
        setStatus('Sign in failed. Please try again.')
        setTimeout(() => router.replace('/login'), 2000)
      }, 6000)
    }

    // Cleanup — runs when component unmounts (i.e. after redirect)
    return () => {
      clearTimeout(timeoutRef.current)
      subscriptionRef.current?.unsubscribe()
    }
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
