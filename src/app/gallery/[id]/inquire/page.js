// ============================================================
// Script: page.js (inquire)
// Path:   src/app/gallery/[id]/inquire/page.js
// Desc:   "I'm Interested" contact form for a single artwork. Loads
//         artwork + artist context from Supabase, submits buyer's
//         message to /api/inquire which emails Farmstead Artists.
// ============================================================

'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function InquirePage() {
  const { id } = useParams()

  const [work, setWork]             = useState(null)
  const [loading, setLoading]       = useState(true)
  const [name, setName]             = useState('')
  const [email, setEmail]           = useState('')
  const [message, setMessage]       = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus]         = useState(null) // null | 'success' | 'error'
  const [errorMsg, setErrorMsg]     = useState('')

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('artworks')
        .select(`
          id, title, medium, price, photo_url,
          artists (name, slug)
        `)
        .eq('id', id)
        .single()

      setWork(data || null)
      setLoading(false)
    }
    load()
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artworkId: work?.id,
          artworkTitle: work?.title,
          artistName: work?.artists?.name,
          buyerName: name,
          buyerEmail: email,
          message
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.')
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-cream-100">
        <p className="text-gray-400 font-light">Loading...</p>
      </section>
    )
  }

  if (!work) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center bg-cream-100 px-6 text-center">
        <p className="text-gray-400 font-light mb-4">We couldn't find that artwork.</p>
        <Link href="/gallery" className="text-sage-600 underline text-sm">Back to gallery</Link>
      </section>
    )
  }

  if (status === 'success') {
    return (
      <section className="min-h-screen flex items-center justify-center bg-cream-100 px-6">
        <div className="bg-white rounded-xl p-8 border border-black/[0.04] shadow-sm max-w-md text-center">
          <h1 className="font-serif text-2xl font-bold text-sage-700 mb-2">Message sent!</h1>
          <p className="text-gray-500 font-light mb-6">
            Thanks for your interest in "{work.title}". We'll be in touch soon.
          </p>
          <Link href="/gallery"
            className="inline-block px-6 py-2.5 bg-sage-600 text-cream-50 rounded-lg text-sm font-semibold hover:bg-sage-500 transition-colors">
            Back to Gallery
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-14 px-6 md:px-16 bg-cream-100 min-h-screen flex justify-center">
      <div className="w-full max-w-md">

        <Link href="/gallery" className="text-xs text-sage-600 hover:text-sage-500 mb-6 inline-block">
          &larr; Back to Gallery
        </Link>

        {/* Artwork summary */}
        <div className="bg-white rounded-xl overflow-hidden border border-black/[0.04] shadow-sm mb-6 flex items-center gap-4 p-4">
          {work.photo_url && (
            <img src={work.photo_url} alt={work.title}
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
          )}
          <div className="min-w-0">
            <h1 className="font-serif font-semibold text-sage-700 text-base truncate">{work.title}</h1>
            {work.artists?.name && (
              <p className="text-xs text-gray-400 font-light">by {work.artists.name}</p>
            )}
            {work.price && (
              <p className="text-sage-600 font-semibold text-sm mt-1">${work.price.toLocaleString()}</p>
            )}
          </div>
        </div>

        <h2 className="font-serif text-xl font-bold text-sage-700 mb-1">I'm Interested</h2>
        <p className="text-gray-500 font-light text-sm mb-6">
          Send a message and someone from Farmstead Artists will get back to you.
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-black/[0.04] shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-medium text-sage-700 mb-1">Your Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-cream-50 focus:border-sage-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-sage-700 mb-1">Your Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-cream-50 focus:border-sage-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-sage-700 mb-1">Message</label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={`I'm interested in "${work.title}"...`}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-cream-50 focus:border-sage-600 outline-none resize-none"
            />
          </div>

          {status === 'error' && (
            <p className="text-red-600 text-xs">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-sage-600 text-cream-50 rounded-lg text-sm font-semibold hover:bg-sage-500 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  )
}

// end of file
