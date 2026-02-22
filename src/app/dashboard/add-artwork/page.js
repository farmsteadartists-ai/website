// ============================================================
// Script: page.js (add-artwork)
// Path:   src/app/dashboard/add-artwork/page.js
// Desc:   Add artwork — title, medium, size, price, photo
//         Phone-first: camera opens for photo, big tap targets
// ============================================================

'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AddArtworkPage() {
  const router = useRouter()
  const [artist, setArtist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)

  // Form
  const [title, setTitle] = useState('')
  const [medium, setMedium] = useState('')
  const [size, setSize] = useState('')
  const [price, setPrice] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('artists')
        .select('id, name')
        .eq('user_id', user.id)
        .single()

      if (!data) { router.push('/dashboard'); return }
      setArtist(data)
      setLoading(false)
    }
    load()
  }, [router])

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

    // Upload photo if selected
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

    // Get current max sort_order
    const { data: existing } = await supabase
      .from('artworks')
      .select('sort_order')
      .eq('artist_id', artist.id)
      .order('sort_order', { ascending: false })
      .limit(1)

    const nextSort = existing && existing.length > 0 ? existing[0].sort_order + 1 : 1

    // Insert artwork
    const { error } = await supabase
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

    setSaving(false)
    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Artwork added!')
      setTimeout(() => router.push('/dashboard'), 1000)
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
      {/* Header */}
      <div className="bg-sage-600 text-cream-50 px-6 py-5">
        <button onClick={() => router.push('/dashboard')} className="text-white/60 text-sm mb-1 hover:text-white">
          ← Dashboard
        </button>
        <h1 className="font-serif text-xl font-bold">Add Artwork</h1>
      </div>

      <div className="px-6 py-6">
        {/* Photo */}
        <div className="mb-6">
          <div className="aspect-square max-w-xs mx-auto rounded-xl overflow-hidden bg-white border-2 border-dashed border-sage-600/20 mb-3">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-sage-600/5 transition-colors">
                <span className="text-4xl mb-2">📷</span>
                <span className="text-sage-600 font-medium">Tap to add photo</span>
                <span className="text-gray-400 text-sm font-light mt-1">Take a photo or choose from gallery</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {photoPreview && (
            <label className="block text-center cursor-pointer text-sage-600 text-sm font-medium">
              Change photo
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoSelect}
                className="hidden"
              />
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
              autoFocus
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
      </div>
    </section>
  )
}

// end of file
