// ============================================================
// Script: page.js (inquire)
// Path:   src/app/gallery/[id]/inquire/page.js
// Desc:   Buyer interest form — saves to inquiries table
//         and notifies artist via Supabase email
// ============================================================

'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function InquirePage() {
  const { id } = useParams()
  const router = useRouter()

  const [artwork, setArtwork] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [message, setMessage] = useState('')

  // Form
  const [buyerName, setBuyerName] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [buyerMessage, setBuyerMessage] = useState('')

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('artworks')
        .select(`
          id, title, medium, size, price, photo_url,
          width_in, height_in, description,
          artists (id, name, slug, email)
        `)
        .eq('id', id)
        .single()

      if (!data) { router.push('/gallery'); return }
      setArtwork(data)
      setLoading(false)
    }
    load()
  }, [id, router])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!buyerName.trim() || !buyerEmail.trim()) {
      setMessage('Name and email are required.')
      return
    }

    setSaving(true)
    setMessage('')

    const { error } = await supabase
      .from('inquiries')
      .insert({
        artwork_id: artwork.id,
        artist_id: artwork.artists.id,
        buyer_name: buyerName.trim(),
        buyer_email: buyerEmail.trim(),
        message: buyerMessage.trim(),
      })

    setSaving(false)

    if (error) {
      setMessage('Error submitting inquiry: ' + error.message)
    } else {
      setDone(true)
    }
  }

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-cream-100">
        <p className="text-gray-400 font-light">Loading...</p>
      </section>
    )
  }

  if (done) {
    return (
      <section className="min-h-screen flex items-center justify-center px-6 bg-cream-100">
        <div className="max-w-sm w-full text-center">
          <div className="text-5xl mb-4">🎨</div>
          <h1 className="font-serif text-2xl font-bold text-sage-700 mb-3">
            Thank You!
          </h1>
          <p className="text-gray-500 font-light leading-relaxed mb-2">
            Your interest in <strong className="text-sage-700">{artwork.title}</strong> has been sent to {artwork.artists.name}.
          </p>
          <p className="text-gray-400 text-sm font-light mb-8">
            The artist will be in touch with you at {buyerEmail}.
          </p>
          <Link
            href="/gallery"
            className="inline-block px-8 py-3 bg-sage-600 text-cream-50 rounded-lg font-semibold hover:bg-sage-500 transition-colors"
          >
            Back to Gallery
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-cream-100 pb-24">

      {/* Header */}
      <div className="bg-sage-600 text-cream-50 px-6 py-5">
        <button onClick={() => router.back()} className="text-white/60 text-sm mb-1 hover:text-white">
          ← Back to Gallery
        </button>
        <h1 className="font-serif text-xl font-bold">Express Interest</h1>
      </div>

      <div className="px-6 py-6 max-w-lg mx-auto">

        {/* Artwork summary card */}
        <div className="bg-white rounded-xl overflow-hidden border border-black/[0.04] shadow-sm mb-8 flex gap-4 p-4">
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-cream-200 flex-shrink-0">
            {artwork.photo_url ? (
              <img
                src={artwork.photo_url}
                alt={artwork.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-300 text-xs">No photo</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-serif font-semibold text-sage-700 leading-tight">{artwork.title}</h2>
            <p className="text-xs text-gray-400 font-light mt-0.5">
              by {artwork.artists.name}
            </p>
            {artwork.medium && (
              <p className="text-xs text-gray-400 font-light">{artwork.medium}</p>
            )}
            {(artwork.width_in && artwork.height_in) ? (
              <p className="text-xs text-gray-400 font-light">
                {artwork.width_in} × {artwork.height_in} in
              </p>
            ) : artwork.size ? (
              <p className="text-xs text-gray-400 font-light">{artwork.size}</p>
            ) : null}
            {artwork.price && (
              <p className="text-sage-600 font-semibold text-sm mt-1">
                ${artwork.price.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Form */}
        <p className="text-gray-500 font-light text-sm mb-6 leading-relaxed">
          Fill in your details below and {artwork.artists.name} will contact you directly to arrange the purchase.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">Your Name *</label>
            <input
              type="text"
              value={buyerName}
              onChange={e => setBuyerName(e.target.value)}
              placeholder="Jane Smith"
              required
              className="w-full px-4 py-3.5 text-base rounded-lg border border-gray-200 bg-white focus:border-sage-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">Your Email *</label>
            <input
              type="email"
              value={buyerEmail}
              onChange={e => setBuyerEmail(e.target.value)}
              placeholder="jane@email.com"
              required
              className="w-full px-4 py-3.5 text-base rounded-lg border border-gray-200 bg-white focus:border-sage-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">
              Message <span className="text-gray-400 font-light">(optional)</span>
            </label>
            <textarea
              value={buyerMessage}
              onChange={e => setBuyerMessage(e.target.value)}
              rows={4}
              placeholder="Any questions about the piece, shipping, pickup..."
              className="w-full px-4 py-3.5 text-base rounded-lg border border-gray-200 bg-white focus:border-sage-600 outline-none resize-none"
            />
          </div>

          {message && (
            <p className="text-red-500 text-sm font-medium">{message}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-sage-600 text-cream-50 rounded-lg font-semibold text-lg hover:bg-sage-500 transition-colors disabled:opacity-50"
          >
            {saving ? 'Sending...' : 'Send My Interest'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-xs mt-6 font-light">
          The artist will contact you directly. No payment is collected here.
        </p>

      </div>
    </section>
  )
}

// end of file
