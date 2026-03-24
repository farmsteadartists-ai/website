// ============================================================
// Script: page.js (dashboard)
// Path:   src/app/dashboard/page.js
// Desc:   Artist hub — profile card + artwork list, phone-first
//         Admin role sees all artists and all artworks
// ============================================================

'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const [artist, setArtist] = useState(null)
  const [artworks, setArtworks] = useState([])
  const [allArtists, setAllArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const { data: artistData } = await supabase
        .from('artists')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (!artistData) {
        setLoading(false)
        return
      }

      setArtist(artistData)

      if (artistData.role === 'admin') {
        setIsAdmin(true)

        const { data: allArtistsData } = await supabase
          .from('artists')
          .select('*')
          .eq('role', 'member')
          .order('sort_order')

        setAllArtists(allArtistsData || [])

        const { data: artworkData } = await supabase
          .from('artworks')
          .select('*, artists(name)')
          .order('sort_order')

        setArtworks(artworkData || [])
      } else {
        const { data: artworkData } = await supabase
          .from('artworks')
          .select('*')
          .eq('artist_id', artistData.id)
          .order('sort_order')

        setArtworks(artworkData || [])
      }

      setLoading(false)
    }
    load()
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-cream-100">
        <p className="text-gray-400 font-light">Loading...</p>
      </section>
    )
  }

  if (!artist) {
    return (
      <section className="min-h-screen flex items-center justify-center px-6 bg-cream-100">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold text-sage-700 mb-3">No Profile Found</h1>
          <p className="text-gray-500 font-light mb-4">
            Your email isn't linked to an artist profile yet. Contact the admin.
          </p>
          <button onClick={handleLogout} className="text-sage-600 underline text-sm">Sign Out</button>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-cream-100 pb-24">
      <div className="bg-sage-600 text-cream-50 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[0.65rem] uppercase tracking-[0.2em] text-white/50 font-semibold">
              {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
            </div>
            <h1 className="font-serif text-2xl font-bold">{artist.name}</h1>
          </div>
          <button onClick={handleLogout} className="text-white/60 text-sm hover:text-white">
            Sign Out
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">

        {/* ADMIN VIEW — all artists */}
        {isAdmin && (
          <div className="bg-white rounded-xl p-5 border border-black/[0.04] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-semibold text-sage-700">
                All Artists ({allArtists.length})
              </h2>
              <span className="text-xs bg-sage-600 text-cream-50 px-2 py-1 rounded font-semibold uppercase tracking-wider">
                Admin
              </span>
            </div>
            <div className="space-y-2">
              {allArtists.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-cream-50 rounded-lg border border-black/[0.04]">
                  <div>
                    <div className="font-serif font-semibold text-sage-700 text-sm">{a.name}</div>
                    <div className="text-xs text-gray-400 font-light">{a.medium || 'No medium set'}</div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/edit-profile?artist=${a.id}`}
                      className="text-xs text-sage-600 border border-sage-600 px-2 py-1 rounded hover:bg-sage-600 hover:text-cream-50 transition-colors"
                    >
                      Edit Profile
                    </Link>
                    <Link
                      href={`/dashboard/add-artwork?artist=${a.id}`}
                      className="text-xs bg-sage-600 text-cream-50 px-2 py-1 rounded hover:bg-sage-500 transition-colors"
                    >
                      + Artwork
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFILE CARD — regular artists only */}
        {!isAdmin && (
          <div className="bg-white rounded-xl p-5 border border-black/[0.04] shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-sage-600/10 flex-shrink-0">
                {artist.photo_url ? (
                  <img src={artist.photo_url} alt={artist.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-serif text-xl font-bold text-sage-600/30">
                      {artist.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-lg font-semibold text-sage-700 truncate">{artist.name}</h2>
                <p className="text-sm text-gray-400 font-light truncate">{artist.medium || 'No medium set'}</p>
              </div>
            </div>
            {artist.bio ? (
              <p className="text-gray-500 text-sm font-light leading-relaxed line-clamp-3">{artist.bio}</p>
            ) : (
              <p className="text-gray-300 text-sm italic">No artist statement yet</p>
            )}
            <Link
              href="/dashboard/edit-profile"
              className="block w-full text-center mt-4 py-3 bg-sage-600 text-cream-50 rounded-lg font-semibold text-base hover:bg-sage-500 transition-colors"
            >
              Edit My Profile
            </Link>
          </div>
        )}

        {/* ARTWORKS */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-xl font-semibold text-sage-700">
              {isAdmin ? `All Artwork (${artworks.length})` : `My Artwork (${artworks.length})`}
            </h2>
          </div>
          {!isAdmin && (
            <Link
              href="/dashboard/add-artwork"
              className="block w-full text-center py-4 mb-4 border-2 border-dashed border-sage-600/30 text-sage-600 rounded-xl font-semibold text-lg hover:border-sage-600 hover:bg-sage-600/5 transition-colors"
            >
              + Add Artwork
            </Link>
          )}
          <div className="space-y-3">
            {artworks.map((work) => (
              <Link
                key={work.id}
                href={`/dashboard/edit-artwork/${work.id}`}
                className="flex items-center gap-4 bg-white rounded-xl p-4 border border-black/[0.04] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-sage-600/5 flex-shrink-0">
                  {work.photo_url ? (
                    <img src={work.photo_url} alt={work.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-sage-500/30 text-xs text-center">No photo</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-semibold text-sage-700 truncate">{work.title}</h3>
                  {isAdmin && work.artists && (
                    <p className="text-xs text-sage-500 font-medium">{work.artists.name}</p>
                  )}
                  <p className="text-xs text-gray-400 font-light">
                    {work.medium}{work.size ? ` · ${work.size}` : ''}
                  </p>
                  {work.price && (
                    <p className="text-sm text-sage-600 font-medium">${work.price}</p>
                  )}
                </div>
                <div className="text-gray-300 text-lg">›</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// end of file
