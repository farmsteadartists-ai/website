// ============================================================
// Script: page.js (edit-profile)
// Path:   src/app/dashboard/edit-profile/page.js
// Desc:   Edit name, statement, medium, photo — phone-first
// ============================================================

'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function EditProfilePage() {
  const router = useRouter()
  const [artist, setArtist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  // Form fields
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [medium, setMedium] = useState('')
  const [website, setWebsite] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('artists')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!data) { router.push('/dashboard'); return }

      setArtist(data)
      setName(data.name || '')
      setBio(data.bio || '')
      setMedium(data.medium || '')
      setWebsite(data.website || '')
      setLoading(false)
    }
    load()
  }, [router])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const { error } = await supabase
      .from('artists')
      .update({ name, bio, medium, website })
      .eq('id', artist.id)

    setSaving(false)
    if (error) {
      setMessage('Error saving: ' + error.message)
    } else {
      setMessage('Saved!')
      setTimeout(() => router.push('/dashboard'), 1000)
    }
  }

  async function handlePhoto(e) {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setMessage('')

    // Upload to Supabase Storage
    const ext = file.name.split('.').pop()
    const path = `${artist.id}/headshot.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setMessage('Upload error: ' + uploadError.message)
      setUploading(false)
      return
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(path)

    // Update artist record
    await supabase
      .from('artists')
      .update({ photo_url: publicUrl })
      .eq('id', artist.id)

    setArtist({ ...artist, photo_url: publicUrl })
    setUploading(false)
    setMessage('Photo updated!')
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
        <h1 className="font-serif text-xl font-bold">Edit My Profile</h1>
      </div>

      <div className="px-6 py-6">
        {/* Photo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-sage-600/10 mb-3">
            {artist.photo_url ? (
              <img src={artist.photo_url} alt={artist.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-serif text-3xl font-bold text-sage-600/30">
                  {artist.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
          </div>
          <label className="cursor-pointer bg-white border border-sage-600/30 text-sage-600 px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-sage-600/5 transition-colors">
            {uploading ? 'Uploading...' : '📷 Change Photo'}
            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={handlePhoto}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3.5 text-base rounded-lg border border-gray-200 bg-white focus:border-sage-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">Medium</label>
            <input
              type="text"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              placeholder="e.g. Watercolor, Oil, Acrylic"
              className="w-full px-4 py-3.5 text-base rounded-lg border border-gray-200 bg-white focus:border-sage-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">Artist Statement</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={6}
              placeholder="Tell visitors about yourself and your art..."
              className="w-full px-4 py-3.5 text-base rounded-lg border border-gray-200 bg-white focus:border-sage-600 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">Website (optional)</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yoursite.com"
              className="w-full px-4 py-3.5 text-base rounded-lg border border-gray-200 bg-white focus:border-sage-600 outline-none"
            />
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
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </section>
  )
}

// end of file
