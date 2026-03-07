// ============================================================
// Script: page.js (edit-artwork)
// Path:   src/app/dashboard/edit-artwork/[id]/page.js
// Desc:   Edit or delete a single artwork — phone-first
// ============================================================

'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function EditArtworkPage() {
  const router = useRouter()
  const { id } = useParams()

  const [artwork, setArtwork] = useState(null)
  const [artist, setArtist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState('')

  // Form fields
  const [title, setTitle] = useState('')
  const [medium, setMedium] = useState('')
  const [size, setSize] = useState('')
  const [price, setPrice] = useState('')
  const [photoPreview, setPhotoPreview] = useState(null)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      // Get artist
      const { data: artistData } = await supabase
        .from('artists')
        .select('id, name')
        .eq('user_id', session.user.id)
        .single()

      if (!artistData) { router.push('/dashboard'); return }
      setArtist(artistData)

      // Get artwork — must belong to this artist
      const { data: artworkData } = await supabase
        .from('artworks')
        .select('*')
        .eq('id', id)
        .eq('artist_id', artistData.id)
        .single()

      if (!artworkData) { router.push('/dashboard'); return }

      setArtwork(artworkData)
      setTitle(artworkData.title || '')
      setMedium(artworkData.medium || '')
      setSize(artworkData.size || '')
      setPrice(artworkData.price || '')
      setPhotoPreview(artworkData.photo_url || null)
      setLoading(false)
    }
    load()
  }, [id, router])

  async function handlePhoto(e) {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setMessage('')

    const ext = file.name.split('.').pop()
    const filename = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
    const path = `${artist.id}/artwork-${filename}-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setMessage('Upload error: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(path)

    await supabase
      .from('artworks')
      .update({ photo_url: publicUrl })
      .eq('id', artwork.id)

    setPhotoPreview(publicUrl)
    setUploading(false)
    setMessage('Photo updated!')
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!title.trim()) { setMessage('Title is required'); return }

    setSaving(true)
    setMessage('')

    const { error } = await supabase
      .from('artworks')
      .update({
        title: title.trim(),
        medium: medium.trim(),
        size: size.trim(),
        price: price ? parseFloat(price) : null,
      })
      .eq('id', artwork.id)

    setSaving(false)
    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Saved!')
      setTimeout(() => router.push('/dashboard'), 1000)
    }
  }

  async function handleDelete() {
    setDeleting(true)

    const { error } = await supabase
      .from('artworks')
      .delete()
      .eq('id', artwork.id)

    if (error) {
      setMessage('Delete error: ' + error.message)
      setDeleting(false)
      setConfirmDelete(false)
    } else {
      router.push('/dashboard')
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
        <h1 className="font-serif text-xl font-bold">Edit Artwork</h1>
      </div>

      <div className="px-6 py-6">

        {/* Photo */}
        <div className="mb-6">
          <div className="aspect-square max-w-xs mx-auto rounded-xl overflow-hidden bg-white border-2 border-dashed border-sage-600/20 mb-3">
            {photoPreview ? (
              <img src={photoPreview} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-300 text-sm">No photo</span>
              </div>
            )}
          </div>
          <label className="block text-center cursor-pointer text-sage-600 text-sm font-medium">
            {uploading ? 'Uploading...' : '📷 Change Photo'}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhoto}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
            <p className={`text-sm font-medium ${message.includes('error') || message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-sage-600 text-cream-50 rounded-lg font-semibold text-lg hover:bg-sage-500 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        {/* Delete */}
        <div className="mt-8 pt-6 border-t border-black/[0.06]">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-full py-4 border-2 border-red-200 text-red-400 rounded-lg font-semibold text-base hover:border-red-400 hover:text-red-500 transition-colors"
            >
              🗑 Delete Artwork
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-5 text-center">
              <p className="text-red-600 font-medium mb-4">
                Delete <strong>{title}</strong>? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-500 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}

// end of file
