export const revalidate = 60
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'

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

  return (
    <section className="py-14 px-6 md:px-16 bg-cream-100 min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/artists" className="text-sage-500 text-sm hover:text-sage-700 transition-colors">
          ← All Artists
        </Link>
      </div>

      {/* Artist header */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        {/* Photo or initials */}
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-lg overflow-hidden bg-sage-600/10 flex-shrink-0">
          {artist.photo_url ? (
            <img
              src={artist.photo_url}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-serif text-5xl font-bold text-sage-600/25">
                {artist.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-sage-700 mb-2">
            {artist.name}
          </h1>
          {artist.medium && (
            <div className="text-sage-500 font-light mb-4">{artist.medium}</div>
          )}
          {artist.bio ? (
            <p className="text-gray-600 font-light leading-relaxed whitespace-pre-line">
              {artist.bio}
            </p>
          ) : (
            <p className="text-gray-400 font-light italic">
              Bio coming soon — check back after our self-serve portal launches!
            </p>
          )}
          {artist.website && (
            <a
              href={artist.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-sage-600 text-sm font-medium hover:text-sage-700 transition-colors"
            >
              Visit website →
            </a>
          )}
        </div>
      </div>

      {/* Artworks */}
      {artworks && artworks.length > 0 && (
        <div>
          <h2 className="font-serif text-2xl font-semibold text-sage-700 mb-4">
            Artwork ({artworks.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {artworks.map((work) => (
              <div key={work.id} className="group">
                <div className="aspect-square rounded-lg overflow-hidden bg-sage-600/5 border border-black/[0.04]">
                  {work.photo_url ? (
                    <img
                      src={work.photo_url}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-4">
                      <span className="font-serif text-sm text-sage-500/40 text-center">{work.title}</span>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <div className="font-serif text-sm font-semibold text-sage-700 leading-tight">{work.title}</div>
                  <div className="text-[0.7rem] text-gray-400 font-light">
                    {work.medium}
                    {work.size && ` · ${work.size}`}
                  </div>
                  {work.price && work.status === 'available' && (
                    <div className="text-sm text-sage-600 font-medium mt-0.5">${work.price}</div>
                  )}
                  {work.status === 'sold' && (
                    <div className="text-xs text-red-400 font-medium mt-0.5 uppercase tracking-wider">Sold</div>
                  )}
                  {work.description && (
                    <div className="text-xs text-gray-400 font-light mt-1">{work.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Back link */}
      <div className="mt-12 pt-8 border-t border-black/[0.06]">
        <Link href="/artists" className="text-sage-500 text-sm hover:text-sage-700 transition-colors">
          ← Back to all artists
        </Link>
      </div>
    </section>
  )
}
