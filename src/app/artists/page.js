// ============================================================
// Script: page.js (artists)
// Path:   src/app/artists/page.js
// Desc:   Member artists grid + guest artists by year
//         Subtle pencil icon for artist login
// ============================================================

export const dynamic = "force-dynamic"
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export const metadata = {
  title: 'Artists — Farmstead Artists',
  description: 'Meet the member artists of Farmstead Artists in East Sullivan, Maine.',
}

const cardColors = [
  'bg-sage-600/10', 'bg-sky-600/10', 'bg-sage-500/10', 'bg-sky-500/10',
  'bg-sage-600/15', 'bg-sky-600/15', 'bg-sage-500/15', 'bg-sky-500/15',
]

export default async function ArtistsPage() {
  const { data: members } = await supabase
    .from('artists')
    .select('name, slug, medium, bio, photo_url')
    .eq('role', 'member')
    .order('sort_order')

  const { data: guests } = await supabase
    .from('artists')
    .select('name, slug, show_year')
    .eq('role', 'guest')
    .order('show_year', { ascending: false })
    .order('sort_order')

  const guestsByYear = (guests || []).reduce((acc, g) => {
    const year = g.show_year || 'Other'
    if (!acc[year]) acc[year] = []
    acc[year].push(g)
    return acc
  }, {})

  return (
    <section className="py-14 px-6 md:px-16 bg-cream-100 min-h-screen">
      <div className="text-[0.65rem] uppercase tracking-[0.2em] text-sage-600 font-semibold mb-2">Our Artists</div>
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-sage-700 mb-2">Member Artists</h1>
      <p className="text-gray-500 font-light mb-8 max-w-lg">
        Our collective of {(members || []).length} artists works in watercolors,
        oils, acrylics, pastels, collages, and more.
      </p>

      {/* Member grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {(members || []).map((artist, i) => (
          <div key={artist.slug} className="relative">
            <Link href={`/artists/${artist.slug}`} className="group block">
              <div className={`aspect-[3/4] rounded-lg overflow-hidden ${cardColors[i % cardColors.length]} flex items-end relative`}>
                {artist.photo_url ? (
                  <img
                    src={artist.photo_url}
                    alt={artist.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-serif text-4xl font-bold text-sage-600/30">
                      {artist.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
                <div className="relative z-10 w-full p-3 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="font-serif font-semibold text-cream-50 text-sm leading-tight">{artist.name}</div>
                  {artist.medium && (
                    <div className="text-[0.65rem] text-cream-50/70 font-light mt-0.5">{artist.medium}</div>
                  )}
                </div>
              </div>
            </Link>

            {/* Subtle pencil — artist login */}
            <Link
              href="/login"
              className="absolute top-2 right-2 z-20 text-white/40 hover:text-white/90 transition-colors text-base leading-none"
              title="Artist login"
            >
              🖊
            </Link>
          </div>
        ))}
      </div>

      {/* Guest Artists by year */}
      {Object.entries(guestsByYear).map(([year, yearGuests]) => (
        <div key={year} className="mt-12 pt-8 border-t border-black/[0.06]">
          <div className="text-[0.65rem] uppercase tracking-[0.2em] text-sage-600 font-semibold mb-2">
            {year} Guest Artists
          </div>
          <p className="text-gray-500 font-light mb-4 text-sm">
            Each show weekend we welcome guest artists who bring fresh perspectives and new work.
          </p>
          <div className="flex flex-wrap gap-2">
            {yearGuests.map(g => (
              <span key={g.slug} className="bg-cream-50 border border-black/[0.06] px-3 py-1.5 rounded-full text-sm text-sage-500">
                {g.name}
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* CTA */}
      <div className="mt-12 p-8 rounded-lg text-center text-cream-50" style={{ background: 'linear-gradient(135deg, #89A7B5, #5B7B6A)' }}>
        <h2 className="font-serif text-xl font-semibold mb-2">Interested in Showing Your Work?</h2>
        <p className="opacity-80 font-light text-sm mb-4">
          Maine artists are welcome to apply as Guest Artists for the 2026 summer season.
        </p>
        <a
          href="mailto:farmsteadartists@gmail.com?subject=Guest%20Artist%20Inquiry"
          className="inline-block bg-cream-50 text-sage-700 px-6 py-2.5 rounded font-semibold text-sm hover:-translate-y-0.5 transition-all"
        >
          Apply as Guest Artist
        </a>
      </div>
    </section>
  )
}

// end of file
