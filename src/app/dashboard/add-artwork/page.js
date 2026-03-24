// ============================================================
// Script: page.js (add-artwork)
// Path:   src/app/dashboard/add-artwork/page.js
// Desc:   Add artwork — title, medium, size, price, photo
//         Shows existing artworks below form to avoid duplicates
//         Admin can add artwork for any artist via ?artist=ID
// ============================================================

'use client'
import { useState, useEffect, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function AddArtworkForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const artistIdParam = searchParams.get('artist')

  const [artist, setArtist] = useState(null)
  const [existingArtworks, setExistingArtworks] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)

  const [title, setTitle] = useState('')
  const [medium, setMedium] = useState('')
  const [size, setSize] = useState('')
  const [price, setPrice] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: loggedInArtist } = await supabase
        .from('artists')
        .select('id, name, role')
        .eq('user_id', user.id)
        .single()

      if (!loggedInArtist) { router.push('/dashboard'); return }

      const adminUser = loggedInArtist.role === 'admin'
      setIsAdmin(adminUser)

      let targetArtist = loggedInArtist

      if (adminUser && artistIdParam) {
        const { data: ta } = await supabase
          .from('artists')
          .select('id, name')
          .eq('id', artistIdParam)
          .single()
        if (ta) targetArtist = ta
      }

      setArtist(targetArtist)

      // Load existing artworks for this artist
      const { data: existing } = await supabase
        .from('artworks')
        .select('*')
        .eq('artist_id', targetArtist.id)
        .order('sort_order')

      setExistingArtworks(existing || [])
      setLoading(false)
    }
    load()
  }, [router, artistIdParam])

  function handlePhotoSelect(e) {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!title.trim()) { setMessage('Title is required'); return }

    setSaving(true)
    setMessage('')

    let photoUrl = null

    if (photoFile) {
      const ext = photoFile.name.split('.').pop()
      const filename = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
      const path = `${artist.id}/artwork-${filename}-${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(path, photoFile)

      if (uploadError) {
        setMessage('Photo upload error: ' + uploadError.message)
        setSaving(false)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(path)

      photoUrl = publicUrl
    }

    const nextSort = existingArtworks.length > 0
      ? existingArtworks[existingArtworks.length - 1].sort_order + 1
      : 1

    const { data: newWork, error } = await supabase
      .from('artworks')
      .insert({
        artist_id: artist.id,
        title: title.trim(),
        medium: medium.trim(),
        size: size.trim(),
        price: price ? parseFloat(price) : null,
        photo_url: photoUrl,
        sort_order: nextSort,
        status: 'available',
      })
      .select()
      .single()

    setSaving(false)
    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Artwork added!')
      // Add to existing list and reset form
      setExistingArtworks(prev => [...prev, newWork])
      setTitle('')
      setMedium('')
      setSize('')
      setPrice('')
      setPhotoFile(null)
      setPhotoPreview(null)
    }
  }

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-cream-100">
        <p className="text-gray-400 font-light">Loading...</p>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-cream-100 pb-24">
      <div className="bg-sage-600 text-cream-50 px-6 py-5">
        <button onClick={() => router.push('/dashboard')} className="text-white/60 text-sm mb-1 hover:text-white">
          ← Dashboard
        </button>
        <h1 className="font-serif text-xl font-bold">
          {isAdmin && artistIdParam ? `Add Artwork for ${artist?.name}` : 'Add Artwork'}
        </h1>
      </div>

      <div className="px-6 py-6">

        {/* Photo upload */}
        <div className="mb-6">
          <div className="aspect-square max-w-xs mx-auto rounded-xl overflow-hidden bg-white border-2 border-dashed border-sage-600/20 mb-3">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-sage-600/5 transition-colors">
                <span className="text-4xl mb-2">📷</span>
                <span className="text-sage-600 font-medium">Tap to add photo</span>
                <span className="text-gray-400 text-sm font-light mt-1">Take a photo or choose from gallery</span>
                <input type="file" accept="image/*" capture="environment" onChange={handlePhotoSelect} className="hidden" />
              </label>
            )}
          </div>
          {photoPreview && (
            <label className="block text-center cursor-pointer text-sage-600 text-sm font-medium">
              Change photo
              <input type="file" accept="image/*" capture="environment" onChange={handlePhotoSelect} className="hidden" />
            </label>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sunset at Schoodic"
              required
              className="w-full px-4 py-3.5 text-base rounded-lg border border-gray-200 bg-white focus:border-sage-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">Medium</label>
            <input
              type="text"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              placeholder="e.g. Watercolor, Oil on canvas"
              className="w-full px-4 py-3.5 text-base rounded-lg border border-gray-200 bg-white focus:border-sage-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-1">Size</label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g. 12x16"
                className="w-full px-4 py-3.5 text-base rounded-lg border border-gray-200 bg-white focus:border-sage-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-1">Price ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                min="0"
                step="1"
                className="w-full px-4 py-3.5 text-base rounded-lg border border-gray-200 bg-white focus:border-sage-600 outline-none"
              />
            </div>
          </div>

          {message && (
            <p className={`text-sm font-medium ${message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-sage-600 text-cream-50 rounded-lg font-semibold text-lg hover:bg-sage-500 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Add Artwork'}
          </button>
        </form>

        {/* Existing artworks */}
        {existingArtworks.length > 0 && (
          <div className="mt-10">
            <h2 className="font-serif text-lg font-semibold text-sage-700 mb-3">
              Already on file ({existingArtworks.length})
            </h2>
            <div className="space-y-2">
              {existingArtworks.map((work) => (
                <Link
                  key={work.id}
                  href={`/dashboard/edit-artwork/${work.id}`}
                  className="flex items-center gap-3 bg-white rounded-lg p-3 border border-black/[0.04] hover:shadow-sm transition-shadow"
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-sage-600/5 flex-shrink-0">
                    {work.photo_url ? (
                      <img src={work.photo_url} alt={work.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-sage-500/30 text-xs">No photo</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-serif font-semibold text-sage-700 text-sm truncate">{work.title}</div>
                    <div className="text-xs text-gray-400 font-light">
                      {work.medium}{work.size ? ` · ${work.size}` : ''}{work.price ? ` · $${work.price}` : ''}
                    </div>
                  </div>
                  <div className="text-gray-300 text-sm">Edit ›</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {existingArtworks.length === 0 && (
          <div className="mt-8 text-center text-gray-400 font-light text-sm">
            No artwork on file yet — add the first piece above.
          </div>
        )}
      </div>
    </section>
  )
}

export default function AddArtworkPage() {
  return (
    <Suspense fallback={
      <section className="min-h-screen flex items-center justify-center bg-cream-100">
        <p className="text-gray-400 font-light">Loading...</p>
      </section>
    }>
      <AddArtworkForm />
    </Suspense>
  )
}

// end of file
