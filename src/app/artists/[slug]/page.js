// artist_slug_page.js
// src/app/artists/[slug]/page.js
// Desc: Artist detail page — photo | bio | QR in one header row
// ============================================================

export const dynamic = 'force-dynamic'
export const revalidate = 0
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ArtworkGrid from '@/components/artwork_grid'
import QRCodeWidget from '@/components/qr_code'

export async function generateMetadata({ params }) {
  const { data: artist } = await supabase
    .from('artists')
    .select('name, medium')
    .eq('slug', params.slug)
    .single()

  if (!artist) return { title: 'Artist Not Found' }

  return {
    title: `${artist.name} — Farmstead Artists`,
    description: `${artist.name}${artist.medium ? `, ${artist.medium}` : ''} — Member artist at Farmstead Artists, East Sullivan, Maine.`,
  }
}

export default async function ArtistDetailPage({ params }) {
  const { data: artist } = await supabase
    .from('artists')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!artist) notFound()

  const { data: artworks } = await supabase
    .from('artworks')
    .select('*')
    .eq('artist_id', artist.id)
    .order('sort_order')

  const pageUrl = `https://farmsteadartists.org/artists/${artist.slug}`

  return (
    <section className="py-14 px-6 md:px-16 bg-gray-100 min-h-screen">

      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/artists" className="text-sage-500 text-sm hover:text-sage-700 transition-colors">
          ← All Artists
        </Link>
      </div>

      {/* Artist header — photo | bio | QR */}
      <div className="flex flex-col md:flex-row gap-8 mb-10 items-start">

        {/* Photo */}
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-lg overflow-hidden bg-sage-600/10 flex-shrink-0">
          {artist.photo_url ? (
            <img src={artist.photo_url} alt={artist.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-serif text-5xl font-bold text-sage-600/25">
                {artist.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
        </div>

        {/* Bio — grows to fill available space */}
        <div className="flex-1">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-sage-700 mb-2">{artist.name}</h1>
          {artist.medium && <div className="text-sage-500 font-light mb-4">{artist.medium}</div>}
          {artist.bio ? (
            <p className="text-gray-600 font-light leading-relaxed whitespace-pre-line">{artist.bio}</p>
          ) : (
            <p className="text-gray-400 font-light italic">Bio coming soon.</p>
          )}
          {artist.website && (
            <a href={artist.website} target="_blank" rel="noopener noreferrer"
              className="inline-block mt-4 text-sage-600 text-sm font-medium hover:text-sage-700 transition-colors">
              Visit website →
            </a>
          )}
        </div>

        {/* QR — desktop only, right column, same top alignment as photo */}
        <div className="hidden md:block flex-shrink-0">
          <QRCodeWidget url={pageUrl} label={artist.slug} />
        </div>

      </div>

      {/* Artworks with lightbox */}
      {artworks && artworks.length > 0 && (
        <div>
          <h2 className="font-serif text-2xl font-semibold text-sage-700 mb-4">
            Artwork ({artworks.length})
          </h2>
          <ArtworkGrid artworks={artworks} artistName={artist.name} />
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-black/[0.06]">
        <Link href="/artists" className="text-sage-500 text-sm hover:text-sage-700 transition-colors">
          ← Back to all artists
        </Link>
      </div>
    </section>
  )
}

// end of file
