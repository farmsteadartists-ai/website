// ============================================================
// Script: page.js (login)
// Path:   src/app/login/page.js
// Desc:   Magic link email login — phone-first, no password
// ============================================================

'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <section className="min-h-screen flex items-center justify-center px-6 bg-cream-100">
        <div className="max-w-sm w-full text-center">
          <div className="text-5xl mb-4">📬</div>
          <h1 className="font-serif text-2xl font-bold text-sage-700 mb-3">Check Your Email</h1>
          <p className="text-gray-500 font-light leading-relaxed">
            We sent a magic link to <strong className="text-sage-700">{email}</strong>. 
            Tap the link in the email to sign in.
          </p>
          <p className="text-gray-400 text-sm mt-4 font-light">
            Check your spam folder if you don't see it.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-6 bg-cream-100">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-sage-700 mb-2">Artist Login</h1>
          <p className="text-gray-500 font-light">
            Enter your email to receive a sign-in link. No password needed.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-4 text-lg rounded-lg border border-gray-200 bg-white focus:border-sage-600 focus:ring-1 focus:ring-sage-600 outline-none"
            autoComplete="email"
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-sage-600 text-cream-50 rounded-lg font-semibold text-lg hover:bg-sage-500 transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-xs mt-6 font-light">
          Only registered Farmstead Artists members can log in.
        </p>
      </div>
    </section>
  )
}

// end of file
